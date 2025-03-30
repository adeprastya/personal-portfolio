import CustomPreload from "../../components/CustomPreload";
import AlwaysDecryptedText from "../../blocks/TextAnimations/DecryptedText/AlwaysDecryptedText";
import { motion } from "framer-motion";

export default function Preload({ deps }: { deps: boolean[] }) {
	const vars = {
		initial: {
			backdropFilter: "blur(10px)"
		},
		animate: {
			backdropFilter: "blur(10px)"
		},
		exit: {
			backdropFilter: "blur(0px)",
			transition: { delay: 0.8, duration: 0.8, ease: "easeIn" }
		}
	};

	return (
		<CustomPreload deps={deps} variants={vars}>
			{({ loadedPercentage }: { loadedPercentage: number }) => <LoadingPage loadedPercentage={loadedPercentage} />}
		</CustomPreload>
	);
}

function LoadingPage({ loadedPercentage }: { loadedPercentage: number }) {
	const vars = {
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

	return (
		<motion.div
			variants={vars}
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
