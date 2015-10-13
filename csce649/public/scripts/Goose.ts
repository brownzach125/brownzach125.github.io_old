/// <reference path="./Object2.ts" />

'use strict'


class Goose extends Object2 {
    mesh;
    leader;
    upVector: THREE.Vector3;
    headingVector: THREE.Vector3;
    constructor() {
        super();
        this.upVector = new THREE.Vector3(0,1,0);
        this.headingVector = new  THREE.Vector3(0,0,1);
    }
    init(param) {
        param = param || {};

        var mesh = param.mesh;
        if (!mesh)
            return;

        var group = new THREE.Object3D;
        this.setObject3D(group);
        var thing = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), this.makeMaterial() );
        this.object3D.add(mesh);
        this.mesh = mesh;
        //this.object3D.position.copy(new THREE.Vector3(0,-10,0));
    }

    update( delta? , timestep?) {
        
    }
    makeMaterial() {
        return new THREE.MeshBasicMaterial();
    }
}

class SmartGoose extends Goose {
    speed = -1;
    velocity;
    constructor() {
        super();
    }
    makeMaterial() {
        return new THREE.MeshBasicMaterial({color: 0xFF0000 , opacity: 1})
    }
    init(param) {
        super.init(param);
    }
    update(delta?, timestep?) {
        console.log("Sup");
    }
    pullUp(Up) {
        var degree = 5;
        if ( !Up) {
            degree *=-1;
        }
        //var axis = new THREE.Vector3(1,0,0);
        var axis = new THREE.Vector3(0,0,0).crossVectors( this.headingVector , this.upVector ).normalize();
        this.upVector.applyAxisAngle( axis, degree * Math.PI / 180 );
        this.headingVector.applyAxisAngle( axis, degree * Math.PI / 180 );
        this.object3D.rotateOnAxis( new THREE.Vector3(1,0,0)  , -1 * degree * Math.PI / 180);
        var app = this.getApp().gooseSystem;
        this.velocity = this.headingVector.clone().normalize().multiplyScalar(this.speed);
        app.state[app.particleCount] = this.velocity;
    }
    bankRight(right) {
        var degree = 5;
        if (!right) {
            degree *= -1;
        }

        var normalAxis = this.headingVector.clone().normalize();
        this.upVector.applyAxisAngle( normalAxis, degree * Math.PI / 180 );
        this.object3D.rotateOnAxis(   new THREE.Vector3(0,0,1)  , degree * Math.PI / 180);
    }
}
