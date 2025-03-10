import { CustomCursorProvider } from "./useCustomCursor";
import { CursorDefault } from "../components/CustomCursor";

export default function ContextProvider({ children }: { children: React.ReactNode }) {
	return <CustomCursorProvider DefaultCursor={CursorDefault}>{children}</CustomCursorProvider>;
}
