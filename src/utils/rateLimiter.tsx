export const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number): T => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return ((...args: Parameters<T>): void => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), wait);
	}) as T;
};

export const throttle = <T extends (...args: unknown[]) => unknown>(func: T, delay: number): T => {
	let lastCall = 0;
	let timeout: ReturnType<typeof setTimeout> | null = null;
	let lastArgs: Parameters<T> | undefined;
	let lastThis: ThisParameterType<T> | undefined;

	const throttledFunction = function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | undefined {
		lastArgs = args;
		lastThis = this as ThisParameterType<T>;
		const now = Date.now();
		const remaining = delay - (now - lastCall);

		if (remaining <= 0) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			lastCall = now;
			return func.apply(this, args) as ReturnType<T>;
		} else if (!timeout) {
			timeout = setTimeout(() => {
				lastCall = Date.now();
				timeout = null;
				if (lastArgs && lastThis) {
					func.apply(lastThis, lastArgs);
				}
			}, remaining);
		}
	};

	return throttledFunction as T;
};
