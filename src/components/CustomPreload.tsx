import type { Variants } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const defaultVars = {
	initial: {
		background: "black",
		backdropFilter: "blur(10px)"
	},
	animate: {
		background: "black",
		backdropFilter: "blur(10px)"
	},
	exit: {
		background: "transparent",
		backdropFilter: "blur(0px)"
	}
};

interface CustomPreloadProps {
	children:
		| React.ReactElement<{ loadedPercentage: number }>
		| ((props: { loadedPercentage: number }) => React.ReactNode);
	deps: boolean[];
	variants?: Variants;
}
/**
 * @param deps
 * Deps expected false when loading, and expected true when finished
 * @param variants
 * Expect initial, animate and exit properties, Variants type from framer-motion
 *
 * @example
 * <CustomPreload deps={[loading, loading]} variants={vars}>
 *   <>{({ loadedPercentage }: { loadedPercentage: number }) => <LoadingPage loadedPercentage={loadedPercentage} />}</>
 * </CustomPreload>
 */
export default function CustomPreload({ children, deps, variants = defaultVars }: CustomPreloadProps) {
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

	// Calculate percentage
	const [loadedPercentage, setLoadedPercentage] = useState(0);
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
					variants={variants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{
						delay: 0.3,
						duration: 0.3,
						ease: "easeInOut"
					}}
					className="fixed top-0 left-0 w-full h-full z-[999] flex items-center justify-center"
				>
					{typeof children === "function"
						? children({ loadedPercentage })
						: React.isValidElement(children)
						? React.cloneElement(children, { loadedPercentage })
						: children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
