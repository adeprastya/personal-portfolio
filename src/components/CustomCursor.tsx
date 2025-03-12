import { MinProject } from "../types/Project";

export function CursorDefault() {
	const className =
		"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(6vw+3vh+50px)] aspect-square rounded-full border-t border-gold/60 animate-spin";

	return (
		<div className="relative w-[calc(6vw+3vh+50px)] aspect-square rounded-full">
			<div className={className} style={{ animationDuration: "2s" }} />
			<div className={className} style={{ animationDuration: "2.5s", animationDirection: "reverse" }} />
			<div className={className} style={{ animationDuration: "3s" }} />
			<div className={className} style={{ animationDuration: "3.5s", animationDirection: "reverse" }} />
			<div className={className} style={{ animationDuration: "4s" }} />
			<div className={className} style={{ animationDuration: "4.5s", animationDirection: "reverse" }} />
			<div className={className} style={{ animationDuration: "5s" }} />
			<div className={className} style={{ animationDuration: "5.5s", animationDirection: "reverse" }} />
		</div>
	);
}

export function HoveringProjectCursor({ project }: { project: MinProject }) {
	return (
		<div
			className="p-[1px] drop-shadow-cursor animate-shine"
			style={{
				backgroundImage:
					"linear-gradient(120deg, rgba(255, 215, 0, 0.9) 45%, oklch(0.985 0 0 / 0.9) 55%, rgba(255, 215, 0, 0.9) 65%, rgba(255, 215, 0, 0.9) 70%, oklch(0.985 0 0 / 0.9) 75%, rgba(255, 215, 0, 0.9) 80%)",
				backgroundSize: "200% 100%",
				animationDuration: "3s"
			}}
		>
			<img
				src={project.image_thumbnail_url}
				alt={project.title}
				className="w-[calc(7vw+4vh+150px)] aspect-video object-cover object-center brightness-90 dark:brightness-80 bg-neutral-500"
			/>
		</div>
	);
}
