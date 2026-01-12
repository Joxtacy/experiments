import * as THREE from "three";

// Turns both axes and grid visible on/off
// lil-gui requires a property that returns a bool
// to decide to make a checkbox so we make a setter
// and getter for `visible` which we can tell lil-gui
// to look at.
export class AxisGridHelper {
	grid: THREE.GridHelper;
	axes: THREE.AxesHelper;
	_visible: boolean;

	constructor(node: THREE.Object3D, units = 10) {
		const axes = new THREE.AxesHelper();
		axes.material.depthTest = false;
		axes.renderOrder = 2; // render after the grid
		node.add(axes);

		const grid = new THREE.GridHelper(units, units);
		grid.material.depthTest = false;
		grid.renderOrder = 1; // render before the axes
		node.add(grid);

		this.grid = grid;
		this.axes = axes;
		this.visible = false;
		this._visible = false;
	}

	get visible() {
		return this._visible;
	}

	set visible(v: boolean) {
		this._visible = v;
		this.grid.visible = v;
		this.axes.visible = v;
	}
}
