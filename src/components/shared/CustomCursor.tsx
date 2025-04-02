export function CursorHidden() {
	return null;
}

export function CursorDefault() {
	const className =
		"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(6vw+3vh+50px)] aspect-square rounded-full border-t border-gold/60 animate-spin";

	return (
		<div className="relative w-[calc(6vw+3vh+50px)] aspect-square rounded-full">
			<div className={className} style={{ animationDuration: "2s" }} />
			<div className={className} style={{ animationDuration: "2.5s", animationDirection: "reverse" }} />
			<div className={className} style={{ animationDuration: "3s" }} />
			<div className={className} style={{ animationDuration: "3.5s", animationDirection: "reverse" }} />
			<div className={className} style={{ animationDuration: "4s" }} />
			<div className={className} style={{ animationDuration: "4.5s", animationDirection: "reverse" }} />
			<div className={className} style={{ animationDuration: "5s" }} />
			<div className={className} style={{ animationDuration: "5.5s", animationDirection: "reverse" }} />
		</div>
	);
}
