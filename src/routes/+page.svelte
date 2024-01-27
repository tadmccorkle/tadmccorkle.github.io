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
		<a href={`/blog/${post.slug}`} class="post-link">
			<h1 class="post-title">
				<span class="post-title-text">{post.metadata.title}</span>
			</h1>
			<small class="post-meta"
				>posted on {format(new Date(post.metadata.date), "MMMM d, yyyy")}</small
			>
			<p>{post.metadata.excerpt}</p>
		</a>
	{/each}
</article>

<style>
	.post-link {
		color: var(--text-color);
	}

	.post-link:hover {
		text-decoration: none;
		color: var(--primary-color);
	}

	.post-title {
		padding: 0.75em 0 0.2em 0;
	}

	.post-title-text {
		border-bottom: solid 2px var(--primary-color);
	}

	.post-meta {
		display: block;
		font-style: italic;
		font-size: var(--small-font-size);
		color: var(--text-color);
		padding: 0 0 1em 0;
	}
</style>
