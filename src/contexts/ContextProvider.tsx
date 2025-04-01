import { CustomCursorProvider } from "./useCustomCursor";
import { CursorHidden } from "../components/CustomCursor";

export default function ContextProvider({ children }: { children: React.ReactNode }) {
	return <CustomCursorProvider DefaultCursor={CursorHidden}>{children}</CustomCursorProvider>;
}
