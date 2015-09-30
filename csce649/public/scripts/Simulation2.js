/// <reference path="../../typings/threejs/three.d.ts" />
/// <reference path='./Object2.ts' />
'use strict';
//var Gravity = Vector.create([0,-10 , 0]);s
var Simulation2 = (function () {
    function Simulation2(container) {
        this.timestep = .01;
        this.objects = [];
        this.clock = new THREE.Clock();
        // Create the Three.js renderer, add it to our div
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        // Put in a camera
        this.camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 4000);
        this.camera.position.set(0, 0, 200);
        this.cameraControls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        // Create a directional light to show off the object
        var light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(0, 0, 1);
        this.scene.add(light);
    }
    //-----------------------
    // Simulate
    //------------------------
    Simulation2.prototype.simulate = function () {
        var delta = this.clock.getDelta(); // Time since last call in seconds
        this.cameraControls.update(delta);
        this.renderer.render(this.scene, this.camera);
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].simulate(delta, this.timestep);
        }
    };
    //------------------------
    // Add Object
    //------------------------
    Simulation2.prototype.addObject = function (object) {
        this.scene.add(object.object);
        this.objects.push(object);
    };
    return Simulation2;
})();
/*
 particleCount = 180000;
 particles = new THREE.Geometry();

 // now create the individual particles
 for (var p = 0; p < particleCount; p++) {
 // create a particle with random
 // position values, -250 -> 250
 var pX = Math.random() * 500 - 250,
 pY = Math.random() * 500 - 250,
 pZ = Math.random() * 500 - 250,
 particle = new THREE.Vector3(pX, pY, pZ);

 // add it to the geometry
 particles.vertices.push(particle);
 }

 // vertex colors
 var colors = [];
 for( var i = 0; i < particles.vertices.length; i++ ) {
 // random color
 colors[i] = new THREE.Color();
 colors[i].setHSL( Math.random(), 1.0, 0.5 );

 }
 particles.colors = colors;

 // material
 var material = new THREE.PointCloudMaterial( {
 size: 10,
 transparent: true,
 opacity: 0.7,
 vertexColors: THREE.VertexColors
 } );

 // point cloud
 pointCloud = new THREE.PointCloud( particles, material );

 // create the particle system
 //var particleSystem = new THREE.( particles,  pMaterial);
 // add it to the scene
 simulation.addObject(pointCloud);

 for (var p = 0; p < particleCount; p++) {
 //pointCloud.geometry.vertices[p] = pointCloud.geometry.vertices[p].add( new THREE.Vector3( 0 , 0 , 1) );
 pointCloud.geometry.colors[p] = new THREE.Color().setHSL( Math.random() , 1.0 ,.5);
 pointCloud.geometry.verticesNeedUpdate = true;
 pointCloud.geometry.colorsNeedUpdate  = true;
 }
 */ 
//# sourceMappingURL=Simulation2.js.map