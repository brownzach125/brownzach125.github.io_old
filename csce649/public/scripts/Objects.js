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
  this.position = Vector.create([0,-18,0]);  // meters
  this.velocity = Vector.create([0,0,0]); // meters / sec
  this.mass = 1;
  this.radius = 5;
  this.elasticity = .95;
  this.frictionCoeff = .01;
  this.windCoeff = .0;
  this.restingError = 1;
  this.atRest = false;
};

var count  = 0;
// Simulates object behavior over time delta with timestep h
BouncingBall.prototype.simulate = function(delta , h) {
  if (!this.atRest)
  for (var i =0; i<delta; i+=h) {
    var step = h;
      while (step > 0) {
        var newState = {};
        newState['acceleration'] = this.calcForces().multiply( 1/ this.mass);;
        newState = this.integrate(step , newState);
        var collision = this.detectCollision(newState);
        if ( collision ){
          f = collision['fraction'];
          newState = this.integrate(f*step , newState);
          newState = this.computeResponse(collision , newState);
          this.updateState(newState);
          step = step - ( 1 - f ) * step;
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

BouncingBall.prototype.integrate = function(h , newState) {
  newState['velocity'] = this.velocity.add( newState['acceleration'].multiply(h));
  newState['position'] = this.position.add(this.velocity.multiply(h));
  return newState;
};


var planes = [ Plane.XY.translate(Vector.create([0,0,20])),
               Plane.XY.translate(Vector.create([0,0,-20])),
               Plane.ZX.translate(Vector.create([0,-20,0])),
               //Plane.ZX.translate(Vector.create([0,20,0])),
               Plane.create(Vector.create([0,20 , 0]) , Vector.create([0,-1,0])),
               Plane.ZY.translate(Vector.create([-20,0,0])),
               Plane.ZY.translate(Vector.create([20,0,0])) ];           

/* Detects Collisions 
   @params
      newState: Hash of proposed position and velocity of ball
   return
      null - No collision
      hash - will contain details of collision 
*/
// TODO I want a much more general and useful collision detection
BouncingBall.prototype.detectCollision = function(newState) {
  // TODO Hanlde multiple collisions correctly
  var collisionInfo = {};
  
  for (var i =0; i < planes.length; i++) {
    plane = planes[i];
    var oldDistance  = ( this.position.subtract( plane.anchor ) ).dot( plane.normal );
    var newDistance  = ( newState['position'].subtract( plane.anchor) ).dot( plane.normal );
    if ( oldDistance * newDistance  < 0 ) {
      collisionInfo['fraction'] = oldDistance / ( oldDistance - newDistance );
      collisionInfo['plane']    = plane;
      return collisionInfo; 
    }
  }
  return null;
};


//TODO understand my vector library better

BouncingBall.prototype.computeResponse = function(collision , newState) {
  var elasticity = this.elasticity;
  var plane = collision['plane'];
  var velocity = newState['velocity'];
  var velocityNormal = plane.normal.multiply(velocity.dot(plane.normal));
  var velocityTangent = velocity.subtract(velocityNormal);
  velocityTangent = velocityTangent.subtract( this.calcFrictionLoss(velocityNormal , velocityTangent) );
  newState['velocity'] = velocityNormal.multiply(-1 * this.elasticity).add(velocityTangent);
  //velocity = velocity.multiply(-1);
  //newState['velocity'] = velocity;
  newState = this.isResting(newState , collision);
  return newState;
};

BouncingBall.prototype.isResting = function(newState , collision) {
  // If not near surface
  // return
  // Will only be called after collision so not needed
  
  // Its going really slow
  
  var velocity = newState['velocity'];
  if ( newState['velocity'].dot(newState['velocity']) > this.restingError) {
    return newState;
  }
  
  // Accleration is away from  the surface
  if ( newState['acceleration'].dot( collision['plane'].normal) > 0) {
    return newState;
  } 
  
  newState['velocity'] = Vector.create([0,0,0]);
  this.atRest = true;
  return newState;
  
};

BouncingBall.prototype.calcFrictionLoss = function(normal , tangent){
  if ( tangent.eql(Vector.create([0,0,0]))) {
    return Vector.create([0,0,0]);
  }
  var loss = Math.min( this.frictionCoeff * normal.dot(normal) , tangent.dot(tangent));
  var unitNorm = tangent.multiply( 1/ Math.sqrt(tangent.dot(tangent)));
  var loss = unitNorm.multiply(loss);
  return loss;  
};


BouncingBall.prototype.calcForces = function() {
  var gravityForce = Gravity.multiply(this.mass); //Hack
  var windForce    = this.velocity.multiply( -1 * this.windCoeff);
  var force = windForce.add(gravityForce);
  return force;
};
