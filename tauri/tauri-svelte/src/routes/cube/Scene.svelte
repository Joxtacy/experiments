<script>
	import { T } from "@threlte/core";
	import {
		Gizmo,
		Grid,
		OrbitControls,
		RoundedBoxGeometry,
		TransformControls,
	} from "@threlte/extras";
	import { DoubleSide, Mesh, MOUSE, Quaternion } from "three";

	let cubeBasicColor = "#464646";
</script>

<T.PerspectiveCamera
	makeDefault
	on:create={({ ref }) => {
		ref.position.set(90, 90, 90);
		ref.lookAt(0, 0, 0);
	}}
>
	<OrbitControls
		autoRotate={false}
		autoRotateSpeed={2}
		enableDamping={true}
		enablePan={false}
		enableZoom={false}
		mouseButtons={{ RIGHT: MOUSE.ROTATE }}
		enabled={false}
	/>
</T.PerspectiveCamera>

<Gizmo horizontalPlacement="left" paddingX={20} paddingY={20} />

<T.AmbientLight color={"#f0f0f0"} intensity={0.5} />
<T.DirectionalLight
	intensity={2}
	position={[5, 20, 10]}
	castShadow
	visible={true}
/>

<Grid
	gridSize={[10, 10]}
	cellColor={"#46536b"}
	sectionThickness={0}
	visible={false}
/>

<!-- table -->
<T.Mesh
	position={[0, -3, 0]}
	rotation.x={-Math.PI / 2}
	receiveShadow
	visible={false}
>
	<T.PlaneGeometry args={[100, 100]} />
	<T.MeshStandardMaterial color={"white"} />
</T.Mesh>

<!-- room -->
<T.Mesh position={[0, -3, 0]} rotation.x={-Math.PI / 2} receiveShadow>
	<T.BoxGeometry args={[100, 100, 100]} />
	<T.MeshStandardMaterial color={"white"} wireframe={false} side={DoubleSide} />
</T.Mesh>

<!-- middle -->
<T.Mesh position={[0, 0, 0]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[1, 0, 0]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[-1, 0, 0]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>

<T.Mesh position={[0, 1, 0]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[1, 1, 0]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[-1, 1, 0]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>

<T.Mesh position={[0, -1, 0]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[1, -1, 0]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[-1, -1, 0]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>

<T.Mesh position={[0, 0, 1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[1, 0, 1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[-1, 0, 1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>

<T.Mesh position={[0, 0, -1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[1, 0, -1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[-1, 0, -1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>

<T.Mesh position={[0, 1, 1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[1, 1, 1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[-1, 1, 1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>

<T.Mesh position={[0, 1, -1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[1, 1, -1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[-1, 1, -1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>

<T.Mesh position={[0, -1, 1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[1, -1, 1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[-1, -1, 1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>

<T.Mesh position={[0, -1, -1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[1, -1, -1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
<T.Mesh position={[-1, -1, -1]} castShadow>
	<RoundedBoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={cubeBasicColor} />
</T.Mesh>
