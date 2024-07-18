<script>
	import { onMount } from 'svelte';

	let spinning = $state(false);
	let contestants = $state(
		'Jeppe Deppe Dupp\nLizzie\nEvan\nKate\nSmallishbeans\nSolidarity\nShubble\nGeminiTay'
	);
	let numContestants = $derived(
		contestants
			.split('\n')
			.map((c) => c.trim())
			.filter((c) => c.length > 0).length
	);
	let contestantAngle = $derived(360.0 / numContestants);
	let mainAngle = $state(0);
	let angleD = $state(10);
	let spinsInDegrees = $state(0);

	const wheelHeight = 300;
	const wheelWidth = 300;
	const wheelCenterX = wheelWidth / 2;
	const wheelCenterY = wheelHeight / 2;
	const wheelRadius = Math.min(wheelWidth, wheelHeight) / 2;

	/** @type {HTMLCanvasElement} */
	let canvasElement;

	/**
	 * Converts degrees to radians
	 *
	 * @param {number} degrees - Angle in degrees
	 * @return {number} Angle in radians
	 *
	 * @example
	 *
	 *     degreesToRadians(180);
	 */
	const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

	onMount(() => {
		const ctx = canvasElement.getContext('2d');
		if (!ctx) {
			return;
		}

		drawWheel(ctx, mainAngle, spinsInDegrees);
	});

	function startSpin() {
		spinning = true;
		spinsInDegrees = getSpins(numContestants);
		drawWheel(canvasElement.getContext('2d'), mainAngle, spinsInDegrees);
	}

	/**
	 * Calculates the number of spins
	 * @param {number} numContestants
	 * @return {number} - Number of spins
	 */
	function getSpins(numContestants) {
		return Math.floor(Math.random() * 360 * numContestants) + 360 * numContestants;
	}

	/**
	 * Draws the wheel
	 *
	 * @param {CanvasRenderingContext2D | null} ctx - Canvas context
	 * @param {number} angle - Angle in degrees
	 * @param {number} endingAngle - Ending angle
	 * @return {void}
	 */
	function drawWheel(ctx, angle, endingAngle) {
		if (!ctx) {
			return;
		}
		ctx.clearRect(0, 0, wheelWidth, wheelHeight);
		for (let i = 0; i < numContestants; i++) {
			ctx.beginPath();
			ctx.moveTo(wheelCenterX, wheelCenterY);
			ctx.fillStyle = `hsl(${i * contestantAngle}, 100%, 50%)`;
			ctx.arc(
				wheelCenterX,
				wheelCenterY,
				wheelRadius,
				i * degreesToRadians(contestantAngle) + degreesToRadians(angle),
				(i + 1) * degreesToRadians(contestantAngle) + degreesToRadians(angle),
				false
			);
			ctx.fill();
		}
		drawWinnerMarker(ctx);
		if (spinning && mainAngle < endingAngle) {
			if (mainAngle > endingAngle / 2) {
				angleD = Math.max(angleD - 0.5, 0.1);
			}
			mainAngle += angleD;
			window.requestAnimationFrame(() => drawWheel(ctx, mainAngle, endingAngle));
		}
	}

	/**
	 * Draws the winner marker
	 *
	 * @param {CanvasRenderingContext2D | null} ctx - Canvas context
	 */
	function drawWinnerMarker(ctx) {
		if (!ctx) {
			return;
		}
		ctx.beginPath();
		ctx.fillStyle = 'green';
		ctx.moveTo(wheelWidth - 20, wheelCenterY);
		ctx.lineTo(wheelWidth, wheelCenterY - 5);
		ctx.lineTo(wheelWidth, wheelCenterY + 5);
		ctx.fill();
	}
</script>

<h1>Welcome to Wheel of Names</h1>
<div>
	<button
		onclick={() => {
			spinning = !spinning;
			drawWheel(canvasElement.getContext('2d'), mainAngle, spinsInDegrees);
		}}>{spinning ? 'Stop' : 'Start'}</button
	>
	{mainAngle}

	<button onclick={() => startSpin()}>spin {spinsInDegrees}</button>
</div>
<canvas bind:this={canvasElement} id="tutorial" width={wheelWidth} height={wheelHeight}
	>Wheel of names</canvas
>

<textarea
	name="contestants"
	id="contestants"
	oninput={() => drawWheel(canvasElement.getContext('2d'), mainAngle, spinsInDegrees)}
	bind:value={contestants}
	rows="10"
></textarea>

{#if numContestants > 0}
	<p>Number of contestants: {numContestants}</p>
{/if}

<style>
	canvas {
		border: 1px solid black;
	}
</style>
