var Gravity = Vector.create([0,-10 , 0]);

Simulation = function() {
  this.clock = null;
  this.renderer = null;
  this.camera   = null;
  this.scene    = null;
  this.cameraControls = null;
  
  // 
  this.timestep = .0005; // Seconds
  
  // Simulation Items
  this.ball = null;
  this.containingCube = null;
};

Simulation.prototype.initilize = function(container) {
  this.clock = new THREE.Clock();
  // Create the Three.js renderer, add it to our div
  this.renderer = new THREE.WebGLRenderer( { antialias: true } );
  this.renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild( this.renderer.domElement );
  // Create a new Three.js scene
  this.scene = new THREE.Scene();
  // Put in a camera
  this.camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 4000 );
  this.camera.position.set( 0, 0, 200 );
  // Create a directional light to show off the object
  var light = new THREE.DirectionalLight( 0xffffff, 1.5);
  light.position.set(0, 0, 1);
  this.scene.add( light );
  
  this.ball = new BouncingBall(simulation);
  this.scene.add(this.ball.object);
  this.containingCube = new ContainingCube(simulation);
  this.scene.add(this.containingCube.object);
  
  this.cameraControls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
};

Simulation.prototype.simulate = function() {
  var delta = this.clock.getDelta(); // Time since last call in seconds
  this.cameraControls.update(delta);
  this.ball.simulate(delta , this.timestep);
  this.renderer.render( this.scene, this.camera );
};

// Something has changed let shit know
Simulation.prototype.update = function() {
  this.ball.update();
};
                  
Simulation.prototype.keyPress = function(keycode) {
  var line  = null;
  var angle = 1 * Math.PI / 180; // 1 degree in radians
  var axis = 'z';
  switch(keycode) {
    // q
    case 81:
        angle *= -1;
    // e
    case 69:
        line = Line.Z;
        axis = 'z';
        break;
    // s
    case 83:
        angle *= -1;
    // w
    case 87:
        line = Line.X;
        axis = 'x';
        break;
    //a 
    case 65:
        angle *=-1;
    // d
    case 68:
        line = Line.Y;
        axis = 'y';
        break;
    default:
  }
  this.containingCube.rotate( line , angle , axis );
  simulation.update();
};

Simulation.prototype.addObject = function(thing) {
    this.scene.add(thing);
};


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