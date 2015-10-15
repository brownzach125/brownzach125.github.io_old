/// <reference path="./ParticleSystem.ts" />
/// <reference path="./jsonModel.ts" />
/// <reference path="./Goose.ts" />
/// <reference path="./Collidable.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SpatialDivision = (function () {
    function SpatialDivision(cubeSize) {
        this.cubeSize = cubeSize;
        this.map = {};
    }
    SpatialDivision.prototype.reset = function () {
        this.map = {};
    };
    SpatialDivision.prototype.placePoint = function (object) {
        if (!object)
            return;
        var vector = object.object3D.position;
        var i = Math.floor(vector.x / this.cubeSize);
        var j = Math.floor(vector.y / this.cubeSize);
        var k = Math.floor(vector.z / this.cubeSize);
        this.checkEntry(i, j, k);
        this.map[i][j][k].push(object);
    };
    SpatialDivision.prototype.placeObject = function (object) {
        if (!object)
            return;
        var vector = object.object3D.position;
        var i = Math.floor(vector.x / this.cubeSize);
        var j = Math.floor(vector.y / this.cubeSize);
        var k = Math.floor(vector.z / this.cubeSize);
        var radius = Math.floor(object.object3D.geometry.boundingSphere.radius / this.cubeSize);
        for (var x = i - radius; x <= i + radius; x++) {
            for (var y = j - radius; y <= y + radius; y++) {
                for (var z = k - radius; z <= k + radius; z++) {
                    this.checkEntry(x, y, z);
                    this.map[x][y][z].push(object);
                }
            }
        }
    };
    SpatialDivision.prototype.checkEntry = function (i, j, k) {
        if (!this.map[i]) {
            this.map[i] = {};
        }
        if (!this.map[i][j]) {
            this.map[i][j] = {};
        }
        if (!this.map[i][j][k]) {
            this.map[i][j][k] = [];
        }
    };
    SpatialDivision.prototype.within = function (radius, vector) {
        //TODO only checks nearby by one layer
        var i = Math.floor(vector.x / this.cubeSize);
        var j = Math.floor(vector.y / this.cubeSize);
        var k = Math.floor(vector.z / this.cubeSize);
        var result = [];
        radius = Math.floor(radius / this.cubeSize);
        for (var x = i - radius; x <= i + radius; x++) {
            if (this.map[x])
                for (var y = j - radius; y <= j + radius; y++) {
                    if (this.map[x][y])
                        for (var z = k - radius; z <= k + radius; z++) {
                            if (this.map[x][y][z])
                                result = result.concat(this.map[x][y][z]);
                        }
                }
        }
        return result;
    };
    return SpatialDivision;
})();
var FlockSystem = (function (_super) {
    __extends(FlockSystem, _super);
    function FlockSystem() {
        _super.call(this);
        this.keys = {};
        this.particleCount = 25;
        this.centeringConstant = .4;
        this.velocityMatchConstant = .5;
        this.avoidanceConstant = .5;
        this.object3D = new THREE.Object3D();
        this.loadGoose();
        this.spatialMap = new SpatialDivision(2);
    }
    FlockSystem.prototype.update = function (delta, timestep) {
        _super.prototype.update.call(this, delta, timestep);
        if (this.ready && this.spatialMap) {
            this.spatialMap.reset();
            for (var i = 0; i < this.collidables.length; i++) {
                this.spatialMap.placePoint(this.collidables[i]);
            }
            for (var i = 0; i < this.children.length; i++) {
                this.spatialMap.placePoint(this.children[i]);
            }
        }
    };
    FlockSystem.prototype.init = function (params) {
        var that = this;
        if (params.advoidanceSlider) {
            that.avoidanceConstant = params.advoidanceSlider.slider.value;
            params.advoidanceSlider.setCallback(function (value) {
                that.avoidanceConstant = value;
                that.getApp().focus();
            });
        }
        if (params.velocitySlider) {
            that.velocityMatchConstant = params.velocitySlider.slider.value;
            params.velocitySlider.setCallback(function (value) {
                that.velocityMatchConstant = value;
                that.getApp().focus();
            });
        }
        if (params.centeringSlider) {
            that.centeringConstant = params.centeringSlider.slider.value;
            params.centeringSlider.setCallback(function (value) {
                that.centeringConstant = value;
                that.getApp().focus();
            });
        }
        this.collidables = params.collidables;
    };
    FlockSystem.prototype.sigmoid = function (t) {
        return 1 / (1 + Math.pow(Math.E, -t));
    };
    FlockSystem.prototype.vertexForce = function (boidIndex) {
        if (boidIndex == this.smartGooseIndex) {
            return this.avoidObjects(boidIndex);
        }
        var positionI = this.children[boidIndex].object3D.position;
        var positionJ = new THREE.Vector3(0, 0, 0);
        var velocityI = this.children[boidIndex].velocity;
        var velocityJ = new THREE.Vector3(0, 0, 0);
        var normal = new THREE.Vector3(0, 0, 0);
        var force = new THREE.Vector3(0, 0, 0);
        var things = this.spatialMap.within(2, positionI);
        things.push(this.smartGoose);
        for (var j = 0; j < things.length; j++) {
            if (!(things[j] instanceof Goose))
                continue;
            // TODO do I need to check for the same boid
            var partialForce = new THREE.Vector3(0, 0, 0);
            var temp = new THREE.Vector3(0, 0, 0);
            positionJ = things[j].object3D.position;
            normal.subVectors(positionJ, positionI).normalize();
            var distance = positionI.distanceTo(positionJ);
            velocityJ = things[j].velocity;
            var weight = 1;
            if (j == things.length - 1) {
                weight = 10;
            }
            weight *= this.sigmoid(distance * distance * distance);
            // Avoidance Force
            partialForce.add(normal.clone().multiplyScalar(this.avoidanceConstant * -1).divideScalar(distance));
            // Centering Force
            partialForce.add(normal.multiplyScalar(distance * this.centeringConstant));
            // Velocity Matching
            partialForce.add(temp.subVectors(velocityJ, velocityI).multiplyScalar(this.velocityMatchConstant));
            force.add(partialForce.multiplyScalar(weight));
        }
        // Add acceleration to avoid collidables
        var avoidObjectForce = this.avoidObjects(boidIndex);
        force.add(avoidObjectForce);
        // Add gradientForce
        //force.add(this.gradient.effect(positionI));
        return force;
    };
    FlockSystem.prototype.avoidObjects = function (boidIndex) {
        // Detect If On Collision Route
        var boid = this.children[boidIndex];
        var things = this.spatialMap.within(8, boid.object3D.position.clone());
        var action = new THREE.Vector3(0, 0, 0);
        for (var i = 0; i < things.length; i++) {
            if (!(things[i] instanceof Collidable)) {
                continue;
            }
            var collidable = things[i];
            var radius = collidable.object3D.geometry.boundingSphere.radius;
            var boidPosition = boid.object3D.position;
            var collidablePosition = collidable.object3D.position;
            var boidVelocity = boid.velocity;
            var normal = collidablePosition.clone().sub(boidPosition).normalize();
            var distanceToTravel = collidablePosition.clone().sub(boidPosition).length() - radius;
            var time = distanceToTravel / boidVelocity.dot(normal);
            if (boidVelocity.dot(normal) < 0)
                continue;
            var m = boidVelocity.clone().sub(normal.clone().multiplyScalar(boidVelocity.dot(normal))).length() * time;
            if (m > radius) {
                // No action needed
                continue;
            }
            else {
                var direction = boidVelocity.clone().sub(normal.multiplyScalar(boidVelocity.dot(normal)));
                var amount = 2 * (distanceToTravel - m) / (time * time);
                action.add(direction.multiplyScalar(amount));
            }
        }
        if (action.length() > 2) {
            action.normalize().multiplyScalar(2);
        }
        return action;
    };
    FlockSystem.prototype.loadGoose = function () {
        var model = new JSONModel;
        var that = this;
        model.init({
            url: "./models/goose/goose.json",
            callback: function (model) {
                that.onGooseLoaded(model, "nova", {
                    scale: 0.7,
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 }
                });
            }
        });
    };
    FlockSystem.prototype.onGooseLoaded = function (model, make, options) {
        this.gooseModel = { make: make, model: model, options: options };
        if (this.gooseModel) {
            this.createGeese();
        }
    };
    FlockSystem.prototype.createGeese = function () {
        var object = this.createGoose();
        this.smartGoose = new SmartGoose();
        this.smartGoose.init({ mesh: object });
        this.addChild(this.smartGoose);
        this.smartGooseIndex = 0;
        var amount = this.particleCount;
        for (var i = 1; i < amount; i++) {
            var object = this.createGoose();
            var goose = new Goose();
            goose.init({ mesh: object });
            this.addChild(goose);
        }
        for (var i = 0; i < amount; i++) {
            //this.state.push( new THREE.Vector3( 0 , 0,0));
            this.state.push(new THREE.Vector3(Math.random() * 5 - 2, Math.random() * 5 - 2, Math.random() * 5 - 2));
            this.statePrime.push(new THREE.Vector3(0, 0, 0));
        }
        for (var i = 0; i < amount; i++) {
            this.state.push(new THREE.Vector3(0, 0, 0));
            this.statePrime.push(new THREE.Vector3(0, 0, 0));
        }
        this.state[this.particleCount].set(0, 0, 0);
        this.ready = true;
    };
    FlockSystem.prototype.createGoose = function () {
        var group = new THREE.Object3D;
        group.rotation.y = Math.PI;
        var options = this.gooseModel.options;
        var model = this.gooseModel.model;
        var geo = model.mesh.geometry;
        var material = model.mesh.material;
        var mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial());
        mesh.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
        mesh.scale.set(options.scale, options.scale, options.scale);
        mesh.position.set(options.position.x, options.position.y, options.position.z);
        group.add(mesh);
        return group;
    };
    FlockSystem.prototype.handleKeyDown = function (keyCode, keyChar) {
        if (this.smartGoose) {
            switch (keyCode) {
                case 87: {
                    this.keys['w'] = true;
                    this.smartGoose.pullUp(true);
                    break;
                }
                case 65: {
                    this.keys['a'] = true;
                    this.smartGoose.bankRight(true);
                    break;
                }
                case 83: {
                    this.keys['s'] = true;
                    this.smartGoose.pullUp(false);
                    break;
                }
                case 68: {
                    this.keys['d'] = true;
                    this.smartGoose.bankRight(false);
                    break;
                }
                case 81: {
                    this.keys['q'] = true;
                    break;
                }
                case 69: {
                    this.keys['e'] = true;
                    break;
                }
            }
        }
    };
    FlockSystem.prototype.handleKeyUp = function (keyCode, keyChar) {
        if (this.smartGoose) {
            switch (keyCode) {
                case 87: {
                    this.keys['w'] = false;
                    break;
                }
                case 65: {
                    this.keys['a'] = false;
                    break;
                }
                case 83: {
                    this.keys['s'] = false;
                    break;
                }
                case 68: {
                    this.keys['d'] = false;
                    break;
                }
                case 81: {
                    this.keys['q'] = false;
                    break;
                }
                case 69: {
                    this.keys['e'] = false;
                    break;
                }
            }
        }
    };
    return FlockSystem;
})(ParticleSystem);
/*
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
 // Avoidance Force
 partialForce.add( normal.clone().multiplyScalar( this.avoidanceConstant * -1).divideScalar( distance ));
 // Centering Force
 partialForce.add( normal.multiplyScalar(distance * this.centeringConstant) );
 // Velocity Matching
 partialForce.add( temp.subVectors( velocityJ , velocityI).multiplyScalar(this.velocityMatchConstant));
 force.add(partialForce.multiplyScalar(weight));
 }
 else {
 weight *= this.sigmoid(distance * distance * distance);
 // Avoidance Force
 partialForce.add( normal.clone().multiplyScalar( this.avoidanceConstant * -1).divideScalar( distance ));
 // Centering Force
 partialForce.add( normal.multiplyScalar(distance * this.centeringConstant) );
 // Velocity Matching
 partialForce.add( temp.subVectors( velocityJ , velocityI).multiplyScalar(this.velocityMatchConstant));

 force.add(partialForce.multiplyScalar(weight));
 }
 }
    */ 
//# sourceMappingURL=FlockSystem.js.map