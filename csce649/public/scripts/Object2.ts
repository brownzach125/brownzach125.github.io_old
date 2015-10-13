/// <reference path="../../typings/threejs/three.d.ts" />
'use strict'

class Object2 {
    object3D: THREE.Object3D;
    velocity: THREE.Vector3 = new THREE.Vector3(0,0,0);
    acceleration: THREE.Vector3 = new THREE.Vector3(0,0,0);
    children = [];
    constructor() {
    }
    update(delta? :number , timestep? : number) {
        this.updateChildren(delta , timestep);
    }
    init (param) {

    }
    // setPosition - move the object to a new position
    setPosition (x, y, z) {
        if (this.object3D) {
            this.object3D.position.set(x, y, z);
        }
    }

    //setScale - scale the object
    setScale (x, y, z) {
        if (this.object3D) {
            this.object3D.scale.set(x, y, z);
        }
    }

    //setScale - scale the object
    setVisible (visible) {
        function setVisible(obj, visible)
        {
            obj.visible = visible;
            var i, len = obj.children.length;
            for (i = 0; i < len; i++)
            {
                setVisible(obj.children[i], visible);
            }
        }
        if (this.object3D) {
            setVisible(this.object3D, visible);
        }
    }

    // updateChildren - update all child objects
    updateChildren (delta?: number , timestep?:number ) {
        var i, len;
        len = this.children.length;
        for (i = 0; i < len; i++) {
            this.children[i].update();
        }
    }

    setObject3D (object3D) {
        object3D.data = this;
        this.object3D = object3D;
    }

    //Add/remove children
    addChild (child) {
        this.children.push(child);
        // If this is a renderable object, add its object3D as a child of mine
        if (child.object3D) {
            this.object3D.add(child.object3D);
        }
    }

    removeChild (child) {
        var index = this.children.indexOf(child);
        if (index != -1) {
            this.children.splice(index, 1);
            // If this is a renderable object, remove its object3D as a child of mine
            if (child.object3D)
            {
                this.object3D.remove(child.object3D);
            }
        }
    }

    // Some utility methods
    getScene () {
        var scene = null;
        if (this.object3D) {
            var obj = this.object3D;
            while (obj.parent)
            {
                obj = obj.parent;
            }

            scene = obj;
        }

        return scene;
    }

    getApp () {
        var scene = this.getScene();
        return scene ? scene.data : null;
    }
}

