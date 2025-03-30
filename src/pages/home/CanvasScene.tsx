import type { Project } from "../../types/Project";
import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Center, Text3D, ScrollControls, useScroll, useIntersect } from "@react-three/drei";

interface TextObjectProps {
	project: Project;
	index: number;
	handleVisible: (index: number, visible: boolean) => void;
}
function TextObject({ project, index, handleVisible }: TextObjectProps) {
	const { height, width } = useThree((state) => state.viewport);

	const maxTextWidth = width * 0.7;
	const textSize = Math.min(1.8, maxTextWidth / 7);

	// update visible index
	const ref = useIntersect((visible) => {
		if (visible) {
			handleVisible(index, true);
		} else {
			handleVisible(index, false);
		}
	});

	return (
		<Center key={project.id} position={[0, -index * height * 2, 0]}>
			<Text3D
				scale={textSize}
				size={1}
				font={"/fonts/Ballet 60pt_Regular.json"}
				height={0.02}
				curveSegments={10}
				bevelEnabled={true}
				bevelThickness={0.02}
				bevelSize={0.01}
				// @ts-expect-error: `ref` is a valid prop
				ref={ref}
			>
				<meshPhysicalMaterial
					color="#f7e263"
					metalness={0.9}
					roughness={0}
					emissive="#f7bd36"
					emissiveIntensity={0.05}
				/>

				{/* TODO: CREATE DOT OBJECT, AND CHANGE INTERSECT REF TO IT. FOR BETTER INTERSECTION */}

				{project.title}
			</Text3D>
		</Center>
	);
}

interface ProjectsTextObjectProps {
	projects: Project[];
	handleVisible: (index: number, visible: boolean) => void;
}
function ProjectsTextObject({ projects, handleVisible }: ProjectsTextObjectProps) {
	const groupRef = useRef<THREE.Group>(null!);
	const scroll = useScroll();
	const { height } = useThree((state) => state.viewport);

	// Update text position based on scroll
	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.position.y = scroll.offset * height * 2 * (projects.length - 1);
		}
	});

	return (
		<group ref={groupRef}>
			{projects.map((project, i) => (
				<TextObject key={i} project={project} index={i} handleVisible={handleVisible} />
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
		<Canvas style={{ background: "transparent" }}>
			<ambientLight intensity={0.5} />
			<Environment preset="warehouse" />

			<ScrollControls pages={projects.length * 2} damping={0.15}>
				<ProjectsTextObject projects={projects} handleVisible={handleVisible} />
			</ScrollControls>
		</Canvas>
	);
}
