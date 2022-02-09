<script>
	import * as info from "$lib/info";
</script>

<svelte:head>
	<title>About | {info.name}</title>
</svelte:head>

<article>
	<h1>About</h1>
	<p>
		I'm a software engineer at <a href="https://gtri.gatech.edu">GTRI</a> where I primarily do .NET application
		and class library development in C#, with a little bit of web dev on the side. In my free time I
		enjoy spending time with my wife, our one-year-old son, and our dog, running, music, movies, and
		software development.
	</p>

	<ul>
		<li>
			<span role="img" aria-label="Home emoji" class="detailsIcon">🏠</span> Warner Robins, GA
		</li>
		<li>
			<span role="img" aria-label="Email emoji" class="detailsIcon">📧</span>
			<a href="mailto:{info.mailto}">{info.email}</a>
		</li>
	</ul>
</article>

<style>
	ul {
		list-style: none;
		padding: 0 0 0 1em;
	}

	.detailsIcon {
		padding: 0 0.5em 0 0;
	}
</style>
