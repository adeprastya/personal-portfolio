import type { MinProject } from "../../types/Project";
import ShinyText from "../../blocks/TextAnimations/ShinyText/ShinyText";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCustomCursor } from "../../contexts/useCustomCursor";
import { HoveringProjectCursor } from "../../components/CustomCursor";

interface MinProjectWrapperProps {
	project: MinProject;
	handleOnScreen: (value: boolean) => void;
}
export default function MinProjectWrapper({ project, handleOnScreen }: MinProjectWrapperProps) {
	const inViewRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(inViewRef, { once: false, amount: 0.8 });
	// Update onScreen state
	useEffect(() => {
		if (isInView) {
			handleOnScreen(true);
		} else {
			handleOnScreen(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView]);

	const cursorRef = useCustomCursor(() => <HoveringProjectCursor project={project} />, "-z-[1]");

	return (
		<div
			ref={inViewRef}
			id={"project-" + project.id}
			className="w-full min-h-dvh px-18 sm:px-28 md:px-36 lg:px-42 xl:px-46 lg:py-32 flex justify-center items-center"
		>
			<motion.section
				ref={cursorRef}
				initial={{ filter: "blur(0px)" }}
				animate={{ filter: isInView ? "blur(0px)" : "blur(10px)" }}
				transition={{ duration: 0.3, ease: "easeIn" }}
				className="relative z-10"
			>
				<motion.h3 className="w-fit font-ballet text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] leading-none drop-shadow-custom">
					<ShinyText text={project.title} speed={4} />
				</motion.h3>
				<p className="font-bodoni text-[1.2rem] sm:text-[1.5rem] md:text-[1.7rem] lg:text-[2rem] leading-tight font-semibold dark:font-normal text-stone-600 dark:text-stone-300 drop-shadow-custom">
					<BlurText text={project.tagline} delay={150} />
				</p>
			</motion.section>
		</div>
	);
}
