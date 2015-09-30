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
    constructor(document) {
        super();
        this.document = document;  // hack
        this.particleCount = 10000;
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
        for ( var particleIndex = 0; particleIndex < this.particleCount; particleIndex++) {
            for ( var i =0; i<delta; i+=h) {
                    var acceleration = new THREE.Vector3(0,0,0);
                    //---------------------
                    // calculate accleration;
                    //---------------------
                    acceleration.setY(-10);
                    //--------------------------------
                    // Integrate
                    //-------------------------------
                    var oldPosition = new THREE.Vector3(0,0,0);
                    oldPosition.setX( positions.array[particleIndex * 3 + 0] );
                    oldPosition.setY( positions.array[particleIndex * 3 + 1] );
                    oldPosition.setZ( positions.array[particleIndex * 3 + 2] );
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
            }
        }
       //---------------------
       // Update all particles
       // --------------------
       this.geometry.attributes.alpha.needsUpdate = true;
       this.geometry.attributes.position.needsUpdate = true;
    }
}

