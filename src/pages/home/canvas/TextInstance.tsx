import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Text3D, useIntersect } from "@react-three/drei";

// Shared text material
const goldMaterial = new THREE.MeshStandardMaterial({
	color: "#f7e263",
	emissive: "#a16b00",
	emissiveIntensity: 0.1,
	metalness: 1,
	roughness: 0
});

interface TextInstanceProps {
	title: string;
	handleVisible: (visible: boolean) => void;
}
export default function TextInstance({ title, handleVisible }: TextInstanceProps) {
	// set project mesh y position
	const { width } = useThree((state) => state.viewport);

	// set text scale
	const textScale = Math.min(1.5, width / 6);

	// update mesh visibility
	const meshRef = useIntersect((visible) => handleVisible(visible));

	return (
		<Text3D
			// @ts-expect-error: `ref` is a valid prop
			ref={meshRef}
			material={goldMaterial}
			scale={textScale}
			font={"/fonts/Ballet 60pt_Regular.json"}
			size={1}
			lineHeight={0.5}
			height={0.01}
			curveSegments={5}
			bevelEnabled={true}
			bevelThickness={0.01}
			bevelSize={0.01}
		>
			{title.split(" ").join("\n")}
		</Text3D>
	);
}
