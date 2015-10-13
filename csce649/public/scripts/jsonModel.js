/// <reference path="./Object2.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//Custom JSON model class
var JSONModel = (function (_super) {
    __extends(JSONModel, _super);
    function JSONModel() {
        _super.apply(this, arguments);
        this.handleLoaded = function (data, materials) {
            if (data instanceof THREE.Geometry) {
                var geometry = data;
                // Just in case model doesn't have normals
                geometry.computeVertexNormals();
                var material = new THREE.MeshFaceMaterial(materials);
                var mesh = new THREE.Mesh(geometry, material);
                mesh.scale.copy(this.scale);
                mesh.doubleSided = true;
                this.object3D.add(mesh);
                this.mesh = mesh;
                if (this.loadCallback) {
                    this.loadCallback(this);
                }
            }
        };
    }
    JSONModel.prototype.init = function (param) {
        var group = new THREE.Object3D;
        var that = this;
        var url = param.url || "";
        if (!url)
            return;
        this.loadCallback = param.callback;
        var scale = param.scale || 1;
        this.scale = new THREE.Vector3(scale, scale, scale);
        var loader = new THREE.JSONLoader();
        loader.load(url, function (data, material) {
            that.handleLoaded(data, material);
        });
        // Tell the framework about our object
        this.setObject3D(group);
    };
    return JSONModel;
})(Object2);
//# sourceMappingURL=jsonModel.js.map