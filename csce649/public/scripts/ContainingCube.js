ContainingCube = function(simulation) {
  this.simulation = simulation;
  this.object = new THREE.Object3D();
  this.material = new THREE.MeshBasicMaterial({ transparent:true , opacity:.2});
  this.geometry = new THREE.BoxGeometry(50,50,50);
  this.cube = new THREE.Mesh( this.geometry , this.material);
  this.object.add( this.cube );
  
  this.wireFrame = new THREE.EdgesHelper( this.cube , 0xFFFFFF);
  this.object.add(this.wireFrame);
  
  this.planes = [ Plane.create(Vector.create([0,0 , 20]) , Vector.create([0,0,-1])),
                  Plane.XY.translate(Vector.create([0,0,-20])),
                  Plane.ZX.translate(Vector.create([0,-20,0])),
                  Plane.create(Vector.create([0,20 , 0]) , Vector.create([0,-1,0])),
                  Plane.ZY.translate(Vector.create([-20,0,0])),
                  Plane.create(Vector.create([20,0 , 0]) , Vector.create([-1,0,0])) ];

};

ContainingCube.prototype.rotate = function(line , angle , axis) {
    
    var oldPlanes = [];
    for ( var i =0; i < this.planes.length; i++) {
      var plane = this.planes[i];
      oldPlanes.push(plane);
      this.planes[i] = plane.rotate(angle , line);
    }
    switch( axis ) {
      case 'x': 
        this.wireFrame.rotation.x += angle;
        this.cube.rotation.x += angle;
        break;
      case 'y':
        this.wireFrame.rotation.y += angle;
        this.cube.rotation.y += angle;
        break;
      case 'z':
        this.wireFrame.rotation.z += angle;
        this.cube.rotation.z += angle;
        break;
    }
    collisionInfo = this.detectCollision(oldPlanes);
    if ( collisionInfo ) {
      this.collisionResponse(collisionInfo);
    }
};


ContainingCube.prototype.collisionResponse = function(collisionInfo) {
  var ballPosition = this.simulation.ball.position;
  var plane = collisionInfo['plane'];
  var distanceFromPlane = plane.normal.dot(ballPosition.subtract( plane.anchor));
  var vectorTowardsPlaneTwice = plane.normal.multiply(distanceFromPlane * 2);
  this.simulation.ball.position = ballPosition.subtract(vectorTowardsPlaneTwice);
};

ContainingCube.prototype.detectCollision = function(oldPlanes) {
  var ballPosition = this.simulation.ball.position;
  for ( var i =0; i < this.planes.length; i++) {
    var oldDistance = oldPlanes[i].normal.dot(ballPosition.subtract( oldPlanes[i].anchor ));
    var newDistance = this.planes[i].normal.dot(ballPosition.subtract( this.planes[i].anchor));
    if ( oldDistance * newDistance < 0 ) {
      var collisionInfo = {};
      collisionInfo['fraction'] = oldDistance / ( oldDistance - newDistance);
      collisionInfo['plane'] = this.planes[i];
      collisionInfo['oldDistance'] = oldDistance;
      collisionInfo['newDistance'] = newDistance;
      return collisionInfo;
    }
  }
  return null;  
};






