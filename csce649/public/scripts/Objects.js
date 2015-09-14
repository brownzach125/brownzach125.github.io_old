function ContainingCube() {
  var group = new THREE.Object3D();
  var material = new THREE.MeshBasicMaterial({ transparent:true , opacity:.2});
  var geometry = new THREE.BoxGeometry(50,50,50);
  var cube = new THREE.Mesh( geometry , material);
  group.add( cube );
  
  var wireFrame = new THREE.EdgesHelper( cube , 0xFFFFFF);
  group.add(wireFrame);
  
  return group; 
};

BouncingBall = function() {
  var mapUrl = "../images/badHeart.jpg";
  var map = THREE.ImageUtils.loadTexture(mapUrl);
  var geometry = new THREE.SphereGeometry(5,32,32);
  var ball = new THREE.Mesh( geometry , new THREE.MeshPhongMaterial({map:map}));
  this.object = ball;
  this.position = Vector.create([0,0,0]);  // meters
  this.velocity = Vector.create([0,0,0]); // meters / sec
  this.mass = 1;
  this.radius = 5;
};

var count  = 0;
BouncingBall.prototype.simulate = function(delta , h) {
  for (var i =0; i<delta; i+=h) {
    var step = h;
      while (step > 0) {
        acceleration = Gravity; // Set accelerations
        var newState = this.integrate(step , acceleration);
        var collision = this.detectCollision(newState);
        if ( collision ){
          f = collision['fraction'];
          console.log("F" + f);
          newState = this.integrate(f*step , acceleration);
          newState = this.computeResponse(collision , newState);
          this.updateState(newState);
          step = step - ( 1 - f ) * step;
          console.log("Step" + step);
        }
        else {
          // Make the new state the old state
          this.updateState(newState);
          // The step has been simulated
          step = 0;
        }
      }
  }
  this.updateObject();
};

BouncingBall.prototype.updateObject = function() {
  this.object.position.x = this.position.e(1);
  this.object.position.y = this.position.e(2);
  this.object.position.z = this.position.e(3);
};

BouncingBall.prototype.updateState = function(newState) {
  this.velocity = newState['velocity'];
  this.position = newState['position'];
};

BouncingBall.prototype.integrate = function(h , acceleration) {
  result = {};
  result['velocity'] = this.velocity.add( acceleration.multiply(h));
  result['position'] = this.position.add(this.velocity.multiply(h));
  return result;
};

/* Detects Collisions 
   @params
      newState: Hash of proposed position and velocity of ball
   return
      null - No collision
      hash - will contain details of collision 
*/
// TODO I want a much more general and useful collision detection
BouncingBall.prototype.detectCollision = function(newState) {
  // TODO DONT HARD CODE CUBES POSITION
  var collisionInfo = {};
  var xbl = -22.5;
  var xbr =  22.5;
  var newPosition = newState['position'];
  var oldPosition = this.position;
  if ( newPosition.e(2) <= -22.5) {
    collisionInfo['wall'] = 'bottom';
    collisionInfo['fraction'] = (oldPosition.e(2) - -22.5) / (oldPosition.e(2) - newPosition.e(2)); 
    return collisionInfo;
  }
  if ( newPosition.e(2) >= 22.5 ) {
    collisionInfo['wall'] = 'top';
    collisionInfo['fraction'] = (oldPosition.e(2) - 22.5) / (oldPosition.e(2) - newPosition.e(2)); 
    return collisionInfo;
  }
  return null;
};

//TODO current assumes elasticity to be 1
//TODO no friction
//TODO understand my vector library better
BouncingBall.prototype.computeResponse = function(collision , newState) {
  var elasticity = 1;
  var velocity = newState['velocity'];
  velocity = velocity.multiply(-1);
  newState['velocity'] = velocity;
  return newState;
};
