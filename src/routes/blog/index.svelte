<script context="module">
	export async function load({ fetch, url }) {
		const posts = await fetch(`${url.pathname}.json`).then((r) => r.json());
		return {
			props: {
				posts,
			},
		};
	}
</script>

<script>
	import { format } from "date-fns";
	import * as info from "$lib/info";

	export let posts;
</script>

<svelte:head>
	<title>Blog | {info.name}</title>
</svelte:head>

<article>
	{#each posts as post}
		<h1 class="postTitle">
			<a href={`/blog/${post.slug}`} class="postLink">{post.metadata.title}</a>
		</h1>
		<small class="postMeta">posted on {format(new Date(post.metadata.date), "MMMM d, yyyy")}</small>
		<p>{post.metadata.excerpt}</p>
	{/each}
</article>

<style>
	.postTitle {
		padding: 0.75em 0 0 0;
	}

	.postLink:hover {
		text-decoration: none;
		color: var(--text-color);
	}

	.postMeta {
		display: block;
		font-style: italic;
		font-size: var(--small-font-size);
		padding: 0 0 1em 0;
	}
</style>
