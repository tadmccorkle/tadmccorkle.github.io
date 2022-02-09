<script context="module">
	export function load({ error, status }) {
		return { props: { error, status } };
	}
</script>

<script>
	export let error;
	export let status;

	const errorMsg = status === 404 ? "Page not found" : error.message;
</script>

<svelte:head>
	<title>{status} | Tad McCorkle</title>
</svelte:head>

<div class="center">
	<h1>{status}</h1>
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
