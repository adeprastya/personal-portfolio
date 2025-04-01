import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

export default function MouseObject() {
	const meshRef = useRef<THREE.Mesh>(null!);
	const scroll = useScroll();

	useFrame((state, delta) => {
		// Mesh rotation
		meshRef.current.rotation.x += delta * 0.1 + scroll.delta * 15;
		meshRef.current.rotation.y += delta * 0.1 + scroll.delta * 15;

		// Mesh following mouse
		const targetX = THREE.MathUtils.lerp(meshRef.current.position.x, state.pointer.x * 3, 0.01);
		const targetY = THREE.MathUtils.lerp(meshRef.current.position.y, state.pointer.y * 2, 0.01);
		meshRef.current.position.set(targetX, targetY, 2.5);
	});

	return (
		<group ref={meshRef}>
			<pointLight color="#ffffff" intensity={10} decay={0.2} />

			<mesh>
				<octahedronGeometry args={[0.5]} />
				<meshPhysicalMaterial
					color="#777777"
					roughness={0}
					metalness={0.3}
					thickness={0.2}
					transmission={1.2}
					ior={2}
				/>
			</mesh>
		</group>
	);
}
