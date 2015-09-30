/// <reference path="../../typings/threejs/three.d.ts" />
'use strict'

// Some definitions to support Sylvester
var Plane;

class Object2 {
    object: THREE.Object3D;
    constructor() {

    }
    simulate(delta : number , timestep: number) {

    }
}

class TrianglePolygon extends Object2 {
    object: THREE.Object3D;
    plane;
    constructor() {
        super();
        //this.plane = Plane.create( Vector.create() , )
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

class SquarePolygon extends Object2 {
    constructor() {
        super();
        //this.plane = Plane.create( Vector.create() , )
        var geometry = new THREE.PlaneGeometry(500 ,500);
        var material = new THREE.MeshBasicMaterial({
            color:0xFFFFFF,
            side:THREE.DoubleSide
        });
        this.object = new THREE.Mesh( geometry , material);
        this.object.rotation.x += 90 * 3.14 / 180;
    }
    rotateX( degree: number) {
        //this.object.rotateX(degree);
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
    constructor(document) {
        super();
        this.document = document;  // hack
        this.particleCount = 20000;
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

        var arrayLength = 250 / 5;
        this.gradientCubes = [];
        for ( var i = 0; i < arrayLength; i++ ) {
            var jArrays = [];
            for ( var j = 0; j < arrayLength; j++) {
                var kArrays = [];
                for ( var k = 0; k< arrayLength; k++) {
                    kArrays.push(0);
                    //this.gradientCubes[i][j][k] = 0;
                }
                jArrays.push(kArrays);
            }
            this.gradientCubes.push(jArrays);
        }
        this.gradientCubes[5][6][5] =10;
        console.log(arrayLength);
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
            positions.array[nextParticle*3 + 0] = Math.random() * 50 - 25;
            positions.array[nextParticle*3 + 1] = Math.random() * 50 + 250;
            positions.array[nextParticle*3 + 2] = Math.random() * 50 -25;
            this.velocities[nextParticle] = new THREE.Vector3(0,0,0);
            this.nextParticle = (this.nextParticle +1) % this.particleCount;
        }
        //-------------------------
        // Calculate new position and velocity
        //------------------------
        for ( var i =0; i<delta; i+=h) {
            var arrayLength = 250 / 5;
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

                    var acceleration = new THREE.Vector3(0,0,0);
                    //---------------------
                    // calculate accleration;
                    //---------------------
                    var xIndex = Math.floor(oldPosition.x / 5) + arrayLength/5/2;
                    var yIndex = Math.floor(oldPosition.y / 5) + arrayLength/5/2;
                    var zIndex = Math.floor(oldPosition.z / 5) + arrayLength/5/2;
                    var gradientX = 0,
                        gradientY = 0,
                        gradientZ = 0;
                        // Calculate x gradient
                        console.log("HI");
                        console.log(this.gradientCubes);
                        if ( xIndex - 1 >= 0 && xIndex < arrayLength)
                            gradientX = this.gradientCubes[ xIndex - 1 ][yIndex][zIndex] - this.gradientCubes[ xIndex + 1 ][yIndex][zIndex];
                        // Calculate y gradient
                        if ( yIndex - 1 > 0 && yIndex < arrayLength)
                            gradientY = this.gradientCubes[ xIndex ][yIndex -1][zIndex] - this.gradientCubes[ xIndex ][yIndex +1 ][zIndex];
                        // Calculate z gradient
                        if ( zIndex - 1 > 0 && zIndex < arrayLength)
                            gradientZ = this.gradientCubes[ xIndex ][yIndex][zIndex-1] - this.gradientCubes[ xIndex ][yIndex][zIndex+1];
                    acceleration = new THREE.Vector3( gradientX , gradientY + -10 , gradientZ);

                    //--------------------------------
                    // Integrate
                    //-------------------------------
                    var velocity    = this.velocities[particleIndex];
                    velocity.add( acceleration.multiplyScalar(h) );
                    var newPosition = new THREE.Vector3(0,0,0);
                    newPosition.addVectors( oldPosition , velocity.clone().multiplyScalar(h));
                    // ----------------------
                    // Collision Detection
                    // ----------------------

                    var planeNormal = new THREE.Vector3( 0 , 1, 0);
                    var planeAnchor = new THREE.Vector3( 0,0,0);
                    var oldDistance  = ( new THREE.Vector3().subVectors( oldPosition , planeAnchor ) ).dot( planeNormal );
                    var newDistance  = ( new THREE.Vector3().subVectors( newPosition , planeAnchor ) ).dot( planeNormal );
                    if ( oldDistance * newDistance  < 0 ) {
                        //--------------------------------
                        // Collision Response
                        //--------------------------------
                        var elasticity = 1;
                        var velocityNormal = planeNormal.clone().multiplyScalar(velocity.dot(planeNormal));
                        var velocityTangent = velocity.clone().sub(velocityNormal);
                        velocity = velocityNormal.clone().multiplyScalar(-1 * elasticity).add(velocityTangent);
                        newPosition.subVectors( newPosition , planeNormal.clone().multiplyScalar( 2 * newDistance ));
                    }
                    positions.array[particleIndex * 3 + 0] = newPosition.x;
                    positions.array[particleIndex * 3 + 1] = newPosition.y;
                    positions.array[particleIndex * 3 + 2] = newPosition.z;
                    newGradientCubes[ Math.floor(newPosition.x/ 5)+ arrayLength/5/2][Math.floor(newPosition.y/5)+ arrayLength/5/2][Math.floor(newPosition.z/5)+ arrayLength/5/2]++;
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

