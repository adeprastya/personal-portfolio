import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useMotionValue, motion, AnimatePresence, useSpring, MotionValue } from "framer-motion";
import { debounce } from "../utils/rateLimiter";
import { isMobile } from "../utils/deviceInfo";

type CustomCursorType = React.FC;
type CustomCursorContextType = {
	x: MotionValue<number>;
	y: MotionValue<number>;
	setCustomCursor: (cursor: CustomCursorType) => void;
	setWrapperClassName: (className: string) => void;
	resetCustomCursor: () => void;
};
const CustomCursorContext = createContext<CustomCursorContextType | null>(null);

function CursorDefault() {
	return <div className="size-28 sm:size-36 xl:size-44 rounded-full backdrop-invert" />;
}
interface CustomCursorProviderProps extends React.PropsWithChildren {
	DefaultCursor?: CustomCursorType;
}
export function CustomCursorProvider({ children, DefaultCursor = CursorDefault }: CustomCursorProviderProps) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const springX = useSpring(x, { damping: 10, stiffness: 50 });
	const springY = useSpring(y, { damping: 10, stiffness: 50 });
	// Update cursor position
	useEffect(() => {
		const handleMousePosition = (e: MouseEvent) => {
			x.set(e.clientX);
			y.set(e.clientY);
		};
		window.addEventListener("mousemove", handleMousePosition);
		return () => window.removeEventListener("mousemove", handleMousePosition);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [inWindow, setInWindow] = useState<boolean>(false);
	// Update inWindow state
	useEffect(() => {
		if (isMobile()) return;
		const handleMouseMove = (e: MouseEvent) => {
			setInWindow(
				e.clientX > 20 && e.clientY > 20 && e.clientX < window.innerWidth - 20 && e.clientY < window.innerHeight - 20
			);
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const [customCursor, setCustomCursor] = useState<CustomCursorType>(() => DefaultCursor);
	const renderCustomCursor = useCallback(() => {
		if (typeof customCursor === "function") {
			return React.createElement(customCursor);
		} else if (React.isValidElement(customCursor)) {
			return customCursor;
		} else {
			throw new Error("Invalid custom cursor");
		}
	}, [customCursor]);

	const [wrapperClassName, setWrapperClassName] = useState<string>("");
	const getWrapperClassName = useCallback(() => wrapperClassName, [wrapperClassName]);

	const resetCustomCursor = useCallback(() => {
		setCustomCursor(DefaultCursor);
		setWrapperClassName("");
	}, [DefaultCursor]);

	return (
		<CustomCursorContext.Provider
			value={{ x: springX, y: springY, setCustomCursor, setWrapperClassName, resetCustomCursor }}
		>
			{children}
			{/* Custom Cursor */}
			<AnimatePresence mode="wait">
				<motion.div
					key={customCursor?.toString() + getWrapperClassName()}
					style={{ translateX: springX, translateY: springY }}
					variants={{
						hidden: { x: "-50%", y: "-50%", scale: 0 },
						visible: { x: "-50%", y: "-50%", scale: 1 }
					}}
					initial="hidden"
					animate={inWindow ? "visible" : "hidden"}
					exit="hidden"
					transition={{ duration: 0.2, ease: "easeInOut" }}
					className={`fixed top-0 left-0 pointer-events-none transform-gpu ${getWrapperClassName()}`}
				>
					{renderCustomCursor() as React.ReactElement}
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
		</CustomCursorContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCustomCursor<T extends HTMLElement = HTMLDivElement>(
	customCursor: CustomCursorType,
	wrapperClassName: string = ""
) {
	const ref = useRef<T>(null);
	const ctx = useContext(CustomCursorContext);
	if (!ctx) throw new Error("useCustomCursor must be used within a CustomCursorProvider");
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

/**
 * ## USAGE
 *
 * function MyCursor() {
 * return <div className="size-28 rounded-full bg-red-500" />;
 * }
 *
 * export default function MyComponent() {
 * const cursorRef = useCustomCursor(MyCursor);
 *
 * return (
 *   <div ref={cursorRef} className="p-4 bg-gray-200">
 *     Hover over me to see custom cursor!
 *   </div>
 * );
 * }
 */
