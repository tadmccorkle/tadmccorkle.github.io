<script>
	import { format } from "date-fns";
	import * as info from "$lib/info";

	export let data;

	const { post } = data;

	const postDate = format(new Date(post.metadata.date), "MMMM d, yyyy");
	const updated = post.metadata.updated
		? format(new Date(post.metadata.updated), "MMMM d, yyyy")
		: undefined;
</script>

<svelte:head>
	<meta property="og:type" content="article" />
	<title>{post.metadata.title} | {info.name}</title>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
	/>
	{#if post.metadata.katex}
		<link
			rel="stylesheet"
			href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
			integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
			crossorigin="anonymous"
		/>
	{/if}
</svelte:head>

<article>
	<h1 id="post-title">{post.metadata.title}</h1>
	<small id="post-meta">posted on {postDate}{updated ? ` | last updated ${updated}` : ""}</small>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html post.content}
</article>

<style>
	article {
		padding: 0 0 1rem 0;
	}

	#post-title {
		padding: 0.5em 0 0.1rem 0;
		font-size: 2rem;
	}

	#post-meta {
		display: block;
		font-style: italic;
		font-size: var(--small-font-size);
		padding: 0 0 1em 0;
	}
</style>
