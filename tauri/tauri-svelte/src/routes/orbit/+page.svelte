<script lang="ts">
	import { Canvas } from "@threlte/core";
	import Scene from "./Scene.svelte";
	console.log("ORBIT");
</script>

<div class="container">
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	.container {
		height: 100%;
	}
</style>
