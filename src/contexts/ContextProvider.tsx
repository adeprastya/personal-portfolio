import { CustomCursorProvider } from "./useCustomCursor";

export default function ContextProvider({ children }: { children: React.ReactNode }) {
	return <CustomCursorProvider>{children}</CustomCursorProvider>;
}
