import { MinProject } from "../../../types/Project";
import TextMesh from "./TextMesh";
import { useThree } from "@react-three/fiber";
import { Center } from "@react-three/drei";

interface PeojectMeshProps {
	project: MinProject;
	index: number;
	handleVisible: (index: number, visible: boolean) => void;
}
export default function PeojectMesh({ project, index, handleVisible }: PeojectMeshProps) {
	// set project mesh y position
	const { height, width } = useThree((state) => state.viewport);
	const spacing = height * 0.6 + width * 0.6;

	return (
		<Center position={[0, -index * spacing, 0]}>
			<TextMesh title={project.title} index={index} handleVisible={handleVisible} />
		</Center>
	);
}
