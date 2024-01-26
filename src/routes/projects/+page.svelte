<script>
	export let data;
</script>

<h1>Projects</h1>

{#each data.projects as project}
	<a href={project.url} class="project">
		<h2>{project.name}</h2>
		<p>{project.description}</p>
	</a>
{/each}

<style>
	.project {
		color: var(--text-color);
	}

	.project:hover {
		text-decoration: none;
		color: var(--primary-color);
	}
</style>
