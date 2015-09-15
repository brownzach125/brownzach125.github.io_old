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
  
  this.ball = new BouncingBall();
  this.scene.add(this.ball.object);
  this.containingCube = new ContainingCube();
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
var planes = [ Plane.create(Vector.create([0,0 , 20]) , Vector.create([0,0,-1])),
               Plane.XY.translate(Vector.create([0,0,-20])),
               Plane.ZX.translate(Vector.create([0,-20,0])),
               Plane.create(Vector.create([0,20 , 0]) , Vector.create([0,-1,0])),
               Plane.ZY.translate(Vector.create([-20,0,0])),
               Plane.create(Vector.create([20,0 , 0]) , Vector.create([-1,0,0])) ];
                  
Simulation.prototype.keyPress = function(keycode) {
  // q 81
  // e 69
  // w 87
  // s 83
  // a 65
  // d 68
  var line  = null;
  var angle = 1 * Math.PI / 180; // 1 degree
  // q
  if ( keycode == 81 ) {
    line = Line.Z;
    angle *= -1;
    this.containingCube.cube.rotation.z += angle;
    this.containingCube.wireFrame.rotation.z += angle;
  }
    // e
  if ( keycode == 69 ) {
    line = Line.Z;
    //angle *= -1;
    this.containingCube.cube.rotation.z += angle;
    this.containingCube.wireFrame.rotation.z += angle;
  }
  // w
  if ( keycode == 87 ) {
    line = Line.X;
    //angle *= -1;
    this.containingCube.cube.rotation.x += angle;
    this.containingCube.wireFrame.rotation.x += angle;
  }
    // s
  if ( keycode == 83 ) {
    line = Line.X;
    angle *= -1;
    this.containingCube.cube.rotation.x += angle;
    this.containingCube.wireFrame.rotation.x += angle;
  }
    // a
  if ( keycode == 65 ) {
    line = Line.Y;
    angle *= -1;
    this.containingCube.cube.rotation.y += angle;
    this.containingCube.wireFrame.rotation.y += angle;
  }
    // d
  if ( keycode == 68 ) {
    line = Line.Y;
    //angle *= -1;
    this.containingCube.cube.rotation.y += angle;
    this.containingCube.wireFrame.rotation.y += angle;
  }
  for ( var i =0; i < planes.length; i++) {
    var plane = planes[i];
    planes[i] = plane.rotate(angle , line);
  }
};
