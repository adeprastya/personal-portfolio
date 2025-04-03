import { RouteTransitionProvider } from "./useRouteTransition";
import RouteTransition from "../components/shared/RouteTransition";
import { CustomCursorProvider } from "./useCustomCursor";

export default function ContextProvider({ children }: { children: React.ReactNode }) {
	return (
		<RouteTransitionProvider component={RouteTransition}>
			<CustomCursorProvider defaultCursor={() => <></>}>{children}</CustomCursorProvider>
		</RouteTransitionProvider>
	);
}
