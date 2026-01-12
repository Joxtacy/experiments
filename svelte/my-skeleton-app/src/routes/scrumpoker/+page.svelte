<h1>hi</h1>
<div class="flex items-center justify-around">
	<input type="radio" name="tshirt" id="size-s" />
	<label class="card-hover card p-0 w-28 h-36 rounded-lg" for="size-s">S</label>
	<input type="radio" name="tshirt" id="size-m" />
	<label class="card-hover card p-0 w-28 h-36 rounded-lg" for="size-m">M</label>
	<input type="radio" name="tshirt" id="size-l" />
	<label class="card-hover card p-0 w-28 h-36 rounded-lg" for="size-l">L</label>
</div>

<style>
	input[type="radio"] {
		display: none;
	}

	input[type="radio"]:checked + label {
		background-color: red;
	}

	label {
		line-height: 144px;
		text-align: center;
	}
</style>
