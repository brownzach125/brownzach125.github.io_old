/// <reference path="./Object2.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SquarePolygon = (function (_super) {
    __extends(SquarePolygon, _super);
    function SquarePolygon(size, color, center) {
        _super.call(this);
        var geometry = new THREE.PlaneGeometry(size, size);
        var material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
        this.object3D = new THREE.Mesh(geometry, material);
        this.object3D.position.x = center.x;
        this.object3D.position.y = center.y;
        this.object3D.position.z = center.z;
    }
    SquarePolygon.prototype.getNormal = function () {
        this.object3D.updateMatrixWorld();
        var vector1 = this.object3D.geometry.vertices[0].clone();
        var vector2 = this.object3D.geometry.vertices[1].clone();
        var vector3 = this.object3D.geometry.vertices[2].clone();
        vector1.applyMatrix4(this.object3D.matrixWorld);
        vector2.applyMatrix4(this.object3D.matrixWorld);
        vector3.applyMatrix4(this.object3D.matrixWorld);
        var edgeOne = vector2.clone().sub(vector1);
        var edgeTwo = vector3.clone().sub(vector2);
        return edgeOne.cross(edgeTwo).normalize();
    };
    SquarePolygon.prototype.getAnchor = function () {
        this.object3D.updateMatrixWorld();
        var vector1 = this.object3D.geometry.vertices[0].clone();
        vector1.applyMatrix4(this.object3D.matrixWorld);
        return vector1;
    };
    SquarePolygon.prototype.inside = function (point, velocity) {
        var ray = new THREE.Ray(point, velocity.clone().normalize());
        var faces = this.object3D.geometry.faces;
        var vertices = this.object3D.geometry.vertices;
        for (var n = 0; n < faces.length; n++) {
            var face = faces[n];
            var vertex1 = vertices[face.a].clone().applyMatrix4(this.object3D.matrixWorld);
            var vertex2 = vertices[face.b].clone().applyMatrix4(this.object3D.matrixWorld);
            var vertex3 = vertices[face.c].clone().applyMatrix4(this.object3D.matrixWorld);
            var hit = ray.intersectTriangle(vertex1, vertex2, vertex3, false);
            if (hit) {
                return true;
            }
        }
        return false;
    };
    SquarePolygon.prototype.getPoint = function (index) {
        var vector = this.object3D.geometry.vertices[index].clone();
        vector.applyMatrix4(this.object3D.matrixWorld);
        return vector;
    };
    return SquarePolygon;
})(Object2);
//# sourceMappingURL=Polygon.js.map