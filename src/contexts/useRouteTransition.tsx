/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ANIMATION_DURATION = 0.6;
const TRANSITION_DELAY = ANIMATION_DURATION * 1000 * 2;

interface TransitionComponentProps {
	isInitial: boolean;
}
function DefaultComponent({ isInitial }: TransitionComponentProps) {
	return (
		<motion.div
			initial={isInitial ? { opacity: 1 } : { opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
			className="fixed z-[999] top-0 left-0 w-screen h-screen flex items-center justify-center bg-black text-white"
		>
			Loading...
		</motion.div>
	);
}

interface RouteTransitionContext {
	handleTransition: (navFn: () => void) => Promise<void>;
	handleLoading: (isLoading: boolean) => void;
}
const routeTransitionContext = createContext<RouteTransitionContext | null>(null);

interface RouteTransitionProviderProps {
	children: React.ReactNode;
	component?: React.ComponentType<TransitionComponentProps>;
}

/**
 * @description
 * RouteTransitionProvider is a context provider that handles page
 * transitions.
 *
 * @param component
 * The component to use for the transition animation.
 *
 * @example
 * function MyTransition({ isInitial }: TransitionComponentProps) {
 * 	return (
 * 		<motion.div
 * 			initial={isInitial ? { opacity: 1 } : { opacity: 0 }}
 *			animate={{ opacity: 1 }}
 *			exit={{ opacity: 0 }}
 *			transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
 *			className="fixed z-[999] top-0 left-0 w-screen h-screen flex items-center justify-center bg-black text-white"
 *		>
 *			Loading...
 *		</motion.div>
 *	);
 * }
 *
 * @example
 * <RouteTransitionProvider component={MyTransition}>
 *   <Routes />
 * </RouteTransitionProvider>
 */
export function RouteTransitionProvider({ children, component = DefaultComponent }: RouteTransitionProviderProps) {
	const [isInitial, setIsInitial] = useState(true);
	const [isTransitioning, setIsTransitioning] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	// Initial preload animation
	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsInitial(false);
			setIsTransitioning(false);
		}, ANIMATION_DURATION * 1000);

		return () => clearTimeout(timeout);
	}, []);

	const handleTransition = async (navFn: () => void) => {
		setIsTransitioning(true);
		await new Promise((resolve) => setTimeout(resolve, TRANSITION_DELAY));
		navFn();
		setTimeout(() => setIsTransitioning(false), TRANSITION_DELAY);
	};

	const handleLoading = (loading: boolean) => {
		setIsLoading(loading);
	};

	return (
		<routeTransitionContext.Provider value={{ handleTransition, handleLoading }}>
			<AnimatePresence mode="wait">
				{(isTransitioning || isLoading) &&
					React.createElement(component, {
						isInitial
					})}
			</AnimatePresence>
			{children}
		</routeTransitionContext.Provider>
	);
}

/**
 * Hook to get the context of RouteTransitionProvider.
 *
 * @returns an object with two functions: handleTransition and handleLoading.
 * handleTransition is a function that takes a navigation function as an argument and does the transition animation.
 * handleLoading is a function that takes a boolean as an argument and sets the isLoading state of the provider.
 *
 * @example
 * import { useRouteTransition } from "./useRouteTransition";
 *
 * function MyComponent() {
 *   const { handleTransition, handleLoading } = useRouteTransition();
 *
 * 	 const [isLoading, setIsLoading] = useState(true);
 *   useEffect(() => {
 *     handleLoading(isLoading);
 *   }, [isLoading, handleLoading]);
 *
 *   return (
 *     <>
 *       <button onClick={() => handleTransition(() => navigate("/next-page"))}>Go to next page</button>
 *     </>
 *   );
 * }
 */
export function useRouteTransition() {
	const ctx = useContext(routeTransitionContext);
	if (!ctx) throw new Error("useRouteTransition must be used within a RouteTransitionProvider");
	return ctx;
}
