<script>
	import * as info from "$lib/info";
</script>

<svelte:head>
	<title>Home | {info.name}</title>
</svelte:head>

<div class="welcomeContainer">
	<div class="welcome">
		<p>A personal website<br />by {info.name}.</p>
		<span id="site-links">
			<a href="/about">About</a>
			•
			<a href="/blog">Blog</a>
		</span>
	</div>
</div>

<style>
	.welcomeContainer {
		height: 100%;
		text-align: center;
		font-style: italic;
	}

	.welcome {
		position: relative;
		top: 30%;
	}

	#site-links {
		font-size: 1.1rem;
	}

	#site-links a {
		margin-right: 0.2em;
	}

	#site-links a + a {
		margin-right: 0;
		margin-left: 0.2em;
	}
</style>
