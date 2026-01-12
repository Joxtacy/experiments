<script lang="ts">
	import { T, useTask, useThrelte } from "@threlte/core";
	import { Instance, InstancedMesh, useTexture } from "@threlte/extras";
	import { Color, DoubleSide, Vector3 } from "three";

	const map = useTexture("textures/star.png");

	const STAR_COUNT = 350;
	let stars = [];
	let colors = ["#fcaa67", "#c75d59", "#ffffc7", "#8cc5c6", "#a5898c"];

	function r(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	function resetStar(star) {
		if (r(0, 1) > 0.8) {
			// render stars closer to the spaceship
			star.pos = new Vector3(r(-10, -30), r(-5, 5), r(6, -6));
			star.len = r(1.5, 15);
		} else {
			star.pos = new Vector3(r(-15, -45), r(-10.5, 1.5), r(-15, -45));
			star.len = r(2.5, 20);
		}
		star.speed = r(19.5, 42);
		star.color = new Color(colors[Math.floor(Math.random() * colors.length)])
			.convertSRGBToLinear()
			.multiplyScalar(1.3);
		return star;
	}

	for (let i = 0; i < STAR_COUNT; i++) {
		let star = {
			pos: null,
			len: null,
			speed: null,
			color: null,
		};

		stars.push(resetStar(star));
	}

	useTask((delta) => {
		stars.forEach((star) => {
			star.pos.x += star.speed * delta;
			if (star.pos.x > 40) resetStar(star);
		});
		stars = stars;
	});
</script>

{#await map then value}
	<InstancedMesh limit={STAR_COUNT} range={STAR_COUNT}>
		<T.PlaneGeometry args={[1, 0.05]} />
		<T.MeshBasicMaterial side={DoubleSide} alphaMap={value} transparent />

		{#each stars as star}
			<Instance
				position={[star.pos.x, star.pos.y, star.pos.z]}
				scale={[star.len, 1, 1]}
				color={star.color}
			/>
		{/each}
	</InstancedMesh>
{/await}
