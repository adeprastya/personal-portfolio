import type { MinProject } from "../../types/Project";
import Frame from "./Frame";
import CanvasScene from "./canvas/CanvasScene";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouteTransition } from "../../contexts/useRouteTransition";

const fetchProjects = async (): Promise<MinProject[]> => {
	try {
		const response = await fetch(import.meta.env.VITE_BASE_API_URL + "/api/project");
		if (!response.ok) throw new Error("Failed to fetch projects");
		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to fetch projects:", error);
		return [];
	}
};

export default function Home() {
	// Fetch projects
	const { data: projects = [], isLoading } = useQuery<MinProject[]>({
		queryKey: ["projects"],
		queryFn: fetchProjects
	});

	// Update preload animation
	const { handleLoading } = useRouteTransition();
	useEffect(() => handleLoading(isLoading), [isLoading, handleLoading]);

	// Get all project on view state
	const [projectsVisibility, setProjectsVisibility] = useState([false]);
	useEffect(() => setProjectsVisibility(Array(projects.length).fill(false)), [projects.length]);

	// Get project on view index
	const onViewProject = useMemo(() => {
		const projectsIsVisible = projectsVisibility.filter((e) => e === true);
		if (projectsIsVisible.length !== 1) return NaN;
		else return projectsVisibility.indexOf(true);
	}, [projectsVisibility]);

	const handleVisible = (index: number, visible: boolean) =>
		setProjectsVisibility((prev) => prev.map((v, i) => (i === index ? visible : v)));

	return (
		<main className="absolute top-0 left-0 w-screen h-dvh bg-stone-200 dark:bg-zinc-900">
			<Frame project={projects} onViewProject={onViewProject} />

			<CanvasScene projects={projects} handleVisible={handleVisible} />
		</main>
	);
}
