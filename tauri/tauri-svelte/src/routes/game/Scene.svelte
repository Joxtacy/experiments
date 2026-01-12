<script lang="ts">
	import { T, useTask, useThrelte } from "@threlte/core";
	import { Grid, OrbitControls } from "@threlte/extras";
	import Spaceship from "../../components/spaceship.svelte";
	import {
		Color,
		Group,
		Mesh,
		PMREMGenerator,
		Raycaster,
		Vector2,
		Vector3,
		WebGLRenderTarget,
		type Object3DEventMap,
	} from "three";
	import { onMount } from "svelte";
	import { spring } from "svelte/motion";
	import Stars from "./Stars.svelte";
	import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
	import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
	import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
	import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

	let planeRef: Mesh;
	let sphereRef: Mesh;
	let spaceshipRef: Spaceship;

	const { camera, scene, renderer, renderStage } = useThrelte();
	let intersectionPoint: Vector3;
	let translY = 0;
	let translAcc = 0;
	let angleZ = 0;
	let angleAcc = 0;

	const pmrem = new PMREMGenerator(renderer);
	let envMapRT: WebGLRenderTarget;

	const composer = new EffectComposer(renderer);
	composer.setSize(innerWidth, innerHeight); // this needs to be called again when window resizes

	const setupEffectComposer = () => {
		// renders the scene
		const renderPass = new RenderPass(scene, camera.current);
		composer.addPass(renderPass);

		// uses result of previous pass to apply bloom
		const bloomPass = new UnrealBloomPass(
			new Vector2(innerWidth, innerHeight),
			0.275,
			1,
			0
		);
		composer.addPass(bloomPass);

		// show the result on screen
		const outputPass = new OutputPass();
		composer.addPass(outputPass);
	};

	let y = spring(0);
	y.damping = 0.05;
	y.stiffness = 0.003;
	y.precision = 0.001;

	let angle = spring(0);
	angle.damping = 0.05;
	angle.stiffness = 0.003;
	angle.precision = 0.001;

	useTask(
		() => {
			if (intersectionPoint) {
				const targetY = intersectionPoint.y;
				translAcc += (targetY - translY) * 0.002; // stiffness
				translAcc *= 0.95; // damping
				translY += translAcc;

				const dir = intersectionPoint
					.clone()
					.sub(new Vector3(0, translY, 0))
					.normalize();
				const dirCos = dir.dot(new Vector3(0, 1, 0));
				const angle = Math.acos(dirCos) - Math.PI / 2;
				angleAcc += (angle - angleZ) * 0.01; // stiffness
				angleAcc *= 0.85; // damping
				angleZ += angleAcc;
			}

			if (envMapRT) envMapRT.dispose();
			spaceshipRef.visible = false;
			scene.background = null;
			envMapRT = pmrem.fromScene(scene, 0, 0.1, 1000);
			scene.background = new Color("#598889").multiplyScalar(0.05);
			spaceshipRef.visible = true;

			spaceshipRef.traverse((child) => {
				if (child?.material?.envMapIntensity) {
					child.material.envMap = envMapRT.texture;
					child.material.envMapIntensity = 100;
					child.material.normalScale.set(0.3, 0.3);
				}
			});

			composer.render();
		},
		{ stage: renderStage, autoInvalidate: false }
	);

	onMount(() => {
		setupEffectComposer();

		const raycaster = new Raycaster();
		const pointer = new Vector2();

		function onPointerMove(event: PointerEvent) {
			const rect = event?.target.getBoundingClientRect();
			pointer.x =
				((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1;
			pointer.y =
				-((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 +
				1;
			//pointer.x = (event.clientX / width) * 2 - 1;
			//pointer.y = -(event.clientY / height) * 2 + 1;

			raycaster.setFromCamera(pointer, $camera);
			const intersects = raycaster.intersectObject(planeRef);
			intersectionPoint = intersects[0]?.point;

			if (intersectionPoint) {
				// this prevents the spring motion to be different while the pointer
				// spans the x axis
				intersectionPoint.x = -3;
				sphereRef.position.copy(intersectionPoint);
				y.set(intersectionPoint.y);
			}
		}

		window.addEventListener("pointermove", onPointerMove);
		return () => window.removeEventListener("pointermove", onPointerMove);
	});
</script>

<T.PerspectiveCamera makeDefault position={[-5, 6, 10]} fov={25}>
	<OrbitControls enableDamping target={[0, 0, 0]} />
</T.PerspectiveCamera>

<T.DirectionalLight
	intensity={1.8}
	position={[0, 10, 0]}
	castShadow
	shadow.bias={-0.0001}
/>
<T.AmbientLight intensity={0.2} />

<Grid
	position.y={-0.001}
	cellColor="#ffffff"
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={25}
	cellSize={2}
	visible={false}
/>

<Stars />

<Spaceship
	bind:ref={spaceshipRef}
	position={[0, translY, 0]}
	rotation={[angleZ, 0, angleZ, "ZXY"]}
/>

<T.Mesh renderOrder={2} bind:ref={planeRef} visible={false}>
	<T.PlaneGeometry args={[20, 20]} />
	<T.MeshBasicMaterial color={[1, 0, 1]} transparent opacity={0.25} />
</T.Mesh>

<T.Mesh position={[1, 2, 0]} bind:ref={sphereRef} visible={true}>
	<T.SphereGeometry args={[0.1, 20, 20]} />
	<T.MeshBasicMaterial color={[1, 0, 0]} />
</T.Mesh>
