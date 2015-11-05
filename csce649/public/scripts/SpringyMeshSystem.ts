/// <reference path="./System.ts" />
'use strict'

class SpringyMeshSystem extends System {
    state: State;
    damperConstant = 1;
    springConstant = 1;
    gravityX = 1;
    gravityY = 1;
    gravityZ = 1;
    constructor() {
        super();
    }
    createInitialState() {
        // Create vertices
        var vertices = [];
        var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshNormalMaterial();
        this.object3D = new THREE.Mesh( geometry , material);
        for ( var i =0; i < geometry.vertices.length; i++ ) {
            vertices.push ( new Vertex( geometry.vertices[i]));
        }

        // Create faces
        var faces = [];
        for ( var i =0; i < geometry.faces.length; i++) {
            faces.push( new Face( geometry.faces[i]));
        }

        // Create struts, for now I create all possible, with equal strenght
        var struts = [];
        for ( var i =0; i < vertices.length; i++ ) {
            for ( var j = i + 1; j < vertices.length; j++) {
                var distance = vertices[i].position.clone().sub(vertices[j].position).length();
                struts.push( new Strut(i , j , distance));
            }
        }
        this.state = new State(struts , faces , vertices);
    }

    updateViewObject() {
        for ( var i =0; i < this.state.vertices.length; i++) {
            this.object3D.geometry.vertices[i] = this.state.vertices[i].position;
        }
        this.object3D.geometry.verticesNeedUpdate = true;
    }

    getEdges() {
        var edges = [];
        for ( var i =0; i < this.state.faces.length; i++) {
            var face = this.state.faces[i];
            edges.push( { a: face.a , b: face.b });
            edges.push( { a: face.b , b: face.c });
            edges.push( { a: face.c , b: face.a });
        }
        var found = {};
        var result = [];
        for ( var i = 0; i < edges.length; i++) {
            var a = edges[i].a;
            var b = edges[i].b;
            if ( !((found[a] && found[a][b]) || (found[b] && found[b][a] ))) {
                result.push(edges[i]);
                if ( !found[a]) {
                    found[edges[i].a] = {};
                }
                found[a][b] = true;
            }
        }
        return result;
    }
    // Compute force on each vertex, store in vertex force field
    computeForces(state : State) {
        // Loop over particles, particle forces
        this.computeVertexForces(state);
        // Loop over struts, strut forces
        this.computeStrutForces(state);

        // Loop over all faces, face forcess

        //Loop over particles, divide accumilated force by mass
    }
    computeStrutForces(state: State) {
        for ( var i = 0; i < state.struts.length; i++) {
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
            var damperForce   = velocity.multiplyScalar( strut.damperConstant * this.damperConstant);
            state.vertices[strut.a].force.sub(damperForce);
            state.vertices[strut.b].force.add(damperForce);
        }
    }
    computeVertexForces(state :State) {
        // For now just gravity
        for ( var i = 0; i < state.vertices.length; i++) {
            state.vertices[i].force.add( new THREE.Vector3(this.gravityX, this.gravityY, this.gravityZ) );
        }
    }
}

