/// <reference path="./Object2.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleSystem = (function (_super) {
    __extends(ParticleSystem, _super);
    function ParticleSystem() {
        _super.call(this);
        this.defaultTimestep = .01;
        this.state = [];
        this.statePrime = [];
        this.clock = null;
        this.particleCount = 0;
        this.ready = false;
    }
    ParticleSystem.prototype.update = function (delta, timestep) {
        if (!this.ready)
            return;
        if (!timestep && !delta) {
            if (!this.clock)
                this.clock = new THREE.Clock();
            delta = this.clock.getDelta();
            timestep = this.defaultTimestep;
        }
        for (var i = 0; i < delta; i += timestep) {
            // state = state = delta * state derivative
            this.integrate(this.state, this.F(this.state, this.statePrime), timestep);
        }
        this.updateChildren();
    };
    ParticleSystem.prototype.updateChildren = function () {
        for (var i = 0; i < this.particleCount; i++) {
            this.children[i].object3D.position.copy(this.state[i]);
            this.children[i].velocity.copy(this.state[i + this.particleCount]);
            this.children[i].acceleration.copy(this.statePrime[i + this.particleCount]);
            this.children[i].update();
        }
    };
    ParticleSystem.prototype.F = function (state, statePrime) {
        for (var i = 0; i < this.particleCount; i++) {
            // Set Velocites
            statePrime[i].copy(state[i + this.particleCount]);
            // Initilize Acclerations to 0
            if (statePrime[i + this.particleCount]) {
                statePrime[i + this.particleCount].set(0, 0, 0);
            }
            else {
                statePrime[i + this.particleCount] = new THREE.Vector3(0, 0, 0);
            }
        }
        // Loop over points apply vertex forces
        for (var i = 0; i < this.particleCount; i++) {
            statePrime[i + this.particleCount] = this.vertexForce(i);
        }
        // Loop over edges apply spring forces
        // Loop over faces apply face forces
        // Return derivative
        return statePrime;
    };
    ParticleSystem.prototype.integrate = function (state, statePrime, timestep) {
        for (var i = 0; i < statePrime.length; i++) {
            if (statePrime[i] instanceof THREE.Vector3) {
                state[i].add(statePrime[i].multiplyScalar(timestep));
            }
            else {
                console.log("Some kind of error i is " + i);
            }
        }
    };
    ParticleSystem.prototype.vertexForce = function (particleIndex) {
        return new THREE.Vector3(0, 0, 0);
    };
    return ParticleSystem;
})(Object2);
//# sourceMappingURL=ParticleSystem.js.map