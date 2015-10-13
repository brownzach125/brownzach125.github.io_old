/// <reference path="./Object2.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Goose = (function (_super) {
    __extends(Goose, _super);
    function Goose() {
        _super.call(this);
        this.upVector = new THREE.Vector3(0, 1, 0);
        this.headingVector = new THREE.Vector3(0, 0, 1);
    }
    Goose.prototype.init = function (param) {
        param = param || {};
        var mesh = param.mesh;
        if (!mesh)
            return;
        var group = new THREE.Object3D;
        this.setObject3D(group);
        var thing = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), this.makeMaterial());
        this.object3D.add(mesh);
        this.mesh = mesh;
        //this.object3D.position.copy(new THREE.Vector3(0,-10,0));
    };
    Goose.prototype.bank = function (acceleration) {
        var upPart = this.upVector.clone().dot(acceleration);
        var sidePart = this.velocity.clone().cross(this.upVector).normalize().dot(acceleration);
    };
    Goose.prototype.makeMaterial = function () {
        return new THREE.MeshBasicMaterial();
    };
    return Goose;
})(Object2);
var SmartGoose = (function (_super) {
    __extends(SmartGoose, _super);
    function SmartGoose() {
        _super.call(this);
        this.speed = -1;
    }
    SmartGoose.prototype.makeMaterial = function () {
        return new THREE.MeshBasicMaterial({ color: 0xFF0000, opacity: 1 });
    };
    SmartGoose.prototype.init = function (param) {
        _super.prototype.init.call(this, param);
    };
    SmartGoose.prototype.update = function (delta, timestep) {
        console.log("Sup");
    };
    SmartGoose.prototype.pullUp = function (Up) {
        var degree = 5;
        if (!Up) {
            degree *= -1;
        }
        //var axis = new THREE.Vector3(1,0,0);
        var axis = new THREE.Vector3(0, 0, 0).crossVectors(this.headingVector, this.upVector).normalize();
        this.upVector.applyAxisAngle(axis, degree * Math.PI / 180);
        this.headingVector.applyAxisAngle(axis, degree * Math.PI / 180);
        this.object3D.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1 * degree * Math.PI / 180);
        var app = this.getApp().gooseSystem;
        this.velocity = this.headingVector.clone().normalize().multiplyScalar(this.speed);
        app.state[app.particleCount] = this.velocity;
    };
    SmartGoose.prototype.bankRight = function (right) {
        var degree = 5;
        if (!right) {
            degree *= -1;
        }
        var normalAxis = this.headingVector.clone().normalize();
        this.upVector.applyAxisAngle(normalAxis, degree * Math.PI / 180);
        this.object3D.rotateOnAxis(new THREE.Vector3(0, 0, 1), degree * Math.PI / 180);
    };
    return SmartGoose;
})(Goose);
//# sourceMappingURL=Goose.js.map