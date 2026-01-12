import * as THREE from "three";

export class PickHelper {
	raycaster: THREE.Raycaster;
	pickedObject: THREE.Object3D | null;
	pickedObjectSavedColor: number;

	constructor() {
		this.raycaster = new THREE.Raycaster();
		this.pickedObject = null;
		this.pickedObjectSavedColor = 0;
	}

	pick(
		normalizedPosition: THREE.Vector2,
		scene: THREE.Scene,
		camera: THREE.Camera,
		time: number,
	) {
		if (this.pickedObject) {
			this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
			this.pickedObject = null;
		}

		// cast a ray through the frustum
		this.raycaster.setFromCamera(normalizedPosition, camera);
		// get the list of objects the ray intersected
		const intersectedObjects = this.raycaster.intersectObjects(scene.children);
		if (intersectedObjects.length) {
			// pick the first object. It's the closest one
			this.pickedObject = intersectedObjects[0].object;
			// save its color
			this.pickedObjectSavedColor = this.pickedObject.material.emissive
				.getHex();
			// set its emissive color to flashing red/yellow
			this.pickedObject.material.emissive.setHex(
				(time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000,
			);
		}
	}
}
