import type { MinProject } from "../../../types/Project";
import Lighting from "./Lighting";
import MouseObject from "./MouseObject";
import BgMesh from "./BgMesh";
import TextsGroup from "./TextsGroup";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";

interface CanvasSceneProps {
	projects: MinProject[];
	handleVisible: (index: number, visible: boolean) => void;
}
export default function CanvasScene({ projects, handleVisible }: CanvasSceneProps) {
	return (
		<Canvas camera={{ fov: 70, near: 0.1, far: 10, position: [0, 0, 5] }}>
			<Lighting />

			<ScrollControls pages={projects.length} damping={0.25} style={{ scrollbarWidth: "none" }}>
				<MouseObject />

				<BgMesh projectLength={projects.length} />

				<TextsGroup projects={projects} handleVisible={handleVisible} />
			</ScrollControls>
		</Canvas>
	);
}
