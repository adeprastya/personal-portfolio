import CustomPreload from "../../components/CustomPreload";
import AlwaysDecryptedText from "../../blocks/TextAnimations/DecryptedText/AlwaysDecryptedText";
import useTheme from "../../hooks/useTheme";
import { motion } from "framer-motion";

export default function Preload({ deps }: { deps: boolean[] }) {
	const { theme } = useTheme();
	const vars = {
		initial: {
			backgroundColor: theme === "light" ? "#e7e5e4" : "#18181b",
			backdropFilter: "blur(10px)"
		},
		animate: {
			backgroundColor: theme === "light" ? "#e7e5e4" : "#18181b",
			backdropFilter: "blur(10px)"
		},
		exit: {
			backgroundColor: "#0000001a",
			backdropFilter: "blur(0px)"
		}
	};

	return (
		<CustomPreload deps={deps} variants={vars}>
			{({ loadedPercentage }: { loadedPercentage: number }) => <LoadingPage loadedPercentage={loadedPercentage} />}
		</CustomPreload>
	);
}

function LoadingPage({ loadedPercentage }: { loadedPercentage: number }) {
	return (
		<motion.div
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className="font-doto text-[8rem] leading-none text-gold flex flex-col"
		>
			<AlwaysDecryptedText alwaysDecrypt={loadedPercentage <= 33} text="POR" />
			<AlwaysDecryptedText alwaysDecrypt={loadedPercentage <= 66} text="TFO" />
			<AlwaysDecryptedText alwaysDecrypt={loadedPercentage <= 99} text="LIO" />
		</motion.div>
	);
}
