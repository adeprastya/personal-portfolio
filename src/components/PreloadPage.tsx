import { useEffect, useState, useRef } from "react";
import AlwaysDecryptedText from "../blocks/TextAnimations/DecryptedText/AlwaysDecryptedText";
import { motion, AnimatePresence } from "framer-motion";
import useTheme from "../hooks/useTheme";

/**
 * @param deps
 * Deps expected false when loading, and expected true when finished
 */
export default function PreloadPage({ deps }: { deps: boolean[] }) {
	const { theme } = useTheme();
	const [fontsLoaded, setFontsLoaded] = useState(false);
	const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
	const imagesRef = useRef<HTMLImageElement[]>([]);

	// Fonts check
	useEffect(() => {
		document.fonts.ready.then(() => setFontsLoaded(true));
	}, []);

	// Images check
	useEffect(() => {
		const handleImageLoad = (event: Event) => {
			const img = event.target as HTMLImageElement;
			const index = imagesRef.current.indexOf(img);
			if (index !== -1) {
				setImagesLoaded((prev) => {
					const newState = [...prev];
					newState[index] = true;
					return newState;
				});
			}
		};

		const checkImages = () => {
			const newImages = Array.from(document.getElementsByTagName("img"));
			const newUntracked = newImages.filter((img) => !imagesRef.current.includes(img));

			newUntracked.forEach((img) => {
				imagesRef.current.push(img);
				setImagesLoaded((prev) => [...prev, false]);

				if (img.complete) {
					handleImageLoad({ target: img } as unknown as Event);
				} else {
					img.addEventListener("load", handleImageLoad);
					img.addEventListener("error", handleImageLoad);
				}
			});
		};

		checkImages();

		const observer = new MutationObserver(checkImages);
		observer.observe(document.body, { subtree: true, childList: true });

		return () => {
			observer.disconnect();
			imagesRef.current.forEach((img) => {
				img.removeEventListener("load", handleImageLoad);
				img.removeEventListener("error", handleImageLoad);
			});
			imagesRef.current = [];
		};
	}, []);

	const [loadedPercentage, setLoadedPercentage] = useState(0);

	// Calculate percentage
	useEffect(() => {
		const dependencies = [fontsLoaded, ...imagesLoaded, ...deps];

		const loadedCount = dependencies.filter(Boolean).length;
		const totalDependencies = dependencies.length;
		const percentage = totalDependencies === 0 ? 100 : Math.floor((loadedCount / totalDependencies) * 100);

		if (loadedPercentage <= 99) {
			setLoadedPercentage(percentage);
		}
	}, [fontsLoaded, imagesLoaded, deps, loadedPercentage]);

	return (
		<AnimatePresence>
			{loadedPercentage <= 99 && (
				<motion.div
					key="preloader"
					initial={{
						backgroundColor: theme === "light" ? "#e7e5e4" : "#18181b",
						backdropFilter: "blur(10px)"
					}}
					animate={{
						backgroundColor: theme === "light" ? "#e7e5e4" : "#18181b",
						backdropFilter: "blur(10px)"
					}}
					exit={{
						backgroundColor: "#0000001a",
						backdropFilter: "blur(0px)"
					}}
					transition={{
						delay: 0.3,
						duration: 0.3,
						ease: "easeInOut"
					}}
					className="fixed top-0 left-0 w-full h-full z-[999] flex items-center justify-center"
				>
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
				</motion.div>
			)}
		</AnimatePresence>
	);
}
