import type { Project } from "../../types/Project";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useTheme from "../../hooks/useTheme";
import DecryptedText from "../../blocks/TextAnimations/DecryptedText/DecryptedText";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";

const fetchProject = async (id: string): Promise<Project> => {
	const data = await fetch(import.meta.env.VITE_BASE_API_URL + "/api/project/" + id)
		.then((res) => res.json())
		.then((data) => data.data);
	return data;
};

export default function Project() {
	useTheme();
	const { projectId } = useParams();

	const { data } = useQuery({
		queryKey: ["project"],
		queryFn: () => fetchProject(projectId as string)
	});

	const navigate = useNavigate();
	const handleBackClick = () => navigate("/");

	return (
		<main className="overflow-hidden relative w-full min-h-dvh grid gap-4 auto-rows-auto grid-cols-2">
			{/* Negative Corners */}
			<div className="absolute top-12 right-12 size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:dark:bg-zinc-800 after:rounded-tr-3xl" />
			{/* Top Frame */}
			<div className="absolute top-0 left-0 w-full h-12 bg-stone-300 dark:bg-zinc-800" />
			{/* Side Frame */}
			<div className="absolute top-0 left-0 h-full w-4 sm:w-8 lg:w-12 bg-stone-300 dark:bg-zinc-800" />
			<div className="absolute top-0 right-0 h-full w-4 sm:w-8 lg:w-12 bg-stone-300 dark:bg-zinc-800" />

			{/* Title & Tagline */}
			<div className="relative col-span-full lg:col-span-1 h-full py-6 px-6 sm:px-12 lg:px-18 lg:rounded-br-3xl bg-stone-300 dark:bg-zinc-800 flex flex-col justify-center">
				{/* Negative Corners */}
				<div className="absolute bottom-0 left-4 sm:left-8 lg:left-12 translate-y-full size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:dark:bg-zinc-800 after:rounded-tl-3xl" />
				<div className="absolute bottom-0 right-4 sm:right-8 translate-y-full size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:rounded-tr-3xl lg:hidden" />
				<div className="absolute top-8 lg:top-12 right-0 translate-x-full size-8 bg-stone-300 dark:bg-zinc-800 after:absolute after:top-0 after:left-0 after:size-full after:bg-stone-200 dark:after:bg-zinc-900 after:rounded-tl-3xl" />

				<h1 className="mb-4 font-doto font-bold text-[2.7rem] sm:text-[3.5rem] lg:text-[4.5rem] leading-none">
					{data?.title}
				</h1>
				<p className="font-doto font-bold text-[1.4rem] sm:text-[1.8rem] lg:text-[2.2rem] leading-tight">
					{data?.tagline}
				</p>
			</div>

			{/* Technologies */}
			<div className="col-span-full lg:col-span-1 py-6 px-6 sm:px-12 lg:px-18 flex justify-center items-center tracking-wide text-xs sm:text-sm">
				<div className="flex gap-3 lg:gap-5 flex-wrap">
					{data?.technologies &&
						data.technologies.map((tech, index) => (
							<p
								key={index}
								className="px-3 py-1 sm:px-5 rounded-full bg-stone-50 dark:bg-zinc-800 shadow-md text-stone-700 dark:text-zinc-100"
							>
								{tech}
							</p>
						))}
				</div>
			</div>

			{/* Description & Images */}
			<div className="col-span-full h-full py-6 px-6 sm:px-12 lg:px-24 flex gap-12 flex-col lg:flex-row-reverse justify-between">
				<p className="basis-1/2 tracking-wide text-sm sm:text-base text-stone-600 dark:text-zinc-400 text-justify">
					{data?.description}
				</p>

				<div className="basis-1/2 flex gap-2 sm:gap-4 lg:gap-8 flex-wrap justify-evenly items-center">
					<img
						src={data?.image_thumbnail_url}
						alt={data?.title}
						className="size-14 sm:size-18 lg:size-24 rounded-full border border-gold shadow-md object-cover object-center"
					/>

					<div className="grid gap-2 sm:gap-4 grid-cols-3">
						{data?.image_preview_urls &&
							data.image_preview_urls.map((url, index) => (
								<img
									key={index}
									src={url}
									alt={data.title}
									className="size-10 sm:size-13 lg:size-16 rounded-full border border-gold shadow-md object-cover object-center"
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

				<p className="font-doto font-bold text-xs sm:text-sm lg:text-base">{data?.created_at}</p>

				<div className="flex gap-x-4 gap-y-2 flex-wrap">
					{data?.site_url && (
						<a
							href={data.site_url}
							className="border-t border-b border-stone-500 font-doto font-bold text-sm sm:text-base lg:text-lg text-stone-900 dark:text-zinc-100"
						>
							Live Site //
						</a>
					)}
					{data?.source_code_url && (
						<a
							href={data.source_code_url}
							className="border-t border-b border-stone-500 font-doto font-bold text-sm sm:text-base lg:text-lg text-stone-900 dark:text-zinc-100"
						>
							Source Code //
						</a>
					)}
					{data?.demo_url && (
						<a
							href={data.demo_url}
							className="border-t border-b border-stone-500 font-doto font-bold text-sm sm:text-base lg:text-lg text-stone-900 dark:text-zinc-100"
						>
							Demo Video //
						</a>
					)}
				</div>
			</div>
		</main>
	);
}
