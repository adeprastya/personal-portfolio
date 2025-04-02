import { RouteTransitionProvider } from "./useRouteTransition";
import RouteTransition from "../components/shared/RouteTransition";
import { CustomCursorProvider } from "./useCustomCursor";
import { CursorHidden } from "../components/shared/CustomCursor";

export default function ContextProvider({ children }: { children: React.ReactNode }) {
	return (
		<RouteTransitionProvider component={RouteTransition}>
			<CustomCursorProvider DefaultCursor={CursorHidden}>{children}</CustomCursorProvider>
		</RouteTransitionProvider>
	);
}
