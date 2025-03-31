import CustomPreload from "../../components/CustomPreload";
import AlwaysDecryptedText from "../../blocks/TextAnimations/DecryptedText/AlwaysDecryptedText";
import { motion } from "framer-motion";

const parentVars = {
	initial: {
		backdropFilter: "blur(6px)"
	},
	animate: {
		backdropFilter: "blur(6px)"
	},
	exit: {
		backdropFilter: "blur(0px)",
		transition: { delay: 0.8, duration: 0.8, ease: "easeOut" }
	}
};
export default function Preload({ deps }: { deps: boolean[] }) {
	return (
		<CustomPreload deps={deps} variants={parentVars}>
			{({ loadedPercentage }: { loadedPercentage: number }) => <LoadingPage loadedPercentage={loadedPercentage} />}
		</CustomPreload>
	);
}

const childVars = {
	initial: {
		height: "100dvh"
	},
	animate: {
		height: "100dvh"
	},
	exit: {
		height: "0",
		transition: { delay: 0.2, duration: 0.8, ease: "easeOut" }
	}
};
function LoadingPage({ loadedPercentage }: { loadedPercentage: number }) {
	return (
		<motion.div
			variants={childVars}
			initial="initial"
			animate="animate"
			exit="exit"
			className="bg-stone-200 dark:bg-zinc-900 overflow-hidden"
		>
			<div className="w-screen h-screen flex items-center justify-center">
				<div className="font-doto font-bold text-7xl  text-gold flex flex-col">
					<AlwaysDecryptedText alwaysDecrypt={loadedPercentage <= 33} text="POR" />
					<AlwaysDecryptedText alwaysDecrypt={loadedPercentage <= 66} text="TFO" />
					<AlwaysDecryptedText alwaysDecrypt={loadedPercentage <= 99} text="LIO" />
				</div>
			</div>
		</motion.div>
	);
}
