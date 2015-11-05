/// <reference path="../../typings/threejs/three.d.ts" />
'use strict';
var Object2 = (function () {
    function Object2() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.children = [];
    }
    Object2.prototype.update = function (delta, timestep) {
        this.updateChildren(delta, timestep);
    };
    Object2.prototype.init = function (param) {
    };
    // setPosition - move the object to a new position
    Object2.prototype.setPosition = function (x, y, z) {
        if (this.object3D) {
            this.object3D.position.set(x, y, z);
        }
    };
    //setScale - scale the object
    Object2.prototype.setScale = function (x, y, z) {
        if (this.object3D) {
            this.object3D.scale.set(x, y, z);
        }
    };
    //setScale - scale the object
    Object2.prototype.setVisible = function (visible) {
        function setVisible(obj, visible) {
            obj.visible = visible;
            var i, len = obj.children.length;
            for (i = 0; i < len; i++) {
                setVisible(obj.children[i], visible);
            }
        }
        if (this.object3D) {
            setVisible(this.object3D, visible);
        }
    };
    // updateChildren - update all child objects
    Object2.prototype.updateChildren = function (delta, timestep) {
        var i, len;
        len = this.children.length;
        for (i = 0; i < len; i++) {
            this.children[i].update();
        }
    };
    Object2.prototype.setObject3D = function (object3D) {
        object3D.data = this;
        this.object3D = object3D;
    };
    //Add/remove children
    Object2.prototype.addChild = function (child) {
        this.children.push(child);
        // If this is a renderable object, add its object3D as a child of mine
        if (child.object3D) {
            this.object3D.add(child.object3D);
        }
    };
    Object2.prototype.removeChild = function (child) {
        var index = this.children.indexOf(child);
        if (index != -1) {
            this.children.splice(index, 1);
            // If this is a renderable object, remove its object3D as a child of mine
            if (child.object3D) {
                this.object3D.remove(child.object3D);
            }
        }
    };
    // Some utility methods
    Object2.prototype.getScene = function () {
        var scene = null;
        if (this.object3D) {
            var obj = this.object3D;
            while (obj.parent) {
                obj = obj.parent;
            }
            scene = obj;
        }
        return scene;
    };
    Object2.prototype.getApp = function () {
        var scene = this.getScene();
        return scene ? scene.data : null;
    };
    Object2.prototype.rotateX = function (degree) {
        degree = degree * Math.PI / 180;
        this.object3D.rotation.x += degree;
    };
    Object2.prototype.rotateY = function (degree) {
        degree = degree * Math.PI / 180;
        this.object3D.rotation.y += degree;
    };
    Object2.prototype.rotateZ = function (degree) {
        degree = degree * Math.PI / 180;
        this.object3D.rotation.z += degree;
    };
    return Object2;
})();
//# sourceMappingURL=Object2.js.map