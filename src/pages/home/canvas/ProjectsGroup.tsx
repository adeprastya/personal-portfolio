import { MinProject } from "../../../types/Project";
import PeojectMesh from "./ProjectMesh";
import { useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

interface ProjectsGroupProps {
	projects: MinProject[];
	handleVisible: (index: number, visible: boolean) => void;
}
export default function ProjectsGroup({ projects, handleVisible }: ProjectsGroupProps) {
	// Update project group position based on scroll
	const groupRef = useRef<THREE.Group>(null!);
	const scroll = useScroll();
	const { height, width } = useThree((state) => state.viewport);
	const spacing = height * 0.6 + width * 0.6;
	const targetY = useRef(0);
	const currentY = useRef(0);
	useFrame(() => {
		if (groupRef.current) {
			targetY.current = scroll.offset * spacing * (projects.length - 1);

			currentY.current = THREE.MathUtils.lerp(currentY.current, targetY.current, 0.05);

			groupRef.current.position.y = currentY.current;
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
