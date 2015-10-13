/// <reference path="./ParticleSystem.ts" />
/// <reference path="./jsonModel.ts" />
/// <reference path="./Goose.ts" />
'use strict'

class FlockSystem extends ParticleSystem {
    gooseModel;
    centeringConstant;
    velocityMatchConstant;
    avoidanceConstant;
    smartGoose: SmartGoose;
    smartGooseIndex;
    keys = {};
    constructor() {
        super();
        this.particleCount = 25
        this.centeringConstant = .4;
        this.velocityMatchConstant = .5;
        this.avoidanceConstant = .5;
        this.object3D = new THREE.Object3D();
        this.loadGoose();
    }
    update(delta? , timestep?) {
        // Update the smart goose
        // Let the particle system parent handle the rest
        super.update(delta , timestep);
    }
    init(params) {
        var that = this;
        if ( params.advoidanceSlider ){
            params.advoidanceSlider.setCallback( function(value) {
                that.avoidanceConstant = value;
                that.getApp().focus();
            } );
        }
        if ( params.velocitySlider ){
            params.velocitySlider.setCallback( function(value) {
                that.velocityMatchConstant = value;
                that.getApp().focus();
            } );
        }
        if ( params.centeringSlider ){
            params.centeringSlider.setCallback( function(value) {
                that.centeringConstant = value;
                that.getApp().focus();
            } );
        }
    }
    sigmoid(t) {
        return 1/(1+Math.pow(Math.E, -t));
    }
    vertexForce(boidIndex: number) {
        if ( boidIndex == this.smartGooseIndex) {
            return new THREE.Vector3(0,0,0);
        }
        var positionI:THREE.Vector3 = this.children[boidIndex].object3D.position;
        var positionJ:THREE.Vector3 = new THREE.Vector3(0,0,0);

        var velocityI:THREE.Vector3 = this.children[boidIndex].velocity;
        var velocityJ:THREE.Vector3 = new THREE.Vector3(0,0,0);

        var normal:THREE.Vector3 = new THREE.Vector3(0,0,0);
        var force:THREE.Vector3  = new THREE.Vector3(0,0,0);
        for ( var j = 0; j < this.children.length; j++) {
            if ( j == boidIndex){
                continue;
            }
            var partialForce:THREE.Vector3 = new THREE.Vector3(0,0,0);
            var temp:THREE.Vector3 = new THREE.Vector3(0,0,0);
            positionJ  = this.children[j].object3D.position;
            normal.subVectors( positionJ , positionI).normalize();
            var distance = positionI.distanceTo(positionJ);
            velocityJ = this.children[j].velocity;
            var weight = 1;
            if ( j == this.smartGooseIndex) {
                //weight = 500;
            }
            else {
                weight *= this.sigmoid(distance * distance * distance);
            }
            // Avoidance Force
            partialForce.add( normal.clone().multiplyScalar( this.avoidanceConstant * -1).divideScalar( distance ));

            // Centering Force
            partialForce.add( normal.multiplyScalar(distance * this.centeringConstant) );

            // Velocity Matching
            partialForce.add( temp.subVectors( velocityJ , velocityI).multiplyScalar(this.velocityMatchConstant));

            if (j != this.smartGooseIndex ){
                partialForce.divideScalar(100);
            }
            force.add(partialForce.multiplyScalar(weight));
        }
        return force;
    }

    loadGoose() {
        var model = new JSONModel;
        var that = this;
        model.init(
            {
                url : "./models/goose/goose.json",
                callback: function(model) { that.onGooseLoaded(model, "nova",
                    {
                        scale:0.7,
                        position:{x:0, y: 0, z: 0},
                        rotation:{x: 0, y:0, z: 0},
                    }); }
            }
        );
    }
    onGooseLoaded( model , make , options) {
        this.gooseModel = { make: make, model : model, options : options };

        if (this.gooseModel) {
            this.createGeese();
        }
    }

    createGeese() {
        var object = this.createGoose();
        this.smartGoose = new SmartGoose();
        this.smartGoose.init( {mesh : object});
        this.addChild(this.smartGoose);
        this.smartGooseIndex = 0;

        var amount = this.particleCount;
        for ( var i =1; i < amount; i++) {
            var object = this.createGoose();
            var goose = new Goose();
            goose.init( {mesh : object });
            this.addChild(goose);
        }
        for ( var i =0; i < amount; i++) {
            this.state.push( new THREE.Vector3( 0 , 0,0));
            // this.state.push( new THREE.Vector3(Math.random() * 5 - 2 ,Math.random() *5 -2, Math.random() * 5 -2));
            this.statePrime.push(new THREE.Vector3(0,0,0));
        }

        for ( var i =0; i < amount; i++) {
            this.state.push( new THREE.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5 , Math.random() * 10 - 5));
            this.statePrime.push(new THREE.Vector3(0,0,0));
        }

        this.state[0 + this.particleCount].set( 0 , 0 ,0);
        this.ready = true;
    }
    createGoose() {
        var group = new THREE.Object3D;
        group.rotation.y = Math.PI;
        var options = this.gooseModel.options;
        var model = this.gooseModel.model;
        var geo = model.mesh.geometry;
        var material = model.mesh.material;
        var mesh = new THREE.Mesh( geo,  new THREE.MeshPhongMaterial() );
        mesh.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z)
        mesh.scale.set(options.scale, options.scale, options.scale);
        mesh.position.set(options.position.x, options.position.y, options.position.z);

        group.add(mesh);

        return group;
    }
    handleKeyDown(keyCode, keyChar) {
        if (this.smartGoose) {
            switch(keyCode) {
                case 87: { // w
                    this.keys['w'] = true;
                    this.smartGoose.pullUp(true);
                    break;
                }
                case 65: { // a
                    this.keys['a'] = true;
                    this.smartGoose.bankRight(true);
                    break;
                }
                case 83: { // s
                    this.keys['s'] = true
                    this.smartGoose.pullUp(false);
                    break;
                }
                case 68: { // d
                    this.keys['d'] = true;
                    this.smartGoose.bankRight(false);
                    break;
                }
                case 81: { // q
                    this.keys['q'] = true;
                    break;
                }
                case 69: { // e
                    this.keys['e'] = true;
                    break;
                }
            }
        }
    }
    handleKeyUp(keyCode , keyChar) {
        if (this.smartGoose) {
            switch(keyCode) {
                case 87: { // w
                    this.keys['w'] = false;
                    break;
                }
                case 65: { // a
                    this.keys['a'] = false;
                    break;
                }
                case 83: { // s
                    this.keys['s'] = false;
                    break;
                }
                case 68: { // d
                    this.keys['d'] = false;
                    break;
                }
                case 81: { // q
                    this.keys['q'] = false;
                    break;
                }
                case 69: { // e
                    this.keys['e'] = false;
                    break;
                }
            }
        }
    }
}