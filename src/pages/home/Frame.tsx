import type { Project } from "../../types/Project";
import CustomFrame, { CustomFrameTop, CustomFrameBottom, CustomFrameRight } from "../../components/CustomFrame";
import DecryptedText from "../../blocks/TextAnimations/DecryptedText/DecryptedText";
import useTheme from "../../hooks/useTheme";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Frame({ project, onViewProject }: { project: Project[]; onViewProject: number }) {
	const { theme, toggleTheme } = useTheme();

	// Update frame width
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

	// Expand button navigation
	const navigate = useNavigate();
	const handleNavigate = () => navigate("/project/" + project?.[onViewProject].id);

	return (
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
							text={Array.isArray(project) ? (!isNaN(onViewProject) ? project[onViewProject].title : "Null") : "Null"}
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
								Array.isArray(project)
									? !isNaN(onViewProject)
										? project[onViewProject].created_at
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
				</div>
			</CustomFrameRight>
		</CustomFrame>
	);
}
