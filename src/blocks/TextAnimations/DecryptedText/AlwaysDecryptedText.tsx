import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface DecryptedTextProps {
	text: string;
	speed?: number;
	maxIterations?: number;
	sequential?: boolean;
	revealDirection?: "start" | "end" | "center";
	useOriginalCharsOnly?: boolean;
	characters?: string;
	className?: string;
	encryptedClassName?: string;
	parentClassName?: string;
	animateOn?: "view" | "hover";
	alwaysDecrypt?: boolean;
	[key: string]: unknown;
}

export default function DecryptedText({
	text,
	speed = 50,
	maxIterations = 10,
	sequential = false,
	revealDirection = "start",
	useOriginalCharsOnly = false,
	characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
	className = "",
	parentClassName = "",
	encryptedClassName = "",
	animateOn = "hover",
	alwaysDecrypt = false,
	...props
}: DecryptedTextProps) {
	const getScrambledText = useCallback(
		(originalText: string, currentRevealed: Set<number>): string => {
			const availableChars = useOriginalCharsOnly
				? Array.from(new Set(originalText.split("").filter((char) => char !== " ")))
				: characters.split("");

			if (useOriginalCharsOnly) {
				const positions = originalText.split("").map((char, i) => ({
					char,
					isSpace: char === " ",
					index: i,
					isRevealed: currentRevealed.has(i)
				}));

				const nonSpaceChars = positions.filter((p) => !p.isSpace && !p.isRevealed).map((p) => p.char);

				for (let i = nonSpaceChars.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
				}

				let charIndex = 0;
				return positions
					.map((p) => {
						if (p.isSpace) return " ";
						if (p.isRevealed) return originalText[p.index];
						return nonSpaceChars[charIndex++];
					})
					.join("");
			} else {
				return originalText
					.split("")
					.map((char, i) => {
						if (char === " ") return " ";
						if (currentRevealed.has(i)) return originalText[i];
						return availableChars[Math.floor(Math.random() * availableChars.length)];
					})
					.join("");
			}
		},
		[useOriginalCharsOnly, characters]
	);

	const [displayText, setDisplayText] = useState<string>(() => {
		if (alwaysDecrypt) {
			return getScrambledText(text, new Set());
		} else {
			return text;
		}
	});
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const [isScrambling, setIsScrambling] = useState<boolean>(false);
	const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
	const [hasAnimated, setHasAnimated] = useState<boolean>(false);
	const containerRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (alwaysDecrypt) {
			setIsHovering(true);
		}
	}, [alwaysDecrypt]);

	useEffect(() => {
		if (alwaysDecrypt) {
			const scrambled = getScrambledText(text, new Set());
			setDisplayText(scrambled);
			setRevealedIndices(new Set());
		}
	}, [text, alwaysDecrypt, getScrambledText]);

	useEffect(() => {
		let interval: number;
		let currentIteration = 0;

		const getNextIndex = (revealedSet: Set<number>): number => {
			const textLength = text.length;
			switch (revealDirection) {
				case "start":
					return revealedSet.size;
				case "end":
					return textLength - 1 - revealedSet.size;
				case "center": {
					const middle = Math.floor(textLength / 2);
					const offset = Math.floor(revealedSet.size / 2);
					const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
					if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
						return nextIndex;
					}
					for (let i = 0; i < textLength; i++) {
						if (!revealedSet.has(i)) return i;
					}
					return 0;
				}
				default:
					return revealedSet.size;
			}
		};

		if (isHovering) {
			setIsScrambling(true);
			interval = setInterval(() => {
				setRevealedIndices((prevRevealed) => {
					if (sequential) {
						if (prevRevealed.size < text.length) {
							const nextIndex = getNextIndex(prevRevealed);
							const newRevealed = new Set(prevRevealed);
							newRevealed.add(nextIndex);
							setDisplayText(getScrambledText(text, newRevealed));
							return newRevealed;
						} else {
							if (!alwaysDecrypt) {
								clearInterval(interval);
								setIsScrambling(false);
							}
							return prevRevealed;
						}
					} else {
						setDisplayText(getScrambledText(text, prevRevealed));
						currentIteration++;

						// Hanya berhenti jika bukan alwaysDecrypt dan mencapai max iterations
						if (!alwaysDecrypt && currentIteration >= maxIterations) {
							clearInterval(interval);
							setIsScrambling(false);
							setDisplayText(text);
						}
						return prevRevealed;
					}
				});
			}, speed);
		} else {
			setDisplayText(text);
			setRevealedIndices(new Set());
			setIsScrambling(false);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isHovering, text, speed, maxIterations, sequential, revealDirection, getScrambledText, alwaysDecrypt]);

	useEffect(() => {
		if (animateOn !== "view") return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						setIsHovering(true);
						setHasAnimated(true);
					}
				});
			},
			{ threshold: 0.1 }
		);

		const currentRef = containerRef.current;
		if (currentRef) observer.observe(currentRef);

		return () => {
			if (currentRef) observer.unobserve(currentRef);
		};
	}, [animateOn, hasAnimated]);

	const hoverProps =
		animateOn === "hover" && !alwaysDecrypt
			? {
					onMouseEnter: () => setIsHovering(true),
					onMouseLeave: () => setIsHovering(false)
			  }
			: {};

	return (
		<motion.span
			ref={containerRef}
			className={`inline-block whitespace-pre-wrap ${parentClassName}`}
			{...hoverProps}
			{...props}
		>
			<span className="sr-only">{text}</span>
			<span aria-hidden="true">
				{displayText.split("").map((char, index) => {
					const isRevealedOrDone = revealedIndices.has(index) || (!alwaysDecrypt && !isScrambling);
					return (
						<span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
							{char}
						</span>
					);
				})}
			</span>
		</motion.span>
	);
}
