import { motion } from "framer-motion";

const parentVars = {
	initial: {
		backdropFilter: "blur(0px)"
	},
	animate: {
		backdropFilter: "blur(6px)",
		transition: { duration: 0.4, ease: "linear" }
	},
	exit: {
		backdropFilter: "blur(0px)",
		transition: { delay: 0.4, duration: 0.4, ease: "linear" }
	}
};
const childVars = {
	initial: {
		height: "0"
	},
	animate: {
		height: "100dvh",
		transition: { delay: 0.4, duration: 0.4, ease: "easeIn" }
	},
	exit: {
		height: "0",
		transition: { duration: 0.4, ease: "easeOut" }
	}
};

export default function RouteTransition({ isInitial }: { isInitial: boolean }) {
	return (
		<motion.div
			variants={parentVars}
			initial={isInitial ? "animate" : "initial"}
			animate="animate"
			exit="exit"
			className="fixed z-[999] top-0 left-0 w-screen h-screen"
		>
			<motion.div
				variants={childVars}
				initial={isInitial ? "animate" : "initial"}
				animate="animate"
				exit="exit"
				className="bg-stone-200 dark:bg-zinc-900 overflow-hidden"
			>
				<div className="w-screen h-screen flex items-center justify-center">
					<div className="p-2 border-2 border-gold font-doto font-semibold text-5xl text-gold flex flex-col animate-pulse">
						<span>POR</span>
						<span>TFO</span>
						<span>LIO</span>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
