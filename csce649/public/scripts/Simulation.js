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