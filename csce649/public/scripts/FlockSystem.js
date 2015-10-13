/// <reference path="./ParticleSystem.ts" />
/// <reference path="./jsonModel.ts" />
/// <reference path="./Goose.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    }
    FlockSystem.prototype.update = function (delta, timestep) {
        // Update the smart goose
        // Let the particle system parent handle the rest
        _super.prototype.update.call(this, delta, timestep);
    };
    FlockSystem.prototype.init = function (params) {
        var that = this;
        if (params.advoidanceSlider) {
            params.advoidanceSlider.setCallback(function (value) {
                that.avoidanceConstant = value;
                that.getApp().focus();
            });
        }
        if (params.velocitySlider) {
            params.velocitySlider.setCallback(function (value) {
                that.velocityMatchConstant = value;
                that.getApp().focus();
            });
        }
        if (params.centeringSlider) {
            params.centeringSlider.setCallback(function (value) {
                that.centeringConstant = value;
                that.getApp().focus();
            });
        }
    };
    FlockSystem.prototype.sigmoid = function (t) {
        return 1 / (1 + Math.pow(Math.E, -t));
    };
    FlockSystem.prototype.vertexForce = function (boidIndex) {
        if (boidIndex == this.smartGooseIndex) {
            return new THREE.Vector3(0, 0, 0);
        }
        var positionI = this.children[boidIndex].object3D.position;
        var positionJ = new THREE.Vector3(0, 0, 0);
        var velocityI = this.children[boidIndex].velocity;
        var velocityJ = new THREE.Vector3(0, 0, 0);
        var normal = new THREE.Vector3(0, 0, 0);
        var force = new THREE.Vector3(0, 0, 0);
        for (var j = 0; j < this.children.length; j++) {
            if (j == boidIndex) {
                continue;
            }
            var partialForce = new THREE.Vector3(0, 0, 0);
            var temp = new THREE.Vector3(0, 0, 0);
            positionJ = this.children[j].object3D.position;
            normal.subVectors(positionJ, positionI).normalize();
            var distance = positionI.distanceTo(positionJ);
            velocityJ = this.children[j].velocity;
            var weight = 1;
            if (j == this.smartGooseIndex) {
            }
            else {
                weight *= this.sigmoid(distance * distance * distance);
            }
            // Avoidance Force
            partialForce.add(normal.clone().multiplyScalar(this.avoidanceConstant * -1).divideScalar(distance));
            // Centering Force
            partialForce.add(normal.multiplyScalar(distance * this.centeringConstant));
            // Velocity Matching
            partialForce.add(temp.subVectors(velocityJ, velocityI).multiplyScalar(this.velocityMatchConstant));
            if (j != this.smartGooseIndex) {
                partialForce.divideScalar(100);
            }
            force.add(partialForce.multiplyScalar(weight));
        }
        return force;
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
            this.state.push(new THREE.Vector3(0, 0, 0));
            // this.state.push( new THREE.Vector3(Math.random() * 5 - 2 ,Math.random() *5 -2, Math.random() * 5 -2));
            this.statePrime.push(new THREE.Vector3(0, 0, 0));
        }
        for (var i = 0; i < amount; i++) {
            this.state.push(new THREE.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5));
            this.statePrime.push(new THREE.Vector3(0, 0, 0));
        }
        this.state[0 + this.particleCount].set(0, 0, 0);
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
//# sourceMappingURL=FlockSystem.js.map