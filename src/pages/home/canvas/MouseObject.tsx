import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

export default function MouseObject() {
	const meshRef = useRef<THREE.Mesh>(null!);
	const scroll = useScroll();
	// update mesh position and rotation
	useFrame((state, delta) => {
		// default rotation & scroll rotation
		meshRef.current.rotation.x += delta * 0.1 + scroll.delta * 10;
		meshRef.current.rotation.y += delta * 0.1 + scroll.delta * 10;

		// following mouse position
		const targetX = THREE.MathUtils.lerp(meshRef.current.position.x, state.pointer.x * 3, 0.01);
		const targetY = THREE.MathUtils.lerp(meshRef.current.position.y, state.pointer.y * 2, 0.01);
		meshRef.current.position.set(targetX, targetY, 2.5);
	});

	// update material color
	const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);
	const themeRef = useRef(document.body.getAttribute("data-theme"));
	// Using MutationObserver because RTF doesn't update when state change
	useEffect(() => {
		const observer = new MutationObserver(() => {
			const newTheme = document.body.getAttribute("data-theme");
			if (newTheme !== themeRef.current) {
				themeRef.current = newTheme;
				materialRef.current.color.set(document.body.getAttribute("data-theme") === "light" ? "#ffffff" : "#777777");
				materialRef.current.specularColor.set(
					document.body.getAttribute("data-theme") === "light" ? "#ffffff" : "#777777"
				);
			}
		});
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ["data-theme"]
		});

		return () => observer.disconnect();
	}, []);

	return (
		<group ref={meshRef}>
			<pointLight color="#ffffff" intensity={5} decay={1} castShadow={false} />

			<mesh>
				<octahedronGeometry args={[0.5]} />
				<meshPhysicalMaterial
					ref={materialRef}
					color={document.body.getAttribute("data-theme") === "light" ? "#ffffff" : "#777777"}
					roughness={0}
					metalness={0}
					thickness={0.2}
					specularIntensity={2}
					specularColor={document.body.getAttribute("data-theme") === "light" ? "#ffffff" : "#777777"}
					transmission={0.95}
					ior={2}
				/>
			</mesh>
		</group>
	);
}
