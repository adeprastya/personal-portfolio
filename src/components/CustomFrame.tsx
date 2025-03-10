import React from "react";

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

	return (
		<div className="pointer-events-none z-10 fixed w-full min-h-dvh">
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
			<div
				className={`absolute w-1/12 aspect-square border-t-2 border-l-2 transition-all duration-300 ease-in-out ${
					focusedCrosshair ? "top-12 left-12 border-zinc-300" : "top-4 left-4 border-[rgba(255,215,0,0.8)]"
				}`}
			/>
			<div
				className={`absolute w-1/12 aspect-square border-t-2 border-r-2 transition-all duration-300 ease-in-out ${
					focusedCrosshair ? "top-12 right-14 border-zinc-300" : "top-4 right-6 border-[rgba(255,215,0,0.8)]"
				}`}
			/>
			<div
				className={`absolute w-1/12 aspect-square border-b-2 border-l-2 transition-all duration-300 ease-in-out ${
					focusedCrosshair ? "bottom-12 left-12 border-zinc-300" : "bottom-4 left-4 border-[rgba(255,215,0,0.8)]"
				}`}
			/>
			<div
				className={`absolute w-1/12 aspect-square border-b-2 border-r-2 transition-all duration-300 ease-in-out ${
					focusedCrosshair ? "bottom-12 right-14 border-zinc-300" : "bottom-4 right-6 border-[rgba(255,215,0,0.8)]"
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
