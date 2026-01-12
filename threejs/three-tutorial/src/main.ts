// checklist
// - [x] Creating a scene
// - [x] WebGL compatibility check
// - [x] Drawing lines
// - [ ] Creating text
// - [ ] Loading 3D models
// - [ ] Libraries and Plugins
import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);
camera.position.z = 5;
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const blueLine = new THREE.LineBasicMaterial({ color: 0x0000ff });
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(lineGeometry, blueLine);
scene.add(line);

const loader = new GLTFLoader();

loader.load(
	"/just_a_girl.glb",
	function (gltf) {
		scene.add(gltf.scene);
	},
	undefined,
	function (error) {
		console.error(error);
	},
);

function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	renderer.render(scene, camera);
}
if (WebGL.isWebGL2Available()) {
	// Initiate function or other initializations here
	renderer.setAnimationLoop(animate);
} else {
	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById("container")?.appendChild(warning);
}
