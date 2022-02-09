<script>
	import * as info from "$lib/info";
</script>

<footer>
	<span id="footer-copyright">
		<div>Copyright &COPY; {new Date().getFullYear()} {info.name}</div>
		<div>
			<a href="https://github.com/tadmccorkle/tadmccorkle.github.io/blob/master/LICENSE">
				All code is under MIT license
			</a>
		</div>
	</span>
	<span id="footer-links">
		<a href="https://github.com/tadmccorkle">github</a>
		•
		<a href="/feed.xml" target="_blank" rel="noopener noreferrer">feed</a>
	</span>
</footer>

<style>
	footer {
		display: flex;
		justify-content: space-between;
		font-size: 1.1rem;
		border-top: 1px solid var(--secondary-color);
		padding: 1rem 0;
	}

	#footer-links a {
		margin-right: 0.2em;
	}

	#footer-links a + a {
		margin-right: 0;
		margin-left: 0.2em;
	}

	@media (max-width: 380px) {
		footer {
			flex-direction: column;
		}

		#footer-links {
			order: -1;
		}

		#footer-copyright {
			order: 1;
		}
	}
</style>
