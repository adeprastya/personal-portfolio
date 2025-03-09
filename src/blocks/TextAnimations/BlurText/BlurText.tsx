/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BlurTextProps {
	text?: string;
	delay?: number;
	animateBy?: "words" | "letters";
	direction?: "top" | "bottom";
	threshold?: number;
	rootMargin?: string;
	animationFrom?: Record<string, any>;
	animationTo?: Record<string, any>[];
	easing?: (t: number) => number | string;
	onAnimationComplete?: () => void;
	className?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
	text = "",
	delay = 200,
	animateBy = "words",
	direction = "top",
	threshold = 0.1,
	rootMargin = "0px",
	animationFrom,
	animationTo,
	easing = "easeInOut",
	onAnimationComplete,
	className = ""
}) => {
	const elements = animateBy === "words" ? text.split(" ") : text.split("");
	const [inView, setInView] = useState(false);
	const ref = useRef<HTMLParagraphElement>(null);
	const animatedCount = useRef(0);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					if (ref.current) {
						observer.unobserve(ref.current);
					}
				}
			},
			{ threshold, rootMargin }
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, [threshold, rootMargin]);

	const defaultInitial =
		animationFrom ||
		(direction === "top" ? { filter: "blur(10px)", opacity: 0, y: -50 } : { filter: "blur(10px)", opacity: 0, y: 50 });

	const defaultSteps = animationTo || [
		{ filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
		{ filter: "blur(0px)", opacity: 1, y: 0 }
	];

	const animateVariant = {} as Record<string, unknown>;
	if (defaultSteps.length > 0) {
		Object.keys(defaultSteps[0]).forEach((key) => {
			animateVariant[key] = defaultSteps.map((step) => step[key]);
		});
	}

	const times =
		defaultSteps.length > 1
			? Array.from({ length: defaultSteps.length }, (_, i) => i / (defaultSteps.length - 1))
			: undefined;

	const duration = defaultSteps.length * 0.5;

	return (
		<span ref={ref} className={`blur-text ${className} flex flex-wrap`}>
			{elements.map((element, index) => (
				<motion.span
					key={index}
					initial={defaultInitial}
					animate={inView ? animateVariant : defaultInitial}
					transition={{
						delay: (index * delay) / 1000,
						duration,
						ease: easing,
						times
					}}
					onAnimationComplete={() => {
						animatedCount.current += 1;
						if (animatedCount.current === elements.length && onAnimationComplete) {
							onAnimationComplete();
						}
					}}
					className="inline-block"
				>
					{element === " " ? "\u00A0" : element}
					{animateBy === "words" && index < elements.length - 1 && "\u00A0"}
				</motion.span>
			))}
		</span>
	);
};

export default BlurText;
