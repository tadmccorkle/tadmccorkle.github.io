<script>
	import * as info from "$lib/info";
</script>

<svelte:head>
	<title>About | {info.name}</title>
</svelte:head>

<article>
	<h1>About</h1>
	<p>
		I'm Tad McCorkle, a software engineer. I consider myself a generalist software developer, and I
		have developed desktop, CLI, web, and mobile applications throughout my career. I work at
		<a href="https://gtri.gatech.edu">GTRI</a> where I've specialized in developing hardware-in-the-loop
		test software for electronic warfare systems. Most of my professional software development experience
		is in C# and TypeScript, but I like to explore other languages and technologies in my spare time.
	</p>

	<ul>
		<li>
			<span role="img" aria-label="Home emoji" class="details-icon">🏠</span> Georgia, USA
		</li>
		<li>
			<span role="img" aria-label="Email emoji" class="details-icon">📧</span>
			<a href="mailto:{info.mailto}">{info.email}</a>
		</li>
		<li>
			<span role="img" aria-label="Resume emoji" class="details-icon">📄</span>
			<a
				href="https://docs.google.com/document/d/1GYJQnuVZojqtJawzBJLJUHh1_-aBpw9C0-xLfjjG0CY/export?format=pdf&attachment=false"
				target="_blank"
				rel="noreferrer"
			>
				Resume
			</a>
		</li>
	</ul>
</article>

<style>
	ul {
		list-style: none;
		padding: 0 0 0 1em;
	}

	.details-icon {
		padding: 0 0.5em 0 0;
	}
</style>
