import { process } from "$lib/markdownConverter";

export function load({ params }) {
	return { post: process(`posts/${params.slug}.md`) };
}
