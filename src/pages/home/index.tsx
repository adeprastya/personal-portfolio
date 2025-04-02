import type { MinProject } from "../../types/Project";
import Frame from "./Frame";
import CanvasScene from "./canvas/CanvasScene";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouteTransition } from "../../contexts/useRouteTransition";

const fetchProjects = async (): Promise<MinProject[]> => {
	const minProjects = await fetch(import.meta.env.VITE_BASE_API_URL + "/api/project")
		.then((res) => res.json())
		.then((data) => data.data);

	return minProjects;
};

export default function Home() {
	// Fetch projects
	const { data, isLoading } = useQuery<MinProject[]>({
		queryKey: ["projects"],
		queryFn: fetchProjects
	});
	const projects = data || [];

	// Update preload animation
	const { handleLoading } = useRouteTransition();
	useEffect(() => handleLoading(isLoading), [isLoading, handleLoading]);

	// Get project on view
	const [projectsVisibility, setProjectsVisibility] = useState([false]);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => setProjectsVisibility(Array(projects.length).fill(false)), [data]);
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
			<Frame project={projects} onViewProject={onViewProject} />

			<CanvasScene projects={projects} handleVisible={handleVisible} />
		</main>
	);
}
