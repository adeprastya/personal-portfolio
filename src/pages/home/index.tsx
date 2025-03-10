import type { MinProject } from "../../types/Project";
import CustomFrame, { CustomFrameTop, CustomFrameBottom, CustomFrameRight } from "../../components/CustomFrame";
import MinProjectWrapper from "./MinProjectWrapper";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import DecryptedText from "../../blocks/TextAnimations/DecryptedText/DecryptedText";
import { ReactLenis } from "lenis/react";
import { useScroll } from "framer-motion";

const fetchMinProjects = async () => {
	const minProjects = await fetch(import.meta.env.VITE_BASE_API_URL + "/api/project")
		.then((res) => res.json())
		.then((data) => data.data);

	return minProjects;
};

export default function Home() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["minProjects"],
		queryFn: fetchMinProjects
	});

	const [onViewProject, setOnViewProject] = useState<number>(NaN);
	const [onScreen, setOnScreen] = useState<boolean[]>(() => (data ? Array(data.length).fill(false) : []));
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

	const { scrollYProgress } = useScroll();

	return (
		<>
			<CustomFrame
				wide={80}
				verticalWide={60}
				focusCrosshair
				frameClassName="bg-white/4 backdrop-blur"
				focusedCrosshair={isNaN(onViewProject)}
			>
				<CustomFrameTop>
					<div className="w-full h-full px-4 flex justify-between items-center">
						<span className="basis-1/3 font-kode text-6xl text-start text-zinc-300">
							<DecryptedText
								key={onViewProject}
								text={Number(onViewProject + 1)
									.toString()
									.padStart(2, "0")}
								animateOn="view"
							/>
						</span>
						<h1 className="basis-1/3 font-doto text-lg text-center">ADE / PORTFOLIO</h1>
						<span className="basis-1/3 font-doto font-semibold text-2xl text-end">
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
						<span className="font-doto text-lg text-start">
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
							disabled={isNaN(onViewProject)}
							className="border border-zinc-500 font-doto text-lg text-center hover:bg-zinc-500 active:bg-zinc-700 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-300 transition-colors duration-500 ease-initial cursor-pointer disabled:hover:bg-transparent disabled:active:bg-transparent disabled:focus:outline-none disabled:cursor-default disabled:opacity-30"
						>
							<DecryptedText text={"// Expand"} sequential parentClassName="px-3 py-1" />
						</button>
					</div>
				</CustomFrameBottom>
				<CustomFrameRight>
					<div className="size-full py-4 flex flex-col justify-end items-center gap-2">
						<span
							className="h-[14rem] px-2 border border-zinc-600 font-doto text-sm text-zinc-200 tracking-widest text-end"
							style={{ writingMode: "vertical-rl" }}
						>
							{"/".repeat(Math.ceil(scrollYProgress.get() * 20) + 1)}
						</span>
						<span className="font-kode text-xs text-zinc-400">{Math.ceil(scrollYProgress.get() * 100)}%</span>
					</div>
				</CustomFrameRight>
			</CustomFrame>

			<ReactLenis root>
				<main>
					{isLoading && <p>Loading...</p>}
					{error && <p>Error: {error.message}</p>}
					{data &&
						data.map((project: MinProject, i: number) => (
							<MinProjectWrapper
								key={project.id}
								project={project}
								handleOnScreen={(value: boolean) => handleOnScreen(i, value)}
							/>
						))}
				</main>
			</ReactLenis>
		</>
	);
}
