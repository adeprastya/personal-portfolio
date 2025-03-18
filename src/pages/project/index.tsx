import type { Project } from "../../types/Project";
import CustomFrame, { CustomFrameBottom, CustomFrameTop } from "../../components/CustomFrame";
import DecryptedText from "../../blocks/TextAnimations/DecryptedText/DecryptedText";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";

const fetchProject = async (id: string): Promise<Project> => {
	const data = await fetch(import.meta.env.VITE_BASE_API_URL + "/api/project/" + id)
		.then((res) => res.json())
		.then((data) => data.data);
	return data;
};

export default function Project() {
	const { projectId } = useParams();

	const { data } = useQuery({
		queryKey: ["project"],
		queryFn: () => fetchProject(projectId as string)
	});

	const navigate = useNavigate();
	const handleBackClick = () => navigate("/");

	return (
		<main>
			{data && (
				<CustomFrame wide={60} frameClassName="bg-black/6 dark:bg-white/6 backdrop-blur">
					<div className="relative size-full grid grid-cols-2 grid-rows-2">
						{/* Corner / inset round */}
						<div className="absolute top-0 right-0 size-14 before:rounded-tr-4xl bg-black/6 dark:bg-white/6 before:absolute before:top-0 before:left-0 before:size-full before:backdrop-blur before:bg-stone-200" />
						<div className="absolute bottom-0 right-0 size-14 before:rounded-br-4xl bg-black/6 dark:bg-white/6 before:absolute before:top-0 before:left-0 before:size-full before:backdrop-blur before:bg-stone-200" />
						<div className="absolute bottom-0 left-0 size-14 before:rounded-bl-4xl bg-black/6 dark:bg-white/6 before:absolute before:top-0 before:left-0 before:size-full before:backdrop-blur before:bg-stone-200" />
						{/* /// */}

						{/* Title & tagline */}
						<div className="relative h-fit px-12 pb-6 bg-black/6 dark:bg-white/6 backdrop-blur rounded-br-4xl flex flex-col justify-center">
							<h1 className="mb-4 font-doto font-semibold text-[5rem] leading-none">
								<DecryptedText text={data?.title || ""} animateOn="view" speed={70} sequential />
							</h1>

							<p className="font-doto font-bold text-[2rem] leading-tight">
								<DecryptedText text={data?.tagline || ""} animateOn="view" speed={40} sequential />
							</p>

							<div className="absolute top-0 right-0 translate-x-full size-14 before:rounded-tl-4xl bg-black/6 dark:bg-white/6 before:absolute before:top-0 before:left-0 before:size-full before:backdrop-blur before:bg-stone-200" />

							<div className="absolute bottom-0 left-0 translate-y-full size-14 before:rounded-tl-4xl bg-black/6 dark:bg-white/6 before:absolute before:top-0 before:left-0 before:size-full before:backdrop-blur before:bg-stone-200" />
						</div>

						<div className="row-span-2 px-16 py-8 flex flex-col gap-4 justify-around">
							{/* Description */}
							<p className="tracking-wide text-stone-800">
								<BlurText text={data?.description} delay={10} />
							</p>

							{/* Images */}
							<div className="flex justify-evenly items-center">
								{data?.image_thumbnail_url && (
									<img
										src={data?.image_thumbnail_url}
										alt="Project Thumbnail"
										className="size-20 rounded-full border border-gold shadow-md object-cover object-center"
									/>
								)}

								<div className="grid grid-cols-3 gap-4">
									{Array.isArray(data?.image_preview_urls) &&
										data?.image_preview_urls.map((url, i) => (
											<img
												key={i}
												src={url}
												alt={`Preview ${i + 1}`}
												className="size-12 rounded-full border border-gold shadow-md object-cover object-center"
											/>
										))}
								</div>
							</div>
						</div>

						{/* Technologies */}
						<div className="p-16 flex justify-center items-center">
							<div className="flex flex-wrap gap-4 items-center">
								{Array.isArray(data?.technologies) &&
									data?.technologies.map((tech, i) => (
										<p
											key={i}
											className="px-4 py-1 rounded-full bg-stone-100 shadow-md text-sm tracking-wide text-stone-800"
										>
											<BlurText text={tech} />
										</p>
									))}
							</div>
						</div>
					</div>

					{/* Top */}
					<CustomFrameTop>
						<div className="p-4">
							<button
								onClick={handleBackClick}
								type="button"
								className="border border-stone-400 dark:border-zinc-500 font-doto font-semibold dark:font-normal text-sm sm:text-base lg:text-lg text-center hover:bg-stone-400 dark:hover:bg-zinc-500 active:bg-stone-600 dark:active:bg-zinc-700 focus:outline-2 focus:outline-offset-2 focus:outline-stone-700 dark:focus:outline-zinc-300 transition-colors duration-500 ease-initial cursor-pointer disabled:hover:bg-transparent disabled:active:bg-transparent disabled:focus:outline-none disabled:cursor-default disabled:opacity-30"
							>
								<DecryptedText text={"<- Back"} sequential parentClassName="px-3 py-1" />
							</button>
						</div>
					</CustomFrameTop>

					{/* Bottom */}
					<CustomFrameBottom>
						<div className="px-8 size-full flex gap-2 justify-between items-center">
							<p className="font-doto font-semibold">
								<DecryptedText text={data?.created_at || ""} animateOn="view" speed={100} sequential />
							</p>

							<div className="flex gap-6 font-doto font-semibold tracking-tight">
								{data?.site_url && (
									<a href={data.site_url} className="px-2 border-b-2 border-t-2 border-neutral-500/80">
										<DecryptedText text="Live Site //" animateOn="hover" speed={70} sequential />
									</a>
								)}
								{data?.source_code_url && (
									<a href={data.source_code_url} className="px-2 border-b-2 border-t-2 border-neutral-500/80">
										<DecryptedText text="Source Code //" animateOn="hover" speed={70} sequential />
									</a>
								)}
								{data?.demo_url && (
									<a href={data.demo_url} className="px-2 border-b-2 border-t-2 border-neutral-500/80">
										<DecryptedText text="Demo Video //" animateOn="hover" speed={70} sequential />
									</a>
								)}
							</div>
						</div>
					</CustomFrameBottom>
				</CustomFrame>
			)}
		</main>
	);
}
