export const isMobile = ((): boolean => {
	if ("userAgentData" in navigator) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const navWithUAData = navigator as any;
		if (typeof navWithUAData.userAgentData.mobile === "boolean") {
			return navWithUAData.userAgentData.mobile;
		}
	}
	return /Mobi|Android/i.test(navigator.userAgent);
})();
