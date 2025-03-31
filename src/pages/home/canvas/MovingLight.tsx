import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function MovingSpotLight() {
	const lightRef = useRef<THREE.SpotLight>(null!);
	const randomTime = [Math.random() + 0.5, Math.random() + 0.5];

	useFrame(({ clock }) => {
		lightRef.current.position.x = Math.sin(clock.elapsedTime * randomTime[0]) * 10;
		lightRef.current.position.y = Math.sin(clock.elapsedTime * randomTime[1]) * 10;
		lightRef.current.position.z = 10;
	});

	return (
		<spotLight
			ref={lightRef}
			position={[0, 0, 10]}
			color={0xffffff}
			intensity={100}
			angle={0.4}
			penumbra={1.5}
			decay={2}
		/>
	);
}
