<script>
	import { page } from "$app/stores";

	let errorMsg;
	console.log($page.state);
	if ($page.state === 404) {
		errorMsg = "Page not found";
	} else {
		errorMsg = $page.error?.message ?? "Error loading page";
	}
</script>

<svelte:head>
	<title>{$page.status} | Tad McCorkle</title>
</svelte:head>

<div class="center">
	<h1>{$page.status}</h1>
	<h2>
		{errorMsg}{" "}
		<div role="img" aria-label="Pensive emoji">😔</div>
	</h2>
	<a href="/">homepage</a>
</div>

<style>
	.center {
		margin: auto;
		text-align: center;
		padding: 2.4rem 0;
	}
</style>
