/// <reference path="./System.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SpringyMeshSystem = (function (_super) {
    __extends(SpringyMeshSystem, _super);
    function SpringyMeshSystem() {
        _super.call(this);
        this.damperConstant = 1;
        this.springConstant = 1;
        this.gravityX = 1;
        this.gravityY = 1;
        this.gravityZ = 1;
    }
    SpringyMeshSystem.prototype.createInitialState = function () {
        // Create vertices
        var vertices = [];
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshNormalMaterial();
        this.object3D = new THREE.Mesh(geometry, material);
        for (var i = 0; i < geometry.vertices.length; i++) {
            vertices.push(new Vertex(geometry.vertices[i]));
        }
        // Create faces
        var faces = [];
        for (var i = 0; i < geometry.faces.length; i++) {
            faces.push(new Face(geometry.faces[i]));
        }
        // Create struts, for now I create all possible, with equal strenght
        var struts = [];
        for (var i = 0; i < vertices.length; i++) {
            for (var j = i + 1; j < vertices.length; j++) {
                var distance = vertices[i].position.clone().sub(vertices[j].position).length();
                struts.push(new Strut(i, j, distance));
            }
        }
        this.state = new State(struts, faces, vertices);
    };
    SpringyMeshSystem.prototype.updateViewObject = function () {
        for (var i = 0; i < this.state.vertices.length; i++) {
            this.object3D.geometry.vertices[i] = this.state.vertices[i].position;
        }
        this.object3D.geometry.verticesNeedUpdate = true;
    };
    SpringyMeshSystem.prototype.getEdges = function () {
        var edges = [];
        for (var i = 0; i < this.state.faces.length; i++) {
            var face = this.state.faces[i];
            edges.push({ a: face.a, b: face.b });
            edges.push({ a: face.b, b: face.c });
            edges.push({ a: face.c, b: face.a });
        }
        var found = {};
        var result = [];
        for (var i = 0; i < edges.length; i++) {
            var a = edges[i].a;
            var b = edges[i].b;
            if (!((found[a] && found[a][b]) || (found[b] && found[b][a]))) {
                result.push(edges[i]);
                if (!found[a]) {
                    found[edges[i].a] = {};
                }
                found[a][b] = true;
            }
        }
        return result;
    };
    // Compute force on each vertex, store in vertex force field
    SpringyMeshSystem.prototype.computeForces = function (state) {
        // Loop over particles, particle forces
        this.computeVertexForces(state);
        // Loop over struts, strut forces
        this.computeStrutForces(state);
        // Loop over all faces, face forcess
        //Loop over particles, divide accumilated force by mass
    };
    SpringyMeshSystem.prototype.computeStrutForces = function (state) {
        for (var i = 0; i < state.struts.length; i++) {
            var strut = state.struts[i];
            // Force = spring constant * deltaX * direction
            var vertexI = state.vertices[strut.a];
            var vertexJ = state.vertices[strut.b];
            var xIJ = vertexJ.position.clone().sub(vertexI.position);
            var deltaX = xIJ.length() - strut.restLength;
            xIJ.normalize();
            var springforce = xIJ.clone().multiplyScalar(strut.springConstant * this.springConstant * deltaX);
            state.vertices[strut.a].force.add(springforce);
            state.vertices[strut.b].force.sub(springforce);
            var velocityIJ = xIJ.clone().multiplyScalar(vertexI.velocity.dot(xIJ));
            var velocityJI = xIJ.clone().multiplyScalar(vertexJ.velocity.dot(xIJ));
            var velocity = velocityIJ.sub(velocityJI);
            //var damperForce =  xIJ.multiplyScalar(strut.damperConstant * this.damperConstant *velocity.length());
            var damperForce = velocity.multiplyScalar(strut.damperConstant * this.damperConstant);
            state.vertices[strut.a].force.sub(damperForce);
            state.vertices[strut.b].force.add(damperForce);
        }
    };
    SpringyMeshSystem.prototype.computeVertexForces = function (state) {
        // For now just gravity
        for (var i = 0; i < state.vertices.length; i++) {
            state.vertices[i].force.add(new THREE.Vector3(this.gravityX, this.gravityY, this.gravityZ));
        }
    };
    return SpringyMeshSystem;
})(System);
//# sourceMappingURL=SpringyMeshSystem.js.map