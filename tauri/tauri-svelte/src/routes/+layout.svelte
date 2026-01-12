<div>
	<nav>
		<a href="/">Home</a>
		<a href="/game">Game</a>
		<a href="/orbit">Orbit</a>
		<a href="/cube">Cube</a>
	</nav>
	<slot />
</div>

<style>
	:root {
		--fg: #0f0f0f;
		--bg: #f6f6f6;
		font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
		font-size: 16px;
		line-height: 24px;
		font-weight: 400;

		color-scheme: light dark;

		color: light-dark(var(--fg), var(--bg));
		background-color: light-dark(var(--bg), var(--fg));

		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;
	}

	nav {
		border-bottom: 1px solid #ccc;
		display: flex;
		justify-content: space-around;
	}

	div {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
