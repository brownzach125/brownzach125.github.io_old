/// <reference path="../../typings/threejs/three.d.ts" />
'use strict'

// Some definitions to support Sylvester
var Plane;
var Line;
var Vector;

class Object2 {
    object: THREE.Object3D;
    constructor() {

    }
    simulate(delta : number , timestep: number) {

    }
}

class Polygon extends Object2 {
    plane;
    xRotation = 0;
    yRotation = 0;
    constructor(center: THREE.Vector3 , rotationX? : number , rotationY?: number) {
        super();
        if ( rotationX) {
            this.xRotation = rotationX;
        }
        if ( rotationY) {
            this.yRotation = rotationY;
        }
        this.plane = Plane.XY;
        this.plane = this.plane.rotate(this.xRotation * Math.PI / 180 , Line.X);
        this.plane = this.plane.rotate(this.yRotation * Math.PI / 180 , Line.Y);
        this.plane = this.plane.translate( Vector.create( [center.x ,center.y , center.z]));
    }
    rotateX( degree: number) {
        this.object.rotation.x += degree * Math.PI / 180;
        this.plane = this.plane.rotate(degree * Math.PI / 180, Line.X);
        this.xRotation += degree;
    }
    rotateY( degree: number) {
        this.object.rotation.y += (degree * Math.PI / 180);
        this.plane = this.plane.rotate(degree * Math.PI / 180 , Line.Y);

    }
}

class TrianglePolygon extends Object2 {
    object: THREE.Object3D;
    plane;
    constructor() {
       super();
       var triangleGeometry = new THREE.Geometry();
       triangleGeometry.vertices.push(new THREE.Vector3( -1.0,  0.0, 0.0));
       triangleGeometry.vertices.push(new THREE.Vector3(  0.0,  0.0, 1.0));
       triangleGeometry.vertices.push(new THREE.Vector3( 1.0, 0.0, 1.0));
       triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
        var material = new THREE.MeshBasicMaterial({
            color:0xFFFFFF,
            side:THREE.DoubleSide
        });
        this.object = new THREE.Mesh( triangleGeometry , material);
    }
}

class SquarePolygon extends Polygon {
    faces = [];
    constructor( size: number , color , center: THREE.Vector3 , rotationX? : number , rotationY?: number ) {
        super(center , rotationX , rotationY);

        var geometry = new THREE.PlaneGeometry(size ,size);
        var material = new THREE.MeshBasicMaterial({
            color: color,
            side:THREE.DoubleSide
        });
        this.object = new THREE.Mesh( geometry , material);
        this.object.position.x = center.x;
        this.object.position.y = center.y;
        this.object.position.z = center.z;
        this.object.rotation.x += this.xRotation * Math.PI / 180;
        this.object.rotation.y += this.yRotation * Math.PI / 180;
        var tempFaces = this.object.geometry.faces;
        var vertices = this.object.geometry.vertices;
        for ( var i =0; i < tempFaces.length; i++) {
            var a = tempFaces[i].a;
            var b = tempFaces[i].b;
            var c = tempFaces[i].c;
            var axisX = new THREE.Vector3( 1 , 0 , 0);
            var axisY = new THREE.Vector3( 0 , 1 , 0);
            var radiansX = this.xRotation * Math.PI / 180;
            var radiansY = this.yRotation * Math.PI / 180;
            a = vertices[a].clone().applyAxisAngle( axisX , radiansX).applyAxisAngle( axisY , radiansY).add(center);
            b = vertices[b].clone().applyAxisAngle( axisX , radiansX).applyAxisAngle( axisY , radiansY).add(center);
            c = vertices[c].clone().applyAxisAngle( axisX , radiansX).applyAxisAngle( axisY , radiansY).add(center);
            this.faces.push( new Array(a,b,c));
        }


    }
}


class ParticleSystem extends Object2 {
    document;
    geometry;
    particleCount: number;
    particlesPerSecond: number = 1000;
    nextParticle: number = 0;
    velocities : THREE.Vector3[] = [];
    gradientCubes;
    cubeLength: number = .5;
    arrayLength: number = 60 / this.cubeLength;
    hitList;
    constructor(document , hitList) {
        super();
        this.document = document;  // hack
        this.particleCount = 50000;
        this.hitList = hitList;
        var vertices = new Float32Array( this.particleCount * 3);
        var alphas   = new Float32Array( this.particleCount );
        var colors   = new Float32Array( this.particleCount * 3);
        for ( var i =0; i < this.particleCount; i++) {
            vertices[i*3 + 0] = 0;
            vertices[i*3 + 1] = 0;
            vertices[i*3 + 2] = 0;
            colors[i*3 + 0] = .13;
            colors[i*3 + 1] = .35;
            colors[i*3 + 2] = .63;
            alphas[i] = 0;
            this.velocities.push( new THREE.Vector3(0,0,0) );
        }
        var uniforms = {};
        var geometry = this.createBufferGeometry(vertices , colors , alphas);
        var material = this.createShaderMaterial(uniforms);
        var particleSystem = new THREE.Points( geometry, material);
        this.object = particleSystem;
        this.geometry = geometry;

        this.gradientCubes = [];
        for ( var i = 0; i < this.arrayLength; i++ ) {
            var jArrays = [];
            for ( var j = 0; j < this.arrayLength; j++) {
                var kArrays = [];
                for ( var k = 0; k< this.arrayLength; k++) {
                    kArrays.push(0);
                    //this.gradientCubes[i][j][k] = 0;
                }
                jArrays.push(kArrays);
            }
            this.gradientCubes.push(jArrays);
        }
    }
    createShaderMaterial(uniforms) {
        var pMaterial = new THREE.ShaderMaterial({
            //uniforms : uniforms,
            vertexShader:   this.document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: this.document.getElementById( 'fragmentshader' ).textContent,
            transparent: true,
        });
        return pMaterial;
    }
    createBufferGeometry(vertices , colors , alphas) {
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute(vertices , 3));
        geometry.addAttribute( 'alpha' , new THREE.BufferAttribute(alphas,1));
        geometry.addAttribute( 'color' , new THREE.BufferAttribute(colors,3));
        return geometry;
    }
    createGeometry() {
        var geometry = new THREE.Geometry();
        return geometry;
    }
    simulate(delta : number , h: number) {
        if ( delta > .2 ) {
            console.log("Delta is waaaaay toooo biiggggg: " + delta);
            return;
        }
        var geometry = this.geometry;
        var alphas   = geometry.getAttribute('alpha');
        var positions = geometry.getAttribute('position');
        // -----------------------
        // Generate new particles
        // ----------------------
        for ( var i = 0; i < delta * this.particlesPerSecond; i++ ) {
            var nextParticle = this.nextParticle;
            alphas.array[this.nextParticle] = 1;
            positions.array[nextParticle*3 + 0] = Math.random() * 4 - 2;
            positions.array[nextParticle*3 + 1] = Math.random() * 4 + 15;
            positions.array[nextParticle*3 + 2] = Math.random() * 4 - 2;
            this.velocities[nextParticle] = new THREE.Vector3(0,-5,0);
            this.nextParticle = (this.nextParticle +1) % this.particleCount;
        }
        //-------------------------
        // Calculate new position and velocity
        //------------------------
        for ( var i =0; i<delta; i+=h) {
            var arrayLength = this.arrayLength;
            var newGradientCubes = [];
            for ( var i = 0; i < arrayLength; i++ ) {
                var jArrays = [];
                for ( var j = 0; j < arrayLength; j++) {
                    var kArrays = [];
                    for ( var k = 0; k< arrayLength; k++) {
                        kArrays.push(0);
                    }
                    jArrays.push(kArrays);
                }
                newGradientCubes.push(jArrays);
            }
            for ( var particleIndex = 0; particleIndex < this.particleCount; particleIndex++) {

                    var oldPosition = new THREE.Vector3(0,0,0);
                    oldPosition.setX( positions.array[particleIndex * 3 + 0] );
                    oldPosition.setY( positions.array[particleIndex * 3 + 1] );
                    oldPosition.setZ( positions.array[particleIndex * 3 + 2] );
                    var velocity    = this.velocities[particleIndex];
                    var acceleration = new THREE.Vector3(0,0,0);
                    //---------------------
                    // calculate accleration;
                    //---------------------
                    var xIndex = Math.floor(oldPosition.x /this.cubeLength) + arrayLength/2;
                    var yIndex = Math.floor(oldPosition.y /this.cubeLength) + arrayLength/2;
                    var zIndex = Math.floor(oldPosition.z /this.cubeLength) + arrayLength/2;
                    var gradientX = 0,
                        gradientY = 0,
                        gradientZ = 0;
                        // Calculate x gradien
                        if ( xIndex  > 0 && xIndex +1 < arrayLength && yIndex + 1 < arrayLength && yIndex > 0 && zIndex > 0 && zIndex +1 < arrayLength) {
                            gradientX = (this.gradientCubes[xIndex - 1][yIndex][zIndex] - this.gradientCubes[xIndex + 1][yIndex][zIndex]);
                            // Calculate y gradient
                            gradientY = this.gradientCubes[xIndex][yIndex - 1][zIndex] - this.gradientCubes[xIndex][yIndex + 1][zIndex];
                            gradientY = Math.min( gradientY , 0);
                            // Calculate z gradient
                            gradientZ = (this.gradientCubes[xIndex][yIndex][zIndex - 1] - this.gradientCubes[xIndex][yIndex][zIndex + 1]);
                        }
                    var xFriction = velocity.x * .9;
                    var zFriction = velocity.z * .9;
                    acceleration = new THREE.Vector3( gradientX - xFriction , 20 * gradientY + -10 , gradientZ - zFriction);

                    //--------------------------------
                    // Integrate
                    //-------------------------------
                    velocity.add( acceleration.multiplyScalar(h) );
                    var newPosition = new THREE.Vector3(0,0,0);
                    newPosition.addVectors( oldPosition , velocity.clone().multiplyScalar(h));
                    // ----------------------
                    // Collision Detection
                    // ----------------------
                    var plane;
                    for ( var l = 0; l < this.hitList.length; l++) {
                        plane = this.hitList[l].plane;
                        var planeNormal = new THREE.Vector3( plane.normal.elements[0] , plane.normal.elements[1] , plane.normal.elements[2]);
                        var planeAnchor = new THREE.Vector3( plane.anchor.elements[0] , plane.anchor.elements[1] , plane.anchor.elements[2]);
                        var oldDistance  = ( new THREE.Vector3().subVectors( oldPosition , planeAnchor ) ).dot( planeNormal );
                        var newDistance  = ( new THREE.Vector3().subVectors( newPosition , planeAnchor ) ).dot( planeNormal );
                        // Collision with plane
                        if ( oldDistance * newDistance  < 0 ) {
                            //--------------------------------
                            // Collision with polygon
                            //--------------------------------
                            //console.log("collision possible");
                            var ray = new THREE.Ray(oldPosition , velocity.clone().normalize());
                            var triangles = this.hitList[l].faces;
                            for ( var n = 0; n < triangles.length; n++ ) {
                                var triangle = triangles[n];
                                var hit = ray.intersectTriangle( triangle[0] , triangle[1] , triangle[2] , false);
                                if ( hit ) {
                                    //--------------------------------
                                    // Collision Response
                                    //--------------------------------

                                    var elasticity = .01;
                                    var velocityNormal = planeNormal.clone().multiplyScalar(velocity.dot(planeNormal));
                                    var velocityTangent = velocity.clone().sub(velocityNormal);
                                    velocity = velocityNormal.clone().multiplyScalar(-1 * elasticity).add(velocityTangent);
                                    newPosition.subVectors( newPosition , planeNormal.clone().multiplyScalar( 2 * newDistance ));
                                    break;
                                }
                            }
                        }
                    }
                    var epsilon = 1;
                    //if ( oldPosition.sub(newPosition).length() > epsilon && velocity.length() > epsilon ) {
                        positions.array[particleIndex * 3 + 0] = newPosition.x;
                        positions.array[particleIndex * 3 + 1] = newPosition.y;
                        positions.array[particleIndex * 3 + 2] = newPosition.z;
                        this.velocities[particleIndex] = velocity;
                        if ( this.velocities[particleIndex].y > 0) {
                            this.velocities[particleIndex].setY(0);
                        }

                   // }

                    xIndex = Math.floor(newPosition.x/this.cubeLength)+ arrayLength/2;
                    yIndex = Math.floor(newPosition.y/this.cubeLength)+ arrayLength/2;
                    zIndex = Math.floor(newPosition.z/this.cubeLength)+ arrayLength/2;
                    if ( zIndex  >= 0 && zIndex < arrayLength && yIndex < arrayLength && yIndex >=0 && xIndex < arrayLength && xIndex >=0) {
                        newGradientCubes[xIndex][yIndex][zIndex]++;
                        alphas.array[particleIndex] = newGradientCubes[xIndex][yIndex][zIndex] / 1.0;
                    }
            }
            this.gradientCubes = newGradientCubes;
        }
       //---------------------
       // Update all particles
       // --------------------
       this.geometry.attributes.alpha.needsUpdate = true;
       this.geometry.attributes.position.needsUpdate = true;
    }
}

