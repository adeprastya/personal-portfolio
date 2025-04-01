import { useThree } from "@react-three/fiber";
import { Text3D, useIntersect } from "@react-three/drei";

type TextMeshProps = {
	title: string;
	index: number;
	handleVisible: (index: number, visible: boolean) => void;
};
export default function TextMesh({ title, index, handleVisible }: TextMeshProps) {
	// set text size
	const { width } = useThree((state) => state.viewport);
	const maxTextWidth = width * 1;
	const textSize = Math.min(1.5, maxTextWidth / 6);

	// update mesh visibility
	const visibleRef = useIntersect((visible) => handleVisible(index, visible));

	return (
		<Text3D
			// @ts-expect-error: `ref` is a valid prop
			ref={visibleRef}
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
			<meshStandardMaterial color="#f7e263" emissive="#a16b00" emissiveIntensity={0.1} metalness={1} roughness={0} />

			{title.split(" ").join("\n")}
		</Text3D>
	);
}
