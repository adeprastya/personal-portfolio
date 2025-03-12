import { useState, useEffect } from "react";

export default function useLocalStorage(key: string, initialValue: string) {
	const [storedValue, setStoredValue] = useState(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`_useLocalStorage_ Error get localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = (value: string | ((v: string) => void)) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			console.error(`_useLocalStorage_ Error set localStorage key "${key}":`, error);
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				const item = window.localStorage.getItem(key);
				if (item) {
					setStoredValue(JSON.parse(item));
				}
			} catch (error) {
				console.error(`_useLocalStorage_ Error get localStorage key "${key}": `, error);
			}
		}
	}, [key]);

	return [storedValue, setValue];
}
