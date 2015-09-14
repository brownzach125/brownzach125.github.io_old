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
        accleration = Gravity; // Set accelerations
        var newState = this.integrate(step , accleration);
        var collision = this.detectCollision(newState);
        if ( collision ){
          // f = fraction
          // this.integrate(f)
          // compute response
          // step = step - ( 1 -f )
          step =0;
        }
        else {
          // 
          this.velocity = newState['velocity'];
          this.position = newState['position'];
          step = 0;
        }
      }
  }
  this.object.position.x = this.position.e(1);
  this.object.position.y = this.position.e(2);
  this.object.position.z = this.position.e(3);
};

BouncingBall.prototype.integrate = function(h , accleration) {
  result = {};
  result['velocity'] = this.velocity.add( accleration.multiply(h));
  result['position'] = this.position.add(this.velocity.multiply(h));
  return result;
};

BouncingBall.prototype.detectCollision = function(newState) {
  // TODO DONT HARD CODE CUBES POSITION
  var xbl = -22.5;
  var xbr =  22.5;
  if ( newState['position'].e(2) <= -22.5 || newState['position'].e(2) >= 22.5 ) {
    return true;
  }
  return false;
};
