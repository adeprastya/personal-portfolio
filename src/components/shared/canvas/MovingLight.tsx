import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * @description A moving spotlight that moves in a circular pattern.
 */
export function MovingSpotLight() {
	const lightRef = useRef<THREE.SpotLight>(null!);
	const randomTime = [Math.random() + 0.5, Math.random() + 0.5];

	useFrame(({ clock }) => {
		lightRef.current.position.set(
			Math.sin(clock.elapsedTime * randomTime[0]) * 10,
			Math.sin(clock.elapsedTime * randomTime[1]) * 10,
			10
		);
	});

	return (
		<spotLight
			ref={lightRef}
			position={[0, 0, 10]}
			color={0xffffff}
			intensity={50}
			angle={0.3}
			penumbra={1}
			decay={1.5}
			castShadow={false}
		/>
	);
}
