<script>
	import "../app.css";
	import { page } from "$app/stores";
	import * as info from "$lib/info";
	import Footer from "$lib/Footer.svelte";
	import Header from "$lib/Header.svelte";
</script>

<svelte:head>
	<meta name="description" content={info.description} />
	<link rel="canonical" href="{info.url}{$page.url.pathname}" />
	<link
		type="application/atom+xml"
		rel="alternate"
		href="/feed.xml"
		title="{info.name}'s Blog Feed"
	/>
	<link rel="sitemap" type="application/xml" title="{info.name} - Sitemap" href="/sitemap.xml" />
	<meta name="author" content={info.name} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={info.name} />
	<meta property="og:description" content={info.description} />
	<meta property="og:url" content={info.canonical} />
	<meta property="og:site_name" content={info.name} />
</svelte:head>

<Header />

<main>
	<slot />
</main>

<Footer />

<style>
	main {
		flex: 1;
	}
</style>
