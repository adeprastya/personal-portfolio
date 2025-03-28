import type { MinProject } from "../../types/Project";
import PreloadPage from "../../components/PreloadPage";
import CustomFrame, { CustomFrameTop, CustomFrameBottom, CustomFrameRight } from "../../components/CustomFrame";
import MinProjectWrapper from "./MinProjectWrapper";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import DecryptedText from "../../blocks/TextAnimations/DecryptedText/DecryptedText";
import { ReactLenis } from "lenis/react";
import { useScroll } from "framer-motion";
import useTheme from "../../hooks/useTheme";
import { useNavigate } from "react-router";

const fetchMinProjects = async () => {
	const minProjects = await fetch(import.meta.env.VITE_BASE_API_URL + "/api/project")
		.then((res) => res.json())
		.then((data) => data.data);
	return minProjects;
};

export default function Home() {
	const { data, isLoading } = useQuery({
		queryKey: ["minProjects"],
		queryFn: fetchMinProjects
	});

	const { theme, toggleTheme } = useTheme();

	const { scrollYProgress } = useScroll();

	const [onViewProject, setOnViewProject] = useState<number>(NaN);
	const [onScreen, setOnScreen] = useState<boolean[]>(() => (data ? Array(data.length).fill(false) : []));
	// Getting project that on view
	useEffect(() => {
		if (onScreen.some((e) => e === true)) {
			setOnViewProject(onScreen.indexOf(true as never) as number);
		} else {
			setOnViewProject(NaN);
		}
	}, [onScreen]);
	const handleOnScreen = useCallback((i: number, value: boolean) => {
		setOnScreen((prev) => {
			const updated = [...prev];
			updated[i] = value;
			return updated;
		});
	}, []);

	// Getting screen breakpoint
	const [screenBreakpoint, setScreenBreakpoint] = useState("xl");
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1280) {
				setScreenBreakpoint("xl");
			} else if (window.innerWidth >= 1024) {
				setScreenBreakpoint("lg");
			} else if (window.innerWidth >= 768) {
				setScreenBreakpoint("md");
			} else if (window.innerWidth >= 640) {
				setScreenBreakpoint("sm");
			} else {
				setScreenBreakpoint("xs");
			}
		};
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	});
	const horizontalWide = () => {
		switch (screenBreakpoint) {
			case "xl":
				return 80;
			case "lg":
				return 75;
			case "md":
				return 70;
			case "sm":
				return 65;
			default:
				return 60;
		}
	};
	const verticalWide = () => {
		switch (screenBreakpoint) {
			case "xl":
				return 60;
			case "lg":
				return 55;
			case "md":
				return 45;
			case "sm":
				return 40;
			default:
				return 35;
		}
	};

	// Navigation
	const navigate = useNavigate();
	const handleNavigate = () => navigate("/project/" + data?.[onViewProject].id);

	return (
		<>
			<PreloadPage deps={[!isLoading]} />

			<CustomFrame
				horizontalWide={horizontalWide()}
				verticalWide={verticalWide()}
				focusCrosshair
				frameClassName="bg-black/6 dark:bg-white/6 backdrop-blur"
				focusedCrosshair={isNaN(onViewProject)}
			>
				<CustomFrameTop>
					<div className="w-full h-full px-4 flex justify-between items-center">
						<span className="basis-1/3 font-kode text-4xl sm:text-5xl lg:text-6xl text-start text-stone-600 dark:text-zinc-300">
							<DecryptedText
								key={onViewProject}
								text={Number(onViewProject + 1)
									.toString()
									.padStart(2, "0")}
								animateOn="view"
							/>
						</span>
						<h1 className="basis-1/3 font-doto font-semibold dark:font-normal text-sm sm:text-base lg:text-lg text-center">
							ADE / PORTFOLIO
						</h1>
						<span className="basis-1/3 font-doto font-bold dark:font-semibold text-lg sm:text-xl lg:text-2xl text-end">
							<DecryptedText
								key={onViewProject}
								text={Array.isArray(data) ? (!isNaN(onViewProject) ? data[onViewProject].title : "Null") : "Null"}
								animateOn="view"
								speed={75}
								sequential
							/>
						</span>
					</div>
				</CustomFrameTop>
				<CustomFrameBottom>
					<div className="w-full h-full px-6 flex justify-between items-center">
						<span className="font-doto font-semibold dark:font-normal text-sm sm:text-base lg:text-lg text-start">
							<DecryptedText
								key={onViewProject}
								text={
									Array.isArray(data)
										? !isNaN(onViewProject)
											? data[onViewProject].created_at
											: "Undefined"
										: "Undefined"
								}
								animateOn="view"
								speed={100}
								sequential
							/>
						</span>
						<button
							type="button"
							onClick={handleNavigate}
							disabled={isNaN(onViewProject)}
							className="border border-stone-400 dark:border-zinc-500 font-doto font-semibold dark:font-normal text-sm sm:text-base lg:text-lg text-center hover:bg-stone-400 dark:hover:bg-zinc-500 active:bg-stone-600 dark:active:bg-zinc-700 focus:outline-2 focus:outline-offset-2 focus:outline-stone-700 dark:focus:outline-zinc-300 transition-colors duration-500 ease-initial cursor-pointer disabled:hover:bg-transparent disabled:active:bg-transparent disabled:focus:outline-none disabled:cursor-default disabled:opacity-30"
						>
							<DecryptedText text={"// Expand"} sequential parentClassName="px-3 py-1" />
						</button>
					</div>
				</CustomFrameBottom>
				<CustomFrameRight>
					<div className="size-full py-4 flex flex-col justify-evenly items-center gap-2">
						<button
							onClick={toggleTheme}
							type="button"
							className="size-6 lg:size-8 aspect-square bg-stone-400/50 dark:bg-zinc-600/50 hover:bg-stone-500/50 dark:hover:bg-zinc-500/50 font-doto font-bold dark:font-normal text-xs lg:text-sm text-center"
						>
							{theme === "light" ? "L" : "D"}
						</button>

						<div className="flex flex-col items-center gap-2">
							<span
								className="min-h-[14rem] w-fit px-2 border border-stone-400 dark:border-zinc-600 font-doto text-xs lg:text-sm font-bold dark:font-normal text-stone-800 dark:text-zinc-200 tracking-widest text-end"
								style={{ writingMode: "vertical-rl" }}
							>
								{"/".repeat(Math.ceil(scrollYProgress.get() * 20) + 1)}
							</span>
							<span className="font-kode text-[10px] lg:text-xs text-stone-500 dark:text-zinc-400">
								{Math.ceil(scrollYProgress.get() * 100)}%
							</span>
						</div>
					</div>
				</CustomFrameRight>
			</CustomFrame>

			<ReactLenis root options={{ infinite: true, syncTouch: true, smoothWheel: true }}>
				<main>
					{data &&
						data.map((project: MinProject, i: number) => (
							<MinProjectWrapper
								key={project.id}
								project={project}
								handleOnScreen={(value: boolean) => handleOnScreen(i, value)}
							/>
						))}
					{data && (
						<MinProjectWrapper
							key={data[0].id}
							project={data[0]}
							handleOnScreen={(value: boolean) => handleOnScreen(0, value)}
						/>
					)}
				</main>
			</ReactLenis>
		</>
	);
}
