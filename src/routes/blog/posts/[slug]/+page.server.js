import { getMetadata, process } from "$lib/markdownConverter";
import { getPosts } from "$lib/postsReader";

export function load({ params }) {
	const posts = getPosts()
		.map((f) => {
			return {
				metadata: getMetadata(f),
				slug: f.slice(0, -3),
			};
		})
		// sorted in reverse chronological order
		.sort((a, b) => a.metadata.date - b.metadata.date);

	const slug = `posts/${params.slug}`;
	const index = posts.findIndex((p) => p.slug === slug);
	const post = process(`${slug}.md`);

	return {
		post,
		previous: posts[index - 1],
		next: posts[index + 1],
	};
}
