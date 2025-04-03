import React from "react";
import { isMobile } from "../../utils/deviceInfo";

interface CustomFrameProps {
	horizontalWide?: number;
	verticalWide?: number;
	wide?: number;
	focusCrosshair?: boolean;
	focusedCrosshair?: boolean;
	frameClassName?: string;
	children?: React.ReactNode;
}
type ChildrenFrameType = {
	top: React.ReactNode;
	bottom: React.ReactNode;
	left: React.ReactNode;
	right: React.ReactNode;
	center: React.ReactNode;
};
export default function CustomFrame({
	horizontalWide = NaN,
	verticalWide = NaN,
	wide = 80,
	focusCrosshair = false,
	focusedCrosshair = false,
	frameClassName = "",
	children
}: CustomFrameProps) {
	const node: ChildrenFrameType = React.Children.toArray(children).reduce((acc, child) => {
		if (!React.isValidElement(child)) return acc;
		if (child.type === CustomFrameTop) {
			acc.top = child;
		} else if (child.type === CustomFrameBottom) {
			acc.bottom = child;
		} else if (child.type === CustomFrameLeft) {
			acc.left = child;
		} else if (child.type === CustomFrameRight) {
			acc.right = child;
		} else {
			acc.center = child;
		}
		return acc;
	}, {} as ChildrenFrameType);

	const horizontalStyle = {
		height: `${horizontalWide || wide}px`,
		width: "100%"
	};
	const verticalStyle = {
		width: `${verticalWide || wide}px`,
		height: `calc(100dvh - ${(horizontalWide || wide) * 2}px)`,
		top: `${horizontalWide || wide}px`
	};
	const childStyle = {
		top: `${horizontalWide || wide}px`,
		left: `${verticalWide || wide}px`,
		bottom: `${horizontalWide || wide}px`,
		right: `${verticalWide || wide}px`
	};

	return (
		<div className={`pointer-events-none z-10 fixed w-screen min-h-dvh`}>
			{/* Top Frame */}
			<div style={horizontalStyle} className={`pointer-events-auto absolute top-0 ${frameClassName}`}>
				{node.top}
			</div>
			{/* Bottom Frame */}
			<div style={horizontalStyle} className={`pointer-events-auto absolute bottom-0 ${frameClassName}`}>
				{node.bottom}
			</div>
			{/* Left Frame */}
			<div style={verticalStyle} className={`pointer-events-auto absolute left-0 ${frameClassName}`}>
				{node.left}
			</div>
			{/* Right Frame */}
			<div style={verticalStyle} className={`pointer-events-auto absolute right-0 ${frameClassName}`}>
				{node.right}
			</div>
			{focusCrosshair && (
				<FocusCrosshair
					horizontalWide={horizontalWide}
					verticalWide={verticalWide}
					wide={wide}
					focusedCrosshair={focusedCrosshair}
				/>
			)}
			<div style={childStyle} className="absolute">
				{node.center}
			</div>
		</div>
	);
}

interface FocusCrosshairProps {
	horizontalWide: number;
	verticalWide: number;
	wide: number;
	focusedCrosshair: boolean;
}
function FocusCrosshair({ horizontalWide, verticalWide, wide, focusedCrosshair }: FocusCrosshairProps) {
	const focusCrosshairStyle = {
		top: `${horizontalWide || wide}px`,
		left: `${verticalWide || wide}px`,
		width: `${window.innerWidth - (verticalWide || wide) * 2}px`,
		height: `${window.innerHeight - (horizontalWide || wide) * 2}px`
	};

	return (
		<div style={focusCrosshairStyle} className="pointer-events-none absolute">
			{/* Top Left */}
			<div
				className={`absolute top-4 left-4 w-[calc(5vw+5vh)] aspect-square border-t-2 border-l-2 transition-transform duration-300 ease-in-out ${
					focusedCrosshair
						? isMobile
							? "translate-x-3 translate-y-3 border-stone-500 dark:border-zinc-300"
							: "translate-x-8 translate-y-8 border-stone-500 dark:border-zinc-300"
						: "translate-x-0 translate-y-0 border-gold/80"
				}`}
			/>
			{/* Top Right */}
			<div
				className={`absolute top-4 right-4 w-[calc(5vw+5vh)] aspect-square border-t-2 border-r-2 transition-transform duration-300 ease-in-out ${
					focusedCrosshair
						? isMobile
							? "-translate-x-3 translate-y-3 border-stone-500 dark:border-zinc-300"
							: "-translate-x-8 translate-y-8 border-stone-500 dark:border-zinc-300"
						: "translate-x-0 translate-y-0 border-gold/80"
				}`}
			/>
			{/* Bottom Left */}
			<div
				className={`absolute bottom-4 left-4 w-[calc(5vw+5vh)] aspect-square border-b-2 border-l-2 transition-transform duration-300 ease-in-out ${
					focusedCrosshair
						? isMobile
							? "translate-x-3 -translate-y-3 border-stone-500 dark:border-zinc-300"
							: "translate-x-8 -translate-y-8 border-stone-500 dark:border-zinc-300"
						: "translate-x-0 translate-y-0 border-gold/80"
				}`}
			/>
			{/* Bottom Right */}
			<div
				className={`absolute bottom-4 right-4 w-[calc(5vw+5vh)] aspect-square border-b-2 border-r-2 transition-transform duration-300 ease-in-out ${
					focusedCrosshair
						? isMobile
							? "-translate-x-3 -translate-y-3 border-stone-500 dark:border-zinc-300"
							: "-translate-x-8 -translate-y-8 border-stone-500 dark:border-zinc-300"
						: "translate-x-0 translate-y-0 border-gold/80"
				}`}
			/>
		</div>
	);
}

const createFramePart = (displayName: string) => {
	const Component = React.memo(({ children }: { children: React.ReactNode }) => <>{children}</>);
	Component.displayName = displayName;
	return Component;
};
export const CustomFrameTop = createFramePart("CustomFrameTop");
export const CustomFrameBottom = createFramePart("CustomFrameBottom");
export const CustomFrameLeft = createFramePart("CustomFrameLeft");
export const CustomFrameRight = createFramePart("CustomFrameRight");
