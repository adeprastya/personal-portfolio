import type { MinProject } from "../../types/Project";
import ShinyText from "../../blocks/TextAnimations/ShinyText/ShinyText";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface MinProjectWrapperProps {
	project: MinProject;
	handleOnScreen: (value: boolean) => void;
}
export default function MinProjectWrapper({ project, handleOnScreen }: MinProjectWrapperProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: false, amount: 0.9 });
	useEffect(() => {
		if (isInView) {
			handleOnScreen(true);
		} else {
			handleOnScreen(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView]);

	return (
		<div
			ref={ref}
			id={"project-" + project.id}
			className="w-full min-h-dvh lg:px-56 lg:py-32 flex justify-center items-center"
		>
			<motion.section
				initial={{ filter: "blur(0px)" }}
				animate={{ filter: isInView ? "blur(0px)" : "blur(10px)" }}
				transition={{ duration: 0.3, ease: "easeIn" }}
			>
				<motion.h3 className="font-ballet text-[10rem] leading-none">
					<ShinyText text={project.title} speed={4} />
				</motion.h3>
				<p className="font-bodoni text-[2rem] leading-tight text-stone-300">
					<BlurText text={project.tagline} delay={150} />
				</p>
			</motion.section>
			{/* <img src={project.image_thumbnail_url} alt={project.title} className="w-1/2" /> */}
		</div>
	);
}
