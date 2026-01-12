import * as THREE from "three";
import GUI from "lil-gui";
import { AxisGridHelper } from "./axis-grid-helper";

const gui = new GUI();

const canvas = document.querySelector("#c") || document.createElement("canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

// camera
const fov = 40;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

// scene
const scene = new THREE.Scene();

{
	// light
	const color = 0xFFFFFF;
	const intensity = 500;
	const light = new THREE.PointLight(color, intensity);
	scene.add(light);
}

// our objects to render
const objects: THREE.Object3D[] = [];

// planet/body properties
const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(
	radius,
	widthSegments,
	heightSegments,
);

// solar system
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

// sun
const sunMaterial = new THREE.MeshPhongMaterial({
	emissive: 0xFFFF00,
});
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
solarSystem.add(sunMesh);
objects.push(sunMesh);

// earth
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const earthMaterial = new THREE.MeshPhongMaterial({
	color: 0x2233FF,
	emissive: 0x112244,
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

// moon
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

const moonMaterial = new THREE.MeshPhongMaterial({
	color: 0x888888,
	emissive: 0x222222,
});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

function makeAxisGrid(node: THREE.Object3D, label: string, units?: number) {
	const helper = new AxisGridHelper(node, units);
	gui.add(helper, "visible").name(label);
}

makeAxisGrid(solarSystem, "solarSystem", 25);
makeAxisGrid(sunMesh, "sunMesh");
makeAxisGrid(earthOrbit, "earthOrbit");
makeAxisGrid(earthMesh, "earthMesh");
makeAxisGrid(moonOrbit, "moonOrbit");
makeAxisGrid(moonMesh, "moonMesh");

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

function render(time: number) {
	time *= 0.001;

	if (resizeRendererToDisplaySize(renderer)) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}

	objects.forEach((obj, index) => {
		// obj.rotation.y = time;
	});

	renderer.render(scene, camera);

	requestAnimationFrame(render);
}

requestAnimationFrame(render);
