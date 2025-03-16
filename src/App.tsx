import "./styles/global.css";
import ContextProvider from "./contexts/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { router } from "./routes";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ContextProvider>
				<RouterProvider router={router} />
			</ContextProvider>
		</QueryClientProvider>
	);
}
