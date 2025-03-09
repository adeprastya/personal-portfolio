export type MinProject = {
	id: string;
	created_at: string;

	title: string;
	tagline: string;
	image_thumbnail_url: string;
};

export type Project = {
	id: string;
	created_at: string;

	title: string;
	tagline: string;
	description: string;
	technologies: string[];
	image_thumbnail_url: string;

	site_url?: string;
	source_code_url?: string;
	demo_url?: string;
	image_preview_urls?: string[];
};
