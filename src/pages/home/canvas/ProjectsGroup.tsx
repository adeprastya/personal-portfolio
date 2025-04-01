import { Project } from "../../../types/Project";
import PeojectMesh from "./ProjectMesh";
import { useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

interface ProjectsGroupProps {
	projects: Project[];
	handleVisible: (index: number, visible: boolean) => void;
}
export default function ProjectsGroup({ projects, handleVisible }: ProjectsGroupProps) {
	// Update project group position based on scroll
	const groupRef = useRef<THREE.Group>(null!);
	const scroll = useScroll();
	const { height, width } = useThree((state) => state.viewport);
	const spacing = height * 0.6 + width * 0.6;
	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.position.y = scroll.offset * spacing * (projects.length - 1);
		}
	});

	return (
		<group ref={groupRef}>
			{projects.map((project, i) => (
				<PeojectMesh key={project.id} project={project} index={i} handleVisible={handleVisible} />
			))}
		</group>
	);
}
