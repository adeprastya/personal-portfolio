import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useTheme(initialTheme: string = "light"): { theme: string; toggleTheme: () => void } {
	const [theme, setTheme] = useLocalStorage("theme", initialTheme);

	useEffect(() => {
		document.body.setAttribute("data-theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev: string) => (prev === "light" ? "dark" : "light"));
	};

	return { theme, toggleTheme };
}
