import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, useTexture } from "@react-three/drei";
import { useRef, useEffect } from "react";

export default function BgMesh({ projectLength }: { projectLength: number }) {
	// add perlin texture
	const texture = useTexture("/textures/perlin_texture.png");
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(3, 2);

	// update bump scale based on scroll with item position
	const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
	const scroll = useScroll();
	const { width, height } = useThree((state) => state.viewport);
	const spacing = height * 0.6 + width * 0.6;
	useFrame(() => {
		if (materialRef.current) {
			const totalScrollRange = spacing * (projectLength - 1);
			const worldScroll = scroll.offset * totalScrollRange;
			const nearestCenter = Math.round(worldScroll / spacing) * spacing;
			const distanceFromCenter = (worldScroll - nearestCenter) / spacing;
			const normalizedDistance = 1 - Math.abs(distanceFromCenter + distanceFromCenter);

			const newBumpScale = THREE.MathUtils.lerp(0, 1, Math.max(0, normalizedDistance - 0.4));
			if (Math.abs(materialRef.current.bumpScale - newBumpScale) > 0.1) {
				materialRef.current.bumpScale = newBumpScale;
			}
		}
	});

	// update material color
	const themeRef = useRef(document.body.getAttribute("data-theme"));
	// Using MutationObserver because RTF doesn't update when state change
	useEffect(() => {
		const observer = new MutationObserver(() => {
			const newTheme = document.body.getAttribute("data-theme");
			if (newTheme !== themeRef.current) {
				themeRef.current = newTheme;
				materialRef.current.color.set(document.body.getAttribute("data-theme") === "light" ? "#e7e5e4" : "#18181b");
			}
		});
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ["data-theme"]
		});

		return () => observer.disconnect();
	}, []);

	return (
		<mesh position={[0, 0, -5]} scale={[width * 2, height * 2, 1]}>
			<planeGeometry args={[1, 1, 1]} />
			<meshStandardMaterial
				ref={materialRef}
				color={themeRef.current === "light" ? "#e7e5e4" : "#18181b"}
				bumpMap={texture}
				bumpScale={1}
				roughness={0.7}
			/>
		</mesh>
	);
}
