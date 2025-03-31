import type { Project } from "../../types/Project";
import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Center, Text3D, ScrollControls, useScroll, useTexture, useIntersect } from "@react-three/drei";
import { MovingSpotLight } from "./canvas/MovingLight";

interface TextMeshProps {
	project: Project;
	index: number;
	handleVisible: (index: number, visible: boolean) => void;
}
function TextMesh({ project, index, handleVisible }: TextMeshProps) {
	// set text y position
	const { height, width } = useThree((state) => state.viewport);
	const maxTextWidth = width * 1;
	const textSize = Math.min(1.5, maxTextWidth / 6);

	// add perlin texture
	const texture = useTexture("/textures/perlin_texture.png");
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(0.5, 1);

	// update mesh visibility
	const visibleRef = useIntersect((visible) => handleVisible(index, visible));

	// Update roughness based on y-position
	const meshRef = useRef<THREE.Mesh>(null);
	useFrame(() => {
		if (meshRef.current?.material) {
			const worldPosition = new THREE.Vector3();
			meshRef.current.getWorldPosition(worldPosition);

			const distance = Math.max(0, Math.abs(worldPosition.y) - 0.2);
			const roughness = Math.max(0, Math.min(10, distance) * 0.2);

			const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
			material.roughness = roughness;
		}
	});

	return (
		<Center key={project.id} position={[0, -index * (height * 0.6 + width * 0.6), 0]}>
			<Text3D
				ref={(el) => {
					meshRef.current = el!;
					visibleRef.current = el!;
				}}
				scale={textSize}
				font={"/fonts/Ballet 60pt_Regular.json"}
				size={1}
				lineHeight={0.5}
				height={0.01}
				curveSegments={20}
				bevelEnabled={true}
				bevelThickness={0.01}
				bevelSize={0.01}
			>
				<meshPhysicalMaterial
					color="#f7e263"
					emissive="#a16b00"
					emissiveIntensity={0.1}
					metalness={1}
					roughnessMap={texture}
					roughness={10}
				/>

				{project.title.split(" ").join("\n")}
			</Text3D>
		</Center>
	);
}

interface ProjectsTextGroupProps {
	projects: Project[];
	handleVisible: (index: number, visible: boolean) => void;
}
function ProjectsTextGroup({ projects, handleVisible }: ProjectsTextGroupProps) {
	const groupRef = useRef<THREE.Group>(null!);
	const scroll = useScroll();
	const { height, width } = useThree((state) => state.viewport);

	// Update text group position based on scroll
	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.position.y = scroll.offset * (height * 0.6 + width * 0.6) * (projects.length - 1);
		}
	});

	return (
		<group ref={groupRef}>
			{projects.map((project, i) => (
				<TextMesh key={i} project={project} index={i} handleVisible={handleVisible} />
			))}
		</group>
	);
}

interface CanvasSceneProps {
	projects: Project[];
	handleVisible: (index: number, visible: boolean) => void;
}
export default function CanvasScene({ projects, handleVisible }: CanvasSceneProps) {
	return (
		<Canvas camera={{ fov: 70, near: 0.1, far: 100, position: [0, 0, 5] }} style={{ background: "transparent" }}>
			<Environment preset="warehouse" environmentIntensity={0.4} />
			<MovingSpotLight />
			<MovingSpotLight />

			<ScrollControls pages={projects.length} damping={0.3} style={{ scrollbarWidth: "none" }}>
				<ProjectsTextGroup projects={projects} handleVisible={handleVisible} />
			</ScrollControls>
		</Canvas>
	);
}
