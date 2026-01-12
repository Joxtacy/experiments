<script>
	let beansDefault = 12.0;
	let waterDefault = 200.0;
	let beans = $state(beansDefault);
	let water = $state(waterDefault);
	let temperature = $state(100.0);
	let steepTime = $state(120);
	let waitTime = $state(30);
	let pressTime = $state(30);

	let comment = $state("");

	// let ratio = $derived((beans / (water / 1000)).toFixed(1));
	let ratio = $state(beansDefault / (waterDefault / 1000));

	/** @type {(e: Event) => void} */
	function ratioChange(e) {
		/** @type {EventTarget | null} */
		const target = e.currentTarget;

		if (!target) return;

		const val = target.value;
		ratio = val;
		beans = round((ratio * water) / 1000, 1);
	}

	/** @type {(e: Event) => void} */
	function beanChange(e) {
		/** @type {EventTarget | null} */
		const target = e.currentTarget;

		if (!target) return;

		const val = target.value;
		beans = val;
		ratio = round(beans / (water / 1000), 1);
	}

	/** @type {(e: Event) => void} */
	function waterChange(e) {
		/** @type {EventTarget | null} */
		const target = e.currentTarget;

		if (!target) return;

		const val = target.value;
		water = val;
		ratio = round(beans / (water / 1000), 1);
	}

	/** @type {(value: number, precision?: number) => number} */
	function round(value, precision = 0) {
		const multiplier = Math.pow(10, precision);
		return Math.round(value * multiplier) / multiplier;
	}
</script>

<div class="container flex flex-col">
	<div>
		<label for="beans">Beans (g)</label>
		<input
			name="beans"
			type="number"
			step="0.1"
			min="0"
			onchange={beanChange}
			bind:value={beans}
		/>
	</div>
	<div>
		<label for="water">Water (ml)</label>
		<input
			name="water"
			type="number"
			step="1"
			min="0"
			onchange={waterChange}
			bind:value={water}
		/>
	</div>

	<div>
		<label for="ratio">Ratio</label>
		<input
			name="ratio"
			type="number"
			step="0.1"
			min="0"
			onchange={ratioChange}
			bind:value={ratio}
		/>
	</div>

	<div>
		<label for="temperature">Temperature (˚C)</label>
		<input
			name="temperature"
			type="number"
			step="1"
			min="0"
			bind:value={temperature}
		/>
	</div>

	<div>
		<label for="steepTime">Steep Time (s)</label>
		<input
			name="steepTime"
			type="number"
			step="1"
			min="0"
			bind:value={steepTime}
		/>
	</div>

	<div>
		<label for="waitTime">Wait Time (s)</label>
		<input
			name="waitTime"
			type="number"
			step="1"
			min="0"
			bind:value={waitTime}
		/>
	</div>

	<div>
		<label for="pressTime">Press Time (s)</label>
		<input
			name="pressTime"
			type="number"
			step="1"
			min="0"
			bind:value={pressTime}
		/>
	</div>

	<label for="comment">Notes</label>
	<input
		name="comment"
		type="text"
		placeholder="Comment about the coffee"
		bind:value={comment}
	/>
</div>
