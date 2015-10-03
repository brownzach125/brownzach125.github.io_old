/// <reference path="../../typings/threejs/three.d.ts" />
/// <reference path='./Object2.ts' />

'use strict'
//var Gravity = Vector.create([0,-10 , 0]);s
class Simulation2 {
    clock;
    renderer;
    scene;
    camera;
    cameraControls;
    points;
    objects:Object2[];
    timestep: number = .01;
    constructor(container) {
        this.objects = [];

        this.clock = new THREE.Clock();
        // Create the Three.js renderer, add it to our div
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild( this.renderer.domElement );

        this.scene = new THREE.Scene();
        // Put in a camera
        this.camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 4000 );
        this.camera.position.set( 0, 10, 100 );
        this.camera.rotation.y = 25;
        this.camera.rotation.x = 90;
        this.cameraControls = new THREE.TrackballControls( this.camera, this.renderer.domElement );

        // Create a directional light to show off the object
        var light = new THREE.DirectionalLight( 0xffffff, 1.5);
        light.position.set(0, 0, 1);
        this.scene.add( light );
    }
    //-----------------------
    // Simulate
    //------------------------
    simulate() {
        var delta = this.clock.getDelta(); // Time since last call in seconds
        this.cameraControls.update(delta);
        this.renderer.render( this.scene, this.camera );
        for ( var i =0; i < this.objects.length; i++) {
            this.objects[i].simulate(delta , this.timestep);
        }
    }
    //------------------------
    // Add Object
    //------------------------
    addObject(object: Object2) {
        this.scene.add(object.object);
        this.objects.push(object);
    }
}
