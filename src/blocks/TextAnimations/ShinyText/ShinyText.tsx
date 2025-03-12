/*
	Installed from https://reactbits.dev/ts/tailwind/
*/

import React from "react";

interface ShinyTextProps {
	text: string;
	disabled?: boolean;
	speed?: number;
	className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = "" }) => {
	const animationDuration = `${speed}s`;

	return (
		<div
			className={`text-gold bg-clip-text inline-block ${disabled ? "" : "animate-shine"} ${className}`}
			style={{
				backgroundImage:
					"linear-gradient(120deg, oklch(0.985 0 0 / 0) 45%, oklch(0.985 0 0 / 1) 55%, oklch(0.985 0 0 / 0) 65%, oklch(0.985 0 0 / 0) 70%, oklch(0.985 0 0 / 1) 75%, oklch(0.985 0 0 / 0) 80%)",
				backgroundSize: "200% 100%",
				WebkitBackgroundClip: "text",
				animationDuration: animationDuration
			}}
		>
			{text}
		</div>
	);
};

export default ShinyText;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         shine: {
//           '0%': { 'background-position': '100%' },
//           '100%': { 'background-position': '-100%' },
//         },
//       },
//       animation: {
//         shine: 'shine 5s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// };
