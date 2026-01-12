<script lang="ts">
	import { T, useTask } from "@threlte/core";
	import { Gizmo, interactivity, OrbitControls } from "@threlte/extras";
	import { spring } from "svelte/motion";

	interactivity();
	const scale = spring(1);
	// scale.damping = 0.1; // default 0.8
	// scale.stiffness = 0.8; // default 0.15

	let rotation = 0;
	useTask((delta) => {
		rotation += delta;
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[10, 10, 10]}
	on:create={({ ref, cleanup }) => {
		ref.lookAt(0, 1, 0);

		cleanup(() => console.log("Camera removed"));
	}}
>
	<OrbitControls enableDamping enableZoom />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={1} position={[0, 10, 10]} castShadow />

<Gizmo horizontalPlacement="left" paddingX={20} paddingY={20} />

<T.Mesh
	rotation.y={rotation}
	position.y={1}
	scale={$scale}
	on:pointerenter={() => scale.set(1.5)}
	on:pointerleave={() => scale.set(1)}
	castShadow
>
	<T.BoxGeometry args={[1, 2, 1]} />
	<T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh
	rotation.y={rotation}
	position.y={1.5}
	position.x={-2}
	scale={$scale}
	on:pointerenter={() => scale.set(1.5)}
	on:pointerleave={() => scale.set(1)}
	castShadow
>
	<T.BoxGeometry args={[1, 3, 1]} />
	<T.MeshStandardMaterial color="red" />
</T.Mesh>

<T.Mesh
	rotation.y={rotation}
	position.y={0.5}
	position.x={2}
	scale={$scale}
	on:pointerenter={() => scale.set(1.5)}
	on:pointerleave={() => scale.set(1)}
	castShadow
>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="lightgreen" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.CircleGeometry args={[4, 40]} />
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
