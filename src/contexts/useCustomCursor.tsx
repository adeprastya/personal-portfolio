import React, { createContext, useContext, useEffect, useState, useCallback, useRef, isValidElement } from "react";
import { useMotionValue, motion, AnimatePresence, useSpring } from "framer-motion";

const isMobile = (): boolean => {
	if ("userAgentData" in navigator) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const navWithUAData = navigator as any;
		if (typeof navWithUAData.userAgentData.mobile === "boolean") {
			return navWithUAData.userAgentData.mobile;
		}
	}
	return /Mobi|Android/i.test(navigator.userAgent);
};

function CursorDefault() {
	return <div className="size-28 sm:size-36 xl:size-44 rounded-full backdrop-invert" />;
}
type CustomCursorType = React.FC;
type CustomCursorContextType = {
	setCustomCursor: (cursor: CustomCursorType) => void;
	setWrapperClassName: (className: string) => void;
};
const CustomCursorContext = createContext<CustomCursorContextType | null>(null);

export function CustomCursorProvider({ children }: { children: React.ReactNode }) {
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
	});

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

	const [customCursor, setCustomCursor] = useState<CustomCursorType>(CursorDefault);
	const renderCustomCursor = useCallback(() => {
		if (isValidElement(customCursor)) return customCursor;
		else throw new Error("Invalid custom cursor");
	}, [customCursor]);

	const [wrapperClassName, setWrapperClassName] = useState<string>("");
	const getWrapperClassName = useCallback(() => wrapperClassName, [wrapperClassName]);

	return (
		<CustomCursorContext.Provider value={{ setCustomCursor, setWrapperClassName }}>
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
					className={"fixed top-0 left-0 pointer-events-none transform-gpu" + getWrapperClassName()}
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
	const { setCustomCursor, setWrapperClassName } = ctx;

	// TODO: Fix when on scroll and then cursor is not hovering over the element it is not updated
	// Add mouseenter and mouseleave events
	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const handleMouseEnter = () => {
			setCustomCursor(customCursor);
			setWrapperClassName(wrapperClassName);
		};
		const handleMouseLeave = () => {
			setCustomCursor(CursorDefault);
			setWrapperClassName("");
		};

		element.addEventListener("mouseenter", handleMouseEnter);
		element.addEventListener("mouseleave", handleMouseLeave);
		return () => {
			element.removeEventListener("mouseenter", handleMouseEnter);
			element.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [customCursor, setCustomCursor, wrapperClassName, setWrapperClassName]);

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
