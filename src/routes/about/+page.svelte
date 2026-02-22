<script>
	import * as info from "$lib/info";
</script>

<svelte:head>
	<title>About | {info.name}</title>
</svelte:head>

<article>
	<h1>About</h1>
	<p>
		I'm Tad McCorkle, a software developer. I'm currently working at
		<a href="https://www.leidos.com/">Leidos</a>
		on real-time ISR data management applications. I previously worked at
		<a href="https://gtri.gatech.edu/">GTRI</a>
		on applications for integrating and testing avionics and electronic warfare systems, among other
		things.
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
		padding: 0 0 var(--section-padding) 1em;
	}

	.details-icon {
		padding: 0 0.5em 0 0;
	}
</style>
