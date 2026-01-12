import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PickHelper } from "./PickHelper";

const canvas: HTMLCanvasElement = document.querySelector("#c") ||
	document.createElement("canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setClearColor(0xAAAAAA);
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.castShadow = true;
directionalLight.position.set(3, 10, 5);
directionalLight.lookAt(scene.position);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
axesHelper.visible = true;

/*
// grid helpers
const size = 10;
const divisions = 10;
const xyGridHelper = new THREE.GridHelper(size, divisions);
xyGridHelper.rotation.x = Math.PI / 2;
scene.add(xyGridHelper);
const xzGridHelper = new THREE.GridHelper(size, divisions);
scene.add(xzGridHelper);
const yzGridHelper = new THREE.GridHelper(size, divisions);
yzGridHelper.rotation.z = Math.PI / 2;
scene.add(yzGridHelper);
*/

const fov = 75;
const aspect = 2; // the canvas default
const zNear = 0.1;
const zFar = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
camera.position.set(3, 3, 5);
camera.lookAt(0, 0, 0);

// orbit controls
// const _controls = new OrbitControls(camera, renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
const centerCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(centerCube);

/*
 * this plan failed
const uFace = new THREE.Object3D();
uFace.position.set(0, 1, 0);
const rFace = new THREE.Object3D();
rFace.position.set(1, 0, 0);
centerCube.add(uFace, rFace);

const edge1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
edge1.position.set(1, 0, 0);
edge1.addEventListener("mousedown", () => {
	console.log("mousedown");
	uFace.rotation.y = Math.PI / 2;
});
uFace.add(edge1);
*/

const centers = new THREE.Object3D();
scene.add(centers);

const uFace = new THREE.Object3D();
uFace.position.set(0, 1, 0);
const rFace = new THREE.Object3D();
rFace.rotation.z = Math.PI / 2;
rFace.position.set(1, 0, 0);

/*
// some nice grids
const rHelper = new THREE.GridHelper();
rFace.add(rHelper);
const uHelper = new THREE.GridHelper();
uFace.add(uHelper);
*/

centerCube.add(uFace, rFace);

function moveCube(
	cube: THREE.Object3D,
	oldParent: THREE.Object3D,
	newParent: THREE.Object3D,
) {
	const vector = new THREE.Vector3();
	// const quat = new THREE.Quaternion();
	const world = cube.getWorldPosition(vector);
	console.log("vector", vector.x, vector.y, vector.z);
	console.log("world", world.x, world.y, world.z);

	oldParent.remove(cube);
	newParent.add(cube);

	const target = new THREE.Vector3(0, 0, 0);
	const herp = rFace.getWorldPosition(target);
	console.log("herp", herp.x, herp.y, herp.z);
	const derp = cube.worldToLocal(vector);
	console.log("derp", derp.x, derp.y, derp.z);
	cube.position.copy(world);
	const local = cube.worldToLocal(vector);
	cube.position.copy(local);
	console.log("local", local.x, local.y, local.z);
	console.log("vector", vector.x, vector.y, vector.z);
	console.log("world", world.x, world.y, world.z);
	//cube.position.set(world.x, world.y, world.z);
	cube.updateMatrixWorld(true);
}

function addCube(
	parent: THREE.Object3D,
	x: number,
	y: number,
	z: number,
): THREE.Mesh {
	const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cube.position.set(x, y, z);
	cube.scale.set(0.7, 0.7, 0.7);
	parent.add(cube);
	return cube;
}

// addCube(centers, 1, 0, 0);
// addCube(centers, 0, 1, 0);
// addCube(centers, 0, 0, 1);
// addCube(centers, -1, 0, 0);
// addCube(centers, 0, -1, 0);
// addCube(centers, 0, 0, -1);

const corners = new THREE.Object3D();
scene.add(corners);
const c1 = addCube(uFace, 1, 0, 1);
// c1.parent = null;
// c1.parent = uFace;
// addCube(corners, 1, 1, -1);
// addCube(corners, 1, -1, 1);
// addCube(corners, 1, -1, -1);
// addCube(corners, -1, 1, 1);
// addCube(corners, -1, 1, -1);
// addCube(corners, -1, -1, 1);
// addCube(corners, -1, -1, -1);

const edges = new THREE.Object3D();
scene.add(edges);

// addCube(edges, 1, 1, 0);
// addCube(edges, 1, 0, 1);
// addCube(edges, 1, -1, 0);
// addCube(edges, 1, 0, -1);
// addCube(edges, -1, 1, 0);
// addCube(edges, -1, 0, 1);
// addCube(edges, -1, -1, 0);
// addCube(edges, -1, 0, -1);
// addCube(edges, 0, 1, 1);
// addCube(edges, 0, -1, 1);
// addCube(edges, 0, 1, -1);
// addCube(edges, 0, -1, -1);

const pickPosition = { x: 0, y: 0 };
clearPickPosition();

const pickHelper = new PickHelper();

function getCanvasRelativePosition(event: MouseEvent | Touch) {
	const rect = canvas.getBoundingClientRect();
	return {
		x: (event.clientX - rect.left) * canvas.width / rect.width,
		y: (event.clientY - rect.top) * canvas.height / rect.height,
	};
}

function setPickPosition(event: MouseEvent | Touch) {
	const pos = getCanvasRelativePosition(event);
	pickPosition.x = (pos.x / canvas.width) * 2 - 1;
	pickPosition.y = (pos.y / canvas.height) * -2 + 1; // note we flip Y
}

function clearPickPosition() {
	// unlike the mouse which always has a position
	// if the user stops touching the screen we want
	// to stop picking. For now we just pick a value
	// unlikely to pick something
	pickPosition.x = -100000;
	pickPosition.y = -100000;
}

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
	const canvas = renderer.domElement;
	const pixelRatio = window.devicePixelRatio;
	const width = Math.floor(canvas.clientWidth * pixelRatio);
	const height = Math.floor(canvas.clientHeight * pixelRatio);
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}
function render(time: number) {
	time *= 0.001; // convert time to seconds

	if (resizeRendererToDisplaySize(renderer)) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}

	// centers.rotation.x = time / 3;
	// edges.rotation.y = time / 1.5;
	// corners.rotation.z = time / 2;
	// uFace.rotation.y = time;
	// rFace.rotation.x = time;

	pickHelper.pick(
		new THREE.Vector2(pickPosition.x, pickPosition.y),
		scene,
		camera,
		time,
	);

	renderer.render(scene, camera);

	requestAnimationFrame(render);
}
requestAnimationFrame(render);

window.addEventListener("mousemove", setPickPosition);
window.addEventListener("mouseout", clearPickPosition);
window.addEventListener("mouseleave", clearPickPosition);
document.addEventListener("mousedown", () => {
	console.log("click");
	moveCube(c1, uFace, rFace);
});
