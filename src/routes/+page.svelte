<script>
	import { format } from "date-fns";
	import * as info from "$lib/info";

	export let data;
</script>

<svelte:head>
	<title>Blog | {info.name}</title>
</svelte:head>

<article>
	{#each data.posts as post}
		<a href={`/blog/${post.slug}`} class="postLink">
			<h1 class="postTitle">{post.metadata.title}</h1>
			<small class="postMeta"
				>posted on {format(new Date(post.metadata.date), "MMMM d, yyyy")}</small
			>
			<p>{post.metadata.excerpt}</p>
		</a>
	{/each}
</article>

<style>
	.postLink {
		color: var(--text-color);
	}

	.postLink:hover {
		text-decoration: none;
		color: var(--primary-color);
	}

	.postTitle {
		padding: 0.75em 0 0 0;
	}

	.postMeta {
		display: block;
		font-style: italic;
		font-size: var(--small-font-size);
		color: var(--text-color);
		padding: 0 0 1em 0;
	}
</style>
