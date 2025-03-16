import type { Project } from "../../types/Project";
import CustomFrame from "../../components/CustomFrame";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

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

	return (
		<>
			<CustomFrame />

			<main>
				<p>{data?.created_at}</p>

				<h1>{data?.title}</h1>

				<p>{data?.tagline}</p>

				<div>{Array.isArray(data?.technologies) && data?.technologies.map((tech, i) => <p key={i}>{tech}</p>)}</div>

				<p>{data?.description}</p>

				<div>
					<img src={data?.image_thumbnail_url} alt="Project Thumbnail" />

					<div>
						{Array.isArray(data?.image_preview_urls) &&
							data?.image_preview_urls.map((url, i) => <img key={i} src={url} alt={`Preview ${i + 1}`} />)}
					</div>
				</div>

				<div>
					{data?.site_url && <a href={data.site_url}>Live Site</a>}
					{data?.source_code_url && <a href={data.source_code_url}>Source Code</a>}
					{data?.demo_url && <a href={data.demo_url}>Demo Video</a>}
				</div>
			</main>
		</>
	);
}
