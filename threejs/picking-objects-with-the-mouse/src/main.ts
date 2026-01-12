import * as THREE from "three";
import { PickHelper } from "./PickHelper";

const canvas: HTMLCanvasElement = document.querySelector("#c") ||
	document.createElement("canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const fov = 60;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 200;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 30;

const scene = new THREE.Scene();
scene.background = new THREE.Color("white");

// put the camera on a pole (parent it to an object)
// so we can spin the pole to move the camera around the scene
const cameraPole = new THREE.Object3D();
scene.add(cameraPole);
cameraPole.add(camera);

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function rand(min: number, max?: number) {
	if (max === undefined) {
		max = min;
		min = 0;
	}
	return Math.random() * (max - min) + min;
}

function randomColor() {
	return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
}

const numObjects = 100;
for (let i = 0; i < numObjects; i++) {
	const material = new THREE.MeshPhongMaterial({ color: randomColor() });

	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
	cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
	cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
}

const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
camera.add(light);

const pickPosition = { x: 0, y: 0 };
clearPickPosition();

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

window.addEventListener("mousemove", setPickPosition);
window.addEventListener("mouseout", clearPickPosition);
window.addEventListener("mouseleave", clearPickPosition);
window.addEventListener("touchstart", (event: TouchEvent) => {
	// prevent the window from scrolling
	event.preventDefault();
	setPickPosition(event.touches[0]);
}, { passive: false });
window.addEventListener("touchmove", (event) => {
	setPickPosition(event.touches[0]);
});
window.addEventListener("touchend", clearPickPosition);

const pickHelper = new PickHelper();

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

	cameraPole.rotation.y = time * 0.1;

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
