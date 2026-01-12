<svelte:options runes={true} />

<script>
</script>

<div class="calculator">
	<div class="keypad">
		<button class="key">7</button>
		<button class="key">8</button>
		<button class="key">9</button>
		<button class="key">x</button>
		<button class="key">4</button>
		<button class="key">5</button>
		<button class="key">6</button>
		<button class="key">-</button>
		<button class="key">1</button>
		<button class="key">2</button>
		<button class="key">3</button>
		<button class="key">+</button>
		<button class="key">0</button>
		<button class="key">.</button>
		<button class="key">(-)</button>
		<button class="key">Enter</button>
	</div>
</div>

<style>
	.calculator {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.keypad {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 10px;
	}

	.key {
		background-color: #f2f2f2;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 10px;
		text-align: center;
		cursor: pointer;
		text-transform: uppercase;
	}

	.key:hover {
		background-color: #ddd;
	}

	.key:active {
		background-color: #ccc;
	}
</style>
