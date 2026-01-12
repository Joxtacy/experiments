<script>
	/**
	 * @typedef {'X' | 'O' | null} Player
	 */

	/**
	 * @type {Player[]}
	 */
	let board = $state(Array(9).fill(null));
	let currentPlayer = $state(/** @type {Player} */ ("X"));
	let winner = $state(/** @type {Player} */ (null));

	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	function checkWinner() {
		for (const combination of winningCombinations) {
			const [a, b, c] = combination;
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				return board[a];
			}
		}
		return null;
	}

	/**
	 * @param {number} index
	 */
	function makeMove(index) {
		if (board[index] || winner) {
			return;
		}
		board[index] = currentPlayer;
		winner = checkWinner();
		if (!winner) {
			currentPlayer = currentPlayer === "X" ? "O" : "X";
		}
	}

	function resetGame() {
		board = Array(9).fill(null);
		currentPlayer = "X";
		winner = null;
	}

	const status = $derived(() => {
		if (winner) {
			return `Winner: ${winner}`;
		}
		if (board.every((cell) => cell)) {
			return "It's a draw!";
		}
		return `Next player: ${currentPlayer}`;
	});
</script>

<div class="game">
	<h1>Tic-Tac-Toe</h1>
	<div class="status">{status()}</div>
	<div class="board">
		{#each board as cell, i}
			<div class="cell" on:click={() => makeMove(i)}>
				{cell}
			</div>
		{/each}
	</div>
	<button on:click={resetGame}>Reset Game</button>
</div>

<style>
	.board {
		display: grid;
		grid-template-columns: repeat(3, 100px);
		grid-gap: 5px;
		margin-bottom: 20px;
	}

	.cell {
		width: 100px;
		height: 100px;
		border: 1px solid #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2em;
		cursor: pointer;
	}

	.status {
		font-size: 1.5em;
		margin-bottom: 10px;
	}

	button {
		padding: 10px 20px;
		font-size: 1em;
		cursor: pointer;
	}
</style>

