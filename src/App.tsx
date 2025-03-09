import "./styles/global.css";
import Home from "./pages/home";
import ContextProvider from "./contexts/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ContextProvider>
				<Home />
			</ContextProvider>
		</QueryClientProvider>
	);
}
