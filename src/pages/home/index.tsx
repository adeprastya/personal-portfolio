import type { MinProject, Project } from "../../types/Project";
import Preload from "./Preload";
import Frame from "./Frame";
import CanvasScene from "./CanvasScene";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchProjects = async (): Promise<Array<Project>> => {
	const minProjects = await fetch(import.meta.env.VITE_BASE_API_URL + "/api/project")
		.then((res) => res.json())
		.then((data) => data.data);

	const fullProjects = await Promise.all(
		minProjects.map((project: MinProject) =>
			fetch(import.meta.env.VITE_BASE_API_URL + "/api/project/" + project.id)
				.then((res) => res.json())
				.then((data) => data.data)
		)
	);

	return fullProjects;
};

export default function Home() {
	// Fetch projects
	const { data, isLoading } = useQuery<Array<Project>>({
		queryKey: ["projects"],
		queryFn: fetchProjects
	});

	// Update project that is currently on screen
	const [projectsVisibility, setProjectsVisibility] = useState([false]);
	useEffect(() => setProjectsVisibility(Array(data?.length).fill(false)), [data]);
	const [onViewProject, setOnViewProject] = useState(NaN);
	const handleVisible = (index: number, visible: boolean) =>
		setProjectsVisibility((prev) => prev.map((v, i) => (i === index ? visible : v)));
	useEffect(() => {
		const projectsIsVisible = projectsVisibility.filter((e) => e === true);
		if (projectsIsVisible.length !== 1) setOnViewProject(NaN);
		else setOnViewProject(projectsVisibility.indexOf(true));
	}, [projectsVisibility]);

	return (
		<main className="absolute top-0 left-0 w-screen h-dvh bg-stone-200 dark:bg-zinc-900">
			<Preload deps={[!isLoading]} />

			<Frame project={data || []} onViewProject={onViewProject} />

			<CanvasScene projects={data || []} handleVisible={handleVisible} />
		</main>
	);
}
