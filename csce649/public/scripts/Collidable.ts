/// <reference path="./Object2.ts" />

'use strict'


class Collidable extends Object2 {
    constructor() {
        super();
        var box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({color: 0x000000}));
        box.position.copy(new THREE.Vector3(0, 0, -10));
        this.object3D = box;
    }
}