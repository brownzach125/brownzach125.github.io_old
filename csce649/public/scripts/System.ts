/// <reference path="./Object2.ts" />
class State {
    struts : Strut[] = [];
    faces  : Face[] = [];
    vertices : Vertex[] = [];
    constructor( struts: Strut[] , faces: Face[] , vertices: Vertex[]) {
        this.struts = struts;
        this.faces  = faces;
        this.vertices = vertices;
    }
    zeroForces() {
        for ( var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].force = new THREE.Vector3(0,0,0);
        }
    }
    clone() {
        var struts = [];
        var faces = [];
        var vertices = [];
        for ( var i = 0; i < this.struts.length; i++) {
            struts.push( this.struts[i].clone());
        }
        for ( var i = 0; i < this.faces.length; i++) {
            faces.push( this.faces[i].clone());
        }
        for ( var i = 0; i < this.vertices.length; i++) {
            vertices.push( this.vertices[i].clone());
        }
        return new State( struts , faces , vertices);
    }
    add( scaler , dynamic : StateDynamic) {
        for ( var i =0; i < this.vertices.length; i++) {
            this.vertices[i].position.add( dynamic.values[i].clone().multiplyScalar(scaler));
            this.vertices[i].velocity.add( dynamic.values[i + this.vertices.length].clone().multiplyScalar(scaler));
        }
        return this;
    }
    getStateDynamic() {
        var dynamic = new StateDynamic(0);
        for ( var i =0; i < this.vertices.length; i++) {
            dynamic.values.push( this.vertices[i].velocity.clone());
        }
        for ( var i =0; i< this.vertices.length; i++) {
            dynamic.values.push( this.vertices[i].force.clone() );
        }
        return dynamic;
    }
}

class StateDynamic {
    values: THREE.Vector3[] = [];
    constructor(number) {
        for ( var i =0; i < number; i++) {
            this.values.push( new THREE.Vector3(0,0,0));
        }
    }
    add(scaler , other: StateDynamic) {
        for ( var i = 0; i < this.values.length; i++) {
            this.values[i].add( other.values[i].multiplyScalar(scaler));
        }
        return this;
    }
}

class Strut {
    a;
    b;
    nominalLength = 1;
    restLength: number = 2;
    springConstant: number = 1;
    damperConstant = 1;
    constructor( a , b , restLength) {
        this.a = a;
        this.b = b;
        this.restLength = restLength;
        this.springConstant = 1 / this.restLength;
    }
    clone() {
        return new Strut(this.a , this.b, this.restLength);
    }
}

class Face {
    a;
    b;
    c;
    f: THREE.Face3;
    constructor( face: THREE.Face3  ) {
        this.a = face.a;
        this.b = face.b;
        this.c = face.c;
        this.f = face;
    }
    clone() {
        return new Face( this.f);
    }
}

class Vertex {
    position: THREE.Vector3;
    velocity: THREE.Vector3 = new THREE.Vector3(0,0,0);
    force:    THREE.Vector3 = new THREE.Vector3(0,0,0);
    constructor(position: THREE.Vector3 ) {
        this.position = position.clone();
    }
    clone() {
        var vertex = new Vertex( this.position );
        vertex.force = this.force.clone();
        vertex.velocity = this.velocity.clone();
        return vertex;
    }
}

class System extends Object2 {
    state: State;
    oldState: State;
    elasticity =1;
    integration =1;
    constructor() {
        super();
        this.createInitialState();
    }
    init(params) {
        for ( var i =0; i < params.sliders.length; i++) {
            var variableName = params.sliders[i].variableName;
            var slider = params.sliders[i];
            if ( this[variableName] ) {
                this[variableName] = parseFloat(slider.slider.value);
                var that = this;


                slider.setCallback(  function (value , variableName) {
                    that[variableName] = parseFloat(value);
                    that.getApp().focus();
                });
            }
        }
    }
    update( delta , timestep) {
        for ( var h =0; h < delta; h += timestep ) {
            if ( this.integration) {
                this.integrate(timestep , "RK");
            }
            else {
                this.integrate(timestep , "ER");
            }
            var collision = this.detectCollision();
            if ( collision ) {
                this.collisionResponse(collision);
            }
        }
        this.updateViewObject();
    }
    integrate( timestep , integrationType ) {
        this.oldState = this.state.clone();
        if ( integrationType == "RK") {
            this.runge_kutta(timestep);
        } else
        if ( integrationType == "ER") {
            this.eulor(timestep);
        } else {
            console.log("Invalid intergration technique");
        }
    }
    F(state: State) {
        state.zeroForces();
        this.computeForces(state);
        return state.getStateDynamic();
    }
    runge_kutta(timestep) {
        var K1 = this.F(this.state);
        var K2 = this.F(this.state.clone().add( .5 * timestep , K1) );
        var K3 = this.F(this.state.clone().add( .5 * timestep , K2) );
        var K4 = this.F(this.state.clone().add( timestep , K3 ));
        this.state.add( timestep * (1/6) , K1.add( 2 , K2).add(2 , K3).add(1 , K4) );
    }
    eulor(timestep) {
        this.state.add( timestep , this.F(this.state));
    }

    // Virtual functions
    createInitialState() {

    }
    updateViewObject() {

    }
    computeForces(state) {

    }
    detectCollision() {
        // TODO hacky and only works for static object
        var children = this.getApp().objects;
        for ( var i = 0; i < this.state.vertices.length; i++ ) {
            var oldPoint = this.oldState.vertices[i].position;
            var newPoint = this.state.vertices[i].position;
            var velocity = this.state.vertices[i].velocity;
            for ( var j =0; j < children.length; j++) {
                if ( children[j] == this) {
                    continue;
                }
                var otherObject = children[j];
                var normal = otherObject.getNormal();
                var anchor = otherObject.getAnchor();
                var oldDistance = oldPoint.clone().sub( anchor ).dot( normal);
                var newDistance = newPoint.clone().sub( anchor ).dot( normal);
                if ( newDistance * oldDistance < 0 ) {
                    // TODO move respone to different funciton
                    // TODO do proper inside test you bastard
                    var inPolygon = otherObject.inside(oldPoint , velocity);
                    if ( inPolygon) {
                        var velocityNormal = normal.clone().multiplyScalar(velocity.dot(normal));
                        var velocityTangent = velocity.clone().sub(velocityNormal);
                        velocity.addVectors(velocityNormal.clone().multiplyScalar(-1 * this.elasticity)  , velocityTangent);
                        newPoint.sub(normal.clone().multiplyScalar( 2 * newDistance ));
                    }
                }
            }
        }


        // Every edge in object1
        for (var i =0; i < this.state.vertices.length; i++) {
            var point1 = this.oldState.vertices[i];
            var point2 = this.oldState.vertices[ (i + 1) % this.state.vertices.length ];
            var edge1 = point1.position.clone().sub(point2.position);
            for ( var j =0; j < children.length; j++) {
                if ( children[j] == this) {
                    continue;
                }
                var otherObject = children[j];
                // Every edge in object2
                for (var k = 0; k < otherObject.object3D.geometry.vertices.length; k++) {
                    var opoint1 = otherObject.getPoint(k);
                    var opoint2 = otherObject.getPoint((k + 1) % otherObject.object3D.geometry.vertices.length );
                    var oedge1  = opoint1.clone().sub(opoint2);

                    var r  = point1.position.clone().sub(opoint1);
                    var planeNormal = edge1.clone().cross(oedge1).normalize();

                    var s = r.dot( oedge1.clone().normalize().cross(planeNormal) ) / (edge1.dot( oedge1.clone().normalize().cross(planeNormal)));
                    var t = -1 * r.dot( edge1.clone().normalize().cross(planeNormal) ) / (oedge1.dot( edge1.clone().normalize().cross(planeNormal)));

                    var pA = point1.position.clone().add( edge1.clone().multiplyScalar(s));
                    var qA = opoint1.clone().add( oedge1.clone().multiplyScalar(t));

                    var olddistance = point1.position.clone().sub( opoint1).dot(planeNormal);
                    var newdistance = this.state.vertices[i].position.clone().sub(opoint1).dot(planeNormal);

                    if ( olddistance * newdistance < 0 && s <= 1 && s >= 0 && t <= 1 && t >=0) {
                        console.log("collision detected");

                        var velocity = point1.velocity.clone().add(point2.velocity).divideScalar(2);
                        var vn = planeNormal.clone().multiplyScalar(velocity.dot(planeNormal));
                        var velocityTangent = velocity.clone().sub(vn);

                        var velocityChange = vn.clone().multiplyScalar(-1 * this.elasticity).clone().add(velocityTangent).sub(velocity);
                        var vDelta = velocityChange.divideScalar( s *s + (1-s) * (1-s));
                        //velocity.addVectors(velocityNormal.clone().multiplyScalar(-1 * this.elasticity)  , velocityTangent);
                        //newPoint.sub(normal.clone().multiplyScalar( 2 * newDistance ));


                        //this.state.vertices[i].velocity.addVectors(vn.clone().multiplyScalar(-1 * this.elasticity)  , velocityTangent);
                        //this.state.vertices[ (i + 1) % this.state.vertices.length ].velocity.addVectors(vn.clone().multiplyScalar(-1 * this.elasticity)  , velocityTangent);
                        this.state.vertices[i].velocity.addVectors( point1.velocity ,  vDelta.clone().multiplyScalar(s));
                        this.state.vertices[ (i + 1) % this.state.vertices.length ].velocity.addVectors ( point2.velocity , vDelta.clone().multiplyScalar(1-s));

                        //this.state.vertices[i].position.subVectors( point1.position ,planeNormal.clone().multiplyScalar( 2 * newDistance ));
                        //this.state.vertices[ (i + 1) % this.state.vertices.length ].position.subVectors( point2.position ,planeNormal.clone().multiplyScalar( 2 * newDistance ));
                        this.state.vertices[i].position.sub(planeNormal.clone().multiplyScalar( 2 * newDistance ));
                        this.state.vertices[ (i + 1) % this.state.vertices.length ].position.sub( planeNormal.clone().multiplyScalar( 2 * newDistance ));
                    }

                }
            }
        }

        return null;
    }

    /*
     var plane;
     for ( var l = 0; l < this.hitList.length; l++) {
     plane = this.hitList[l].plane;
     var planeNormal = new THREE.Vector3( plane.normal.elements[0] , plane.normal.elements[1] , plane.normal.elements[2]);
     var planeAnchor = new THREE.Vector3( plane.anchor.elements[0] , plane.anchor.elements[1] , plane.anchor.elements[2]);
     var oldDistance  = ( new THREE.Vector3().subVectors( oldPosition , planeAnchor ) ).dot( planeNormal );
     var newDistance  = ( new THREE.Vector3().subVectors( newPosition , planeAnchor ) ).dot( planeNormal );
     // Collision with plane
     if ( oldDistance * newDistance  < 0 ) {
     //--------------------------------
     // Collision with polygon
     //--------------------------------
     //console.log("collision possible");
     var ray = new THREE.Ray(oldPosition , velocity.clone().normalize());
     var triangles = this.hitList[l].faces;
     for ( var n = 0; n < triangles.length; n++ ) {
     var triangle = triangles[n];
     var hit = ray.intersectTriangle( triangle[0] , triangle[1] , triangle[2] , false);
     if ( hit ) {
     //--------------------------------
     // Collision Response
     //--------------------------------

     var elasticity = .01;
     var velocityNormal = planeNormal.clone().multiplyScalar(velocity.dot(planeNormal));
     var velocityTangent = velocity.clone().sub(velocityNormal);
     velocity = velocityNormal.clone().multiplyScalar(-1 * elasticity).add(velocityTangent);
     newPosition.subVectors( newPosition , planeNormal.clone().multiplyScalar( 2 * newDistance ));
     break;
     }
     }
     }
     }
     var epsilon = 1;
     //if ( oldPosition.sub(newPosition).length() > epsilon && velocity.length() > epsilon ) {
     positions.array[particleIndex * 3 + 0] = newPosition.x;
     positions.array[particleIndex * 3 + 1] = newPosition.y;
     positions.array[particleIndex * 3 + 2] = newPosition.z;
     this.velocities[particleIndex] = velocity;
     if ( this.velocities[particleIndex].y > 0) {
     this.velocities[particleIndex].setY(0);
     }
     */
    collisionResponse(collision) {

    }
}