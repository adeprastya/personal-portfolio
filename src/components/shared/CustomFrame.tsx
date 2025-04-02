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
export default function CustomFrame({
	horizontalWide = NaN,
	verticalWide = NaN,
	wide = 80,
	focusCrosshair = false,
	focusedCrosshair = false,
	frameClassName = "",
	children
}: CustomFrameProps) {
	let topChild: React.ReactNode;
	let bottomChild: React.ReactNode;
	let leftChild: React.ReactNode;
	let rightChild: React.ReactNode;
	let nodeChild: React.ReactNode;

	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) return;
		switch (child.type) {
			case CustomFrameTop:
				topChild = child;
				break;
			case CustomFrameBottom:
				bottomChild = child;
				break;
			case CustomFrameLeft:
				leftChild = child;
				break;
			case CustomFrameRight:
				rightChild = child;
				break;
			default:
				nodeChild = child;
				break;
		}
	});

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
				{topChild}
			</div>
			{/* Bottom Frame */}
			<div style={horizontalStyle} className={`pointer-events-auto absolute bottom-0 ${frameClassName}`}>
				{bottomChild}
			</div>
			{/* Left Frame */}
			<div style={verticalStyle} className={`pointer-events-auto absolute left-0 ${frameClassName}`}>
				{leftChild}
			</div>
			{/* Right Frame */}
			<div style={verticalStyle} className={`pointer-events-auto absolute right-0 ${frameClassName}`}>
				{rightChild}
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
				{nodeChild}
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
						? isMobile()
							? "translate-x-3 translate-y-3 border-stone-500 dark:border-zinc-300"
							: "translate-x-8 translate-y-8 border-stone-500 dark:border-zinc-300"
						: "translate-x-0 translate-y-0 border-gold/80"
				}`}
			/>
			{/* Top Right */}
			<div
				className={`absolute top-4 right-4 w-[calc(5vw+5vh)] aspect-square border-t-2 border-r-2 transition-transform duration-300 ease-in-out ${
					focusedCrosshair
						? isMobile()
							? "-translate-x-3 translate-y-3 border-stone-500 dark:border-zinc-300"
							: "-translate-x-8 translate-y-8 border-stone-500 dark:border-zinc-300"
						: "translate-x-0 translate-y-0 border-gold/80"
				}`}
			/>
			{/* Bottom Left */}
			<div
				className={`absolute bottom-4 left-4 w-[calc(5vw+5vh)] aspect-square border-b-2 border-l-2 transition-transform duration-300 ease-in-out ${
					focusedCrosshair
						? isMobile()
							? "translate-x-3 -translate-y-3 border-stone-500 dark:border-zinc-300"
							: "translate-x-8 -translate-y-8 border-stone-500 dark:border-zinc-300"
						: "translate-x-0 translate-y-0 border-gold/80"
				}`}
			/>
			{/* Bottom Right */}
			<div
				className={`absolute bottom-4 right-4 w-[calc(5vw+5vh)] aspect-square border-b-2 border-r-2 transition-transform duration-300 ease-in-out ${
					focusedCrosshair
						? isMobile()
							? "-translate-x-3 -translate-y-3 border-stone-500 dark:border-zinc-300"
							: "-translate-x-8 -translate-y-8 border-stone-500 dark:border-zinc-300"
						: "translate-x-0 translate-y-0 border-gold/80"
				}`}
			/>
		</div>
	);
}

export function CustomFrameTop({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
export function CustomFrameBottom({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
export function CustomFrameLeft({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
export function CustomFrameRight({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

CustomFrameTop.displayName = "CustomFrameTop";
CustomFrameBottom.displayName = "CustomFrameBottom";
CustomFrameLeft.displayName = "CustomFrameLeft";
CustomFrameRight.displayName = "CustomFrameRight";

CustomFrame.Top = CustomFrameTop;
CustomFrame.Bottom = CustomFrameBottom;
CustomFrame.Left = CustomFrameLeft;
CustomFrame.Right = CustomFrameRight;
