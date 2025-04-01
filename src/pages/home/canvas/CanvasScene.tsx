import type { Project } from "../../../types/Project";
import Lighting from "./Lighting";
import TextObject from "./TextObject";
import MouseObject from "./MouseObject";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";

interface CanvasSceneProps {
	projects: Project[];
	handleVisible: (index: number, visible: boolean) => void;
}
export default function CanvasScene({ projects, handleVisible }: CanvasSceneProps) {
	return (
		<Canvas camera={{ fov: 70, near: 0.1, far: 100, position: [0, 0, 5] }} style={{ background: "transparent" }}>
			<Lighting />

			<ScrollControls pages={projects.length} damping={0.3} style={{ scrollbarWidth: "none" }}>
				<MouseObject />
				<TextObject projects={projects} handleVisible={handleVisible} />
			</ScrollControls>
		</Canvas>
	);
}
