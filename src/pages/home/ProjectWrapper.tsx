import type { Project } from "../../types/Project";

interface ProjectWrapperProps {
	project: Project;
}
export default function ProjectWrapper({ project }: ProjectWrapperProps) {
	return (
		<section className="w-full min-h-dvh flex flex-col justify-center items-center">
			<p>{project.id}</p>
			<p>{project.created_at}</p>

			<h1>{project.title}</h1>
			<h2>{project.tagline}</h2>
			<p>{project.description}</p>
			<p>
				{project.technologies.map((tech, i) => (
					<span key={i}>{tech}</span>
				))}
			</p>

			<img src={project.image_thumbnail_url} alt={project.title} />

			{project.site_url && (
				<a href={project.site_url} target="_blank" rel="noopener noreferrer">
					Live Site Url
				</a>
			)}
			{project.source_code_url && (
				<a href={project.source_code_url} target="_blank" rel="noopener noreferrer">
					Source Code Url
				</a>
			)}
			{project.demo_url && (
				<a href={project.demo_url} target="_blank" rel="noopener noreferrer">
					Demo Video Url
				</a>
			)}

			{project.image_preview_urls &&
				project.image_preview_urls.map((url, i) => <img key={i} src={url} alt={project.title} />)}
		</section>
	);
}
