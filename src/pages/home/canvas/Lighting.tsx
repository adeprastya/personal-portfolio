import { Environment } from "@react-three/drei";
import { MovingSpotLight } from "../../../components/shared/canvas/MovingLight";

export default function Lighting() {
	return (
		<>
			<Environment preset="warehouse" environmentIntensity={0.4} background={false} blur={0.5} />
			<MovingSpotLight />
			<MovingSpotLight />
		</>
	);
}
