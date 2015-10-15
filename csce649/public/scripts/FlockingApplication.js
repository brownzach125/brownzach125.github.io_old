/// <reference path= './Application.ts' />
/// <reference path= './FlockSystem.ts' />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FlockingApplication = (function (_super) {
    __extends(FlockingApplication, _super);
    function FlockingApplication() {
        _super.call(this);
    }
    FlockingApplication.prototype.init = function (params) {
        _super.prototype.init.call(this, params);
        var light = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.scene.add(light);
        this.cameraControls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        var thing = new Collidable();
        this.gooseSystem = new FlockSystem();
        params.collidables = [thing];
        this.gooseSystem.init(params);
        this.addObject(this.gooseSystem);
        this.addObject(thing);
        var axes = this.buildAxes(10);
        this.scene.add(axes);
    };
    FlockingApplication.prototype.buildAxes = function (length) {
        var axes = new THREE.Object3D();
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z
        return axes;
    };
    FlockingApplication.prototype.buildAxis = function (src, dst, colorHex, dashed) {
        var geom = new THREE.Geometry(), mat;
        if (dashed) {
            mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        }
        else {
            mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }
        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
        var axis = new THREE.Line(geom, mat, THREE.LineSegments);
        return axis;
    };
    FlockingApplication.prototype.update = function (delta, timestep) {
        _super.prototype.update.call(this, delta, timestep);
        this.cameraControls.update(delta);
    };
    FlockingApplication.prototype.handleKeyDown = function (keyCode, charCode) {
        //if (this.player) {
        //    this.player.handleKeyDown(keyCode, charCode);
        //}
        if (this.gooseSystem) {
            this.gooseSystem.handleKeyDown(keyCode, charCode);
        }
    };
    FlockingApplication.prototype.handleKeyUp = function (keyCode, charCode) {
        //if (this.player) {
        //    this.player.handleKeyUp(keyCode, charCode);
        //}
        if (this.gooseSystem) {
            this.gooseSystem.handleKeyUp(keyCode, charCode);
        }
    };
    return FlockingApplication;
})(Application);
//# sourceMappingURL=FlockingApplication.js.map