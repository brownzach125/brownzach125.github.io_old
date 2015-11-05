/// <reference path= './Application.ts' />
/// <reference path= './SpringyMeshSystem.ts' />
/// <reference path= './Polygon.ts' />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SpringMeshApplication = (function (_super) {
    __extends(SpringMeshApplication, _super);
    function SpringMeshApplication() {
        _super.call(this);
    }
    SpringMeshApplication.prototype.init = function (params) {
        _super.prototype.init.call(this, params);
        this.params = params;
        var light = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.scene.add(light);
        var axes = this.buildAxes(10);
        var system = new SpringyMeshSystem();
        system.init(params);
        this.addObject(system);
        var polygon = new SquarePolygon(5, 0xFF0000, new THREE.Vector3(2, -5, 0));
        polygon.rotateX(-45);
        polygon.rotateZ(5);
        var polygon2 = new SquarePolygon(10, 0xFF0000, new THREE.Vector3(0, -10, 5));
        polygon2.rotateX(45);
        var polygon3 = new SquarePolygon(5, 0xFF0000, new THREE.Vector3(-4, -9, 0));
        polygon3.rotateX(90);
        var polygon4 = new SquarePolygon(100, 0x00FF00, new THREE.Vector3(0, -15, 0));
        polygon4.rotateX(90);
        this.addObject(polygon);
        this.addObject(polygon2);
        this.addObject(polygon3);
        this.addObject(polygon4);
        this.scene.add(axes);
    };
    SpringMeshApplication.prototype.update = function (delta, timestep) {
        _super.prototype.update.call(this, delta, timestep);
        this.cameraControls.update(delta);
    };
    SpringMeshApplication.prototype.handleKeyDown = function (keyCode, charCode) {
        //if ( this.gooseSystem ){
        //    this.gooseSystem.handleKeyDown(keyCode , charCode);
        //}
    };
    SpringMeshApplication.prototype.handleKeyUp = function (keyCode, charCode) {
    };
    return SpringMeshApplication;
})(Application);
//# sourceMappingURL=SpringMeshApplication.js.map