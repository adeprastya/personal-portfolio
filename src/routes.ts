import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Project from "./pages/project";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Home
	},
	{
		path: "project/:projectId",
		Component: Project
	}
]);
