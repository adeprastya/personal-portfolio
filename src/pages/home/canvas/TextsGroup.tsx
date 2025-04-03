import { MinProject } from "../../../types/Project";
import TextInstance from "./TextInstance";
import { useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useScroll, Center } from "@react-three/drei";

interface TextsGroupProps {
	projects: MinProject[];
	handleVisible: (index: number, visible: boolean) => void;
}
export default function TextsGroup({ projects, handleVisible }: TextsGroupProps) {
	const groupRef = useRef<THREE.Group>(null!);
	const scroll = useScroll();
	const { height, width } = useThree((state) => state.viewport);
	const spacing = height * 0.6 + width * 0.6;

	// Update project group position based on scroll
	const scrollY = useRef(0);
	useFrame(() => {
		if (groupRef.current) {
			const targetY = scroll.offset * spacing * (projects.length - 1);
			scrollY.current = THREE.MathUtils.lerp(scrollY.current, targetY, 0.05);
			groupRef.current.position.y = scrollY.current;
		}
	});

	return (
		<group ref={groupRef}>
			{projects.map((project, index) => (
				<Center key={index} position={[0, -index * spacing, 0]}>
					<TextInstance title={project.title} handleVisible={(v: boolean) => handleVisible(index, v)} />
				</Center>
			))}
		</group>
	);
}
