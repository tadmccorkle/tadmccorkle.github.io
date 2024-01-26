<script>
	import { page } from "$app/stores";
</script>

<header>
	<nav>
		<a href="/" class="home">TM</a>
		<div>
			<a href="/about" class="navLink" class:active={$page.url.pathname === "/about"}>About</a>
			<a href="/projects" class="navLink" class:active={$page.url.pathname === "/projects"}>
				Projects
			</a>
			<a href="/" class="navLink" class:active={$page.url.pathname === "/"}>Blog</a>
		</div>
	</nav>
</header>

<style>
	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 0 1rem 0;
		border-bottom: 1px solid var(--secondary-color);
	}

	nav a {
		font-family: var(--font-heading);
		color: var(--text-color);
	}

	nav a + a {
		margin-left: 1em;
	}

	nav a:hover {
		color: var(--primary-color);
		text-decoration: none;
		transition: color 0.2s linear;
	}

	.home {
		font-weight: 700;
		font-size: 2rem;
		letter-spacing: -4px;
	}

	.navLink {
		font-weight: 700;
		font-size: 1.3rem;
	}

	.active {
		color: var(--primary-color);
	}
</style>
