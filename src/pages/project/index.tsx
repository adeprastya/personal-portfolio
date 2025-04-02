import type { Project } from "../../types/Project";
import DecryptedText from "../../blocks/TextAnimations/DecryptedText/DecryptedText";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";
import CustomModal from "../../components/abstract/CustomModal";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouteTransition } from "../../contexts/useRouteTransition";
import useTheme from "../../hooks/abstract/useTheme";

const fetchProject = async (id: string): Promise<Project> => {
	const data = await fetch(import.meta.env.VITE_BASE_API_URL + "/api/project/" + id)
		.then((res) => res.json())
		.then((data) => data.data);
	return data;
};

export default function Project() {
	useTheme();

	// Fetch project
	const { projectId } = useParams();
	const { data, isLoading } = useQuery({
		queryKey: ["project-" + projectId],
		queryFn: () => fetchProject(projectId as string)
	});

	// Fullscreen image modal
	const [activeModal, setActiveModal] = useState("");

	const { handleTransition, handleLoading } = useRouteTransition();
	// Update preload animation
	useEffect(() => handleLoading(isLoading), [isLoading, handleLoading]);

	const navigate = useNavigate();
	// Back button navigation
	const handleNavigateHome = () => handleTransition(() => navigate("/"));

	return (
		<>
			<main className="overflow-hidden relative w-full min-h-dvh grid gap-4 auto-rows-auto grid-cols-2">
				{/* Negative Corners */}
				<div className="absolute top-12 right-12 size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:dark:bg-zinc-800 after:rounded-tr-3xl" />
				{/* Top Frame */}
				<div className="absolute top-0 left-0 w-full h-12 bg-stone-300 dark:bg-zinc-800" />
				{/* Side Frame */}
				<div className="absolute top-0 left-0 h-full w-4 sm:w-8 lg:w-12 bg-stone-300 dark:bg-zinc-800" />
				<div className="absolute top-0 right-0 h-full w-4 sm:w-8 lg:w-12 bg-stone-300 dark:bg-zinc-800" />

				{/* Back Button */}
				<button
					type="button"
					onClick={handleNavigateHome}
					className="absolute z-10 top-4 left-4 border border-stone-400 dark:border-zinc-500 font-doto font-semibold dark:font-normal text-sm sm:text-base lg:text-lg text-center hover:bg-stone-400 dark:hover:bg-zinc-500 active:bg-stone-600 dark:active:bg-zinc-700 focus:outline-2 focus:outline-offset-2 focus:outline-stone-700 dark:focus:outline-zinc-300 transition-colors duration-500 ease-initial cursor-pointer disabled:hover:bg-transparent disabled:active:bg-transparent disabled:focus:outline-none disabled:cursor-default disabled:opacity-30"
				>
					<DecryptedText text={"<- Back"} sequential parentClassName="px-2 py-0.5" />
				</button>

				{/* Title & Tagline */}
				<div className="relative col-span-full lg:col-span-1 h-full pt-16 pb-6 px-6 sm:px-12 lg:px-18 lg:rounded-br-3xl bg-stone-300 dark:bg-zinc-800 flex flex-col justify-center">
					{/* Negative Corners */}
					<div className="absolute bottom-0 left-4 sm:left-8 lg:left-12 translate-y-full size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:dark:bg-zinc-800 after:rounded-tl-3xl" />
					<div className="absolute bottom-0 right-4 sm:right-8 translate-y-full size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:rounded-tr-3xl lg:hidden" />
					<div className="absolute top-8 lg:top-12 right-0 translate-x-full size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:rounded-tl-3xl" />

					<h1 className="mb-4 font-doto font-bold text-[2.7rem] sm:text-[3.5rem] lg:text-[4.5rem] leading-none drop-shadow-custom">
						<DecryptedText text={data?.title || ""} animateOn="view" sequential speed={70} />
					</h1>
					<p className="font-doto font-bold text-[1.4rem] sm:text-[1.8rem] lg:text-[2.2rem] leading-tight drop-shadow-custom">
						<DecryptedText text={data?.tagline || ""} animateOn="view" sequential speed={40} />
					</p>
				</div>

				{/* Description */}
				<div className="col-span-full lg:col-span-1 py-6 lg:pt-16 px-6 sm:px-12 lg:pe-24 flex justify-center items-center tracking-wide text-xs sm:text-sm">
					<p className="tracking-wider text-xs sm:text-sm text-stone-600 dark:text-zinc-400">
						<BlurText text={data?.description} delay={25} />
					</p>
				</div>

				{/* Technologies & Images */}
				<div className="col-span-full h-full py-6 px-6 sm:px-12 lg:px-24 flex gap-12 flex-col lg:flex-row justify-between">
					<div className="basis-1/2 flex items-center justify-center">
						<div className="flex gap-3 lg:gap-5 flex-wrap">
							{data?.technologies &&
								data.technologies.map((tech, index) => (
									<motion.p
										key={index}
										className="px-3 py-1 sm:px-5 rounded-full bg-stone-50 dark:bg-zinc-800 shadow-md tracking-wider text-xs sm:text-sm text-stone-600 dark:text-zinc-300"
										custom={index}
										variants={vars}
										initial="hidden"
										animate="visible"
									>
										{tech}
									</motion.p>
								))}
						</div>
					</div>

					<div className="basis-1/2 flex gap-2 sm:gap-4 lg:gap-8 flex-wrap justify-evenly items-center">
						<motion.img
							src={data?.image_thumbnail_url}
							alt={data?.title}
							className="size-14 sm:size-18 lg:size-24 rounded-full border border-gold shadow-md object-cover object-center cursor-pointer"
							variants={vars}
							initial="hidden"
							animate="visible"
							onClick={() => setActiveModal(data?.image_thumbnail_url || "")}
						/>

						<div className="grid gap-2 sm:gap-4 grid-cols-3">
							{data?.image_preview_urls &&
								data.image_preview_urls.map((url, index) => (
									<motion.img
										key={index}
										src={url}
										alt={data.title}
										className="size-10 sm:size-13 lg:size-16 rounded-full border border-gold shadow-md object-cover object-center cursor-pointer"
										custom={index}
										variants={vars}
										initial="hidden"
										animate="visible"
										onClick={() => setActiveModal(url)}
									/>
								))}
						</div>
					</div>
				</div>

				{/* Created At & Links */}
				<div className="col-span-full relative h-full py-6 px-6 sm:px-12 bg-stone-300 dark:bg-zinc-800 flex gap-4 flex-wrap items-center justify-between">
					{/* Negative Corners */}
					<div className="absolute top-0 left-4 sm:left-8 lg:left-12 -translate-y-full size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:dark:bg-zinc-800 after:rounded-bl-3xl" />
					<div className="absolute top-0 right-4 sm:right-8 lg:right-12 -translate-y-full size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:rounded-br-3xl" />

					<p className="font-doto font-bold text-xs sm:text-sm lg:text-base text-stone-700 dark:text-zinc-300">
						<DecryptedText text={data?.created_at || ""} animateOn="view" sequential speed={80} />
					</p>

					<div className="flex gap-x-4 gap-y-2 flex-wrap">
						{data?.site_url && (
							<a
								target="_blank"
								href={data.site_url}
								className="border-t border-b border-stone-500 font-doto font-bold text-sm sm:text-base lg:text-lg text-stone-900 dark:text-zinc-200"
							>
								<DecryptedText text="Live Site //" animateOn="hover" sequential />
							</a>
						)}
						{data?.source_code_url && (
							<a
								target="_blank"
								href={data.source_code_url}
								className="border-t border-b border-stone-500 font-doto font-bold text-sm sm:text-base lg:text-lg text-stone-900 dark:text-zinc-200"
							>
								<DecryptedText text="Source Code //" animateOn="hover" sequential />
							</a>
						)}
						{data?.demo_url && (
							<a
								target="_blank"
								href={data.demo_url}
								className="border-t border-b border-stone-500 font-doto font-bold text-sm sm:text-base lg:text-lg text-stone-900 dark:text-zinc-200"
							>
								<DecryptedText text="Demo Video //" animateOn="hover" sequential />
							</a>
						)}
					</div>
				</div>

				{/* Fullscreen Image Modal */}
				<CustomModal show={activeModal !== ""} closeHandler={() => setActiveModal("")}>
					<img src={activeModal} alt="Fullscreen Image" className="size-full object-contain" />
				</CustomModal>
			</main>
		</>
	);
}

const vars = {
	hidden: {
		y: 5,
		opacity: 0,
		filter: "blur(6px)"
	},
	visible: (t: number) => ({
		y: 0,
		opacity: 1,
		filter: "blur(0px)",
		transition: { delay: t * 0.6, duration: 0.8, ease: "linear" }
	})
};
