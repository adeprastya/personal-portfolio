/* eslint-disable react-refresh/only-export-components */
import type { ElementType } from "react";
import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from "react";
import { useMotionValue, motion, AnimatePresence, useSpring, MotionValue } from "framer-motion";
import { debounce } from "../utils/rateLimiter";
import { isMobile } from "../utils/deviceInfo";

type CustomCursorType = ElementType;
type CustomCursorContextType = {
	x: MotionValue<number>;
	y: MotionValue<number>;
	setCustomCursor: (cursor: CustomCursorType) => void;
	setWrapperClassName: (className: string) => void;
	resetCustomCursor: () => void;
};
const customCursorContext = createContext<CustomCursorContextType | null>(null);

function CursorDefault() {
	return <div className="size-28 sm:size-36 xl:size-44 rounded-full backdrop-invert" />;
}

interface CustomCursorProviderProps {
	children: React.ReactNode;
	defaultCursor?: CustomCursorType;
}
export function CustomCursorProvider({ children, defaultCursor = CursorDefault }: CustomCursorProviderProps) {
	// Update cursor position
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const springX = useSpring(x, { damping: 10, stiffness: 50 });
	const springY = useSpring(y, { damping: 10, stiffness: 50 });
	useEffect(() => {
		if (isMobile) return;
		const handleMousePosition = (e: MouseEvent) => {
			x.set(e.clientX);
			y.set(e.clientY);
		};
		window.addEventListener("mousemove", handleMousePosition);
		return () => window.removeEventListener("mousemove", handleMousePosition);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Update is cursor in window
	const [inWindow, setInWindow] = useState<boolean>(false);
	useEffect(() => {
		if (isMobile) return;
		const handleMouseMove = (e: MouseEvent) => {
			setInWindow(
				e.clientX > 20 && e.clientY > 20 && e.clientX < window.innerWidth - 20 && e.clientY < window.innerHeight - 20
			);
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	// Update custom cursor
	const [customCursor, setCustomCursor] = useState<CustomCursorType>(defaultCursor);
	const renderCustomCursor = useMemo(() => {
		if (typeof customCursor === "function") {
			return React.createElement(customCursor);
		} else if (React.isValidElement(customCursor)) {
			return customCursor;
		} else {
			throw new Error("Invalid custom cursor component");
		}
	}, [customCursor]);

	// Update cursor wrapper class name
	const [wrapperClassName, setWrapperClassName] = useState<string>("");

	// Reset cursor and wrapper classname
	const resetCustomCursor = () => {
		setCustomCursor(defaultCursor);
		setWrapperClassName("");
	};

	return (
		<customCursorContext.Provider
			value={{ x: springX, y: springY, setCustomCursor, setWrapperClassName, resetCustomCursor }}
		>
			{children}

			{/* Custom Cursor */}
			<AnimatePresence mode="wait">
				<motion.div
					key={customCursor?.toString() + wrapperClassName}
					style={{ translateX: springX, translateY: springY }}
					variants={{
						hidden: { x: "-50%", y: "-50%", scale: 0 },
						visible: { x: "-50%", y: "-50%", scale: 1 }
					}}
					initial="hidden"
					animate={inWindow ? "visible" : "hidden"}
					exit="hidden"
					transition={{ duration: 0.2, ease: "easeInOut" }}
					className={`fixed top-0 left-0 pointer-events-none transform-gpu ${wrapperClassName}`}
				>
					{renderCustomCursor}
				</motion.div>
			</AnimatePresence>

			{/* Main Cursor */}
			<motion.div
				style={{ translateX: x, translateY: y }}
				variants={{
					hidden: { x: "-50%", y: "-50%", scale: 0 },
					visible: { x: "-50%", y: "-50%", scale: 1 }
				}}
				initial="hidden"
				animate={inWindow ? "visible" : "hidden"}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="fixed top-0 left-0 z-[999] pointer-events-none w-2 h-2 rounded-full backdrop-invert transform-gpu"
			/>
		</customCursorContext.Provider>
	);
}

/**
 * Use a custom cursor and wrapper class name for a given element.
 *
 * @param customCursor A React component to render as the custom cursor.
 * @param wrapperClassName A class name to apply to the custom cursor wrapper.
 *
 * @example
 * import { useCustomCursor } from "./useCustomCursor";
 *
 * function MyComponent() {
 *   useCustomCursor(CustomCursor, "wrapper-class");
 *   return <div>...</div>;
 * }
 */
export function useCustomCursor<T extends HTMLElement = HTMLDivElement>(
	customCursor: CustomCursorType,
	wrapperClassName: string = ""
) {
	const ref = useRef<T>(null);
	const ctx = useContext(customCursorContext);
	if (!ctx) throw new Error("__useCustomCursor__ must be used within a CustomCursorProvider");
	const { x, y, setCustomCursor, setWrapperClassName, resetCustomCursor } = ctx;
	const isInsideRef = useRef(false);

	// Mouse enter/leave and scroll events
	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const handleMouseEnter = () => {
			setCustomCursor(customCursor);
			setWrapperClassName(wrapperClassName);
		};
		const handleMouseLeave = () => resetCustomCursor();
		const handleScroll = () => {
			const rect = element.getBoundingClientRect();
			const isInside = x.get() >= rect.left && x.get() <= rect.right && y.get() >= rect.top && y.get() <= rect.bottom;

			if (isInside !== isInsideRef.current) {
				if (isInside) {
					handleMouseEnter();
				} else {
					handleMouseLeave();
				}
				isInsideRef.current = isInside;
			}
		};
		const debouncedHandleScroll = debounce(handleScroll, 200);

		window.addEventListener("scroll", debouncedHandleScroll, { passive: true });
		element.addEventListener("mouseenter", handleMouseEnter);
		element.addEventListener("mouseleave", handleMouseLeave);
		return () => {
			window.removeEventListener("scroll", debouncedHandleScroll);
			element.removeEventListener("mouseenter", handleMouseEnter);
			element.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [customCursor, setCustomCursor, resetCustomCursor, wrapperClassName, setWrapperClassName, x, y]);

	return ref;
}
