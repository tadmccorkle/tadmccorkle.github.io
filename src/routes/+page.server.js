import { getMetadata } from "$lib/markdownConverter";
import { getPosts } from "$lib/postsReader";

export const prerender = true;

export function load() {
	const posts = getPosts()
		.map((f) => {
			return {
				metadata: getMetadata(f),
				slug: f.slice(0, -3),
			};
		})
		// sorted in reverse chronological order
		.sort((a, b) => b.metadata.date - a.metadata.date);

	return { posts };
}
