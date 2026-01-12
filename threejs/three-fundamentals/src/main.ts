import * as THREE from "three";

const canvas = document.querySelector("#c") || document.createElement("canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const cubes = [
	makeInstance(geometry, 0x44aa88, 0),
	makeInstance(geometry, 0x8844aa, -2),
	makeInstance(geometry, 0xaa8844, 2),
];

const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

function makeInstance(
	geometry: THREE.BufferGeometry,
	color: number,
	x: number,
) {
	const material = new THREE.MeshPhongMaterial({ color });

	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	cube.position.x = x;

	return cube;
}

/*
function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}
*/

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

	cubes.forEach((cube, index) => {
		const speed = 1 + index * 0.1;
		const rot = time * speed;
		cube.rotation.x = rot;
		cube.rotation.y = rot;
	});

	if (resizeRendererToDisplaySize(renderer)) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}

	renderer.render(scene, camera);

	requestAnimationFrame(render);
}
requestAnimationFrame(render);
