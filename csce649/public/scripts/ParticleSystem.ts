/// <reference path="./Object2.ts" />
'use strict'

class ParticleSystem extends Object2 {
    state;
    statePrime: THREE.Vector3[];
    clock: THREE.Clock;
    defaultTimestep:number = .01;
    particleCount: number;
    ready;
    constructor() {
        super();
        this.state = [];
        this.statePrime = [];
        this.clock = null;
        this.particleCount = 0;
        this.ready = false;
    }
    update(delta?: number , timestep? :number) {
        if ( !this.ready )
            return;
        if ( !timestep && !delta ){
            if ( !this.clock)
                this.clock = new THREE.Clock();
            delta = this.clock.getDelta();
            timestep = this.defaultTimestep;
        }
        for ( var i =0; i < delta; i+= timestep) {
            // state = state = delta * state derivative
            this.integrate( this.state , this.F(this.state , this.statePrime) , timestep );
        }
        this.updateChildren();
    }
    updateChildren() {
        for ( var i =0; i < this.particleCount; i++ ) {
            this.children[i].object3D.position.copy(this.state[i]);
            this.children[i].velocity.copy(this.state[i + this.particleCount]);
            this.children[i].acceleration.copy(this.statePrime[i + this.particleCount]);
            this.children[i].update();
        }
    }
    F(state: THREE.Vector3[], statePrime: THREE.Vector3[] ) {
        for ( var i = 0; i < this.particleCount; i++ ) {
            // Set Velocites
            statePrime[i].copy(state[i + this.particleCount]);
            // Initilize Acclerations to 0
            if ( statePrime[i+this.particleCount]) {
                statePrime[i + this.particleCount ].set(0,0,0);
            }
            else {
                statePrime[i + this.particleCount] = new THREE.Vector3(0,0,0);
            }
        }
        // Loop over points apply vertex forces
        for ( var i=0; i < this.particleCount; i++) {
            statePrime[i + this.particleCount] = this.vertexForce(i);
        }
        // Loop over edges apply spring forces
        // Loop over faces apply face forces
        // Return derivative
        return statePrime;
    }
    integrate( state: THREE.Vector3[], statePrime: THREE.Vector3[] , timestep: number){
        for ( var i = 0; i < statePrime.length; i++ ){
            if (statePrime[i] instanceof THREE.Vector3) {
                state[i].add(statePrime[i].multiplyScalar(timestep));
            }
            else {
                console.log("Some kind of error i is " + i);
            }

        }
    }

    vertexForce( particleIndex: number ){
        return new THREE.Vector3(0,0,0);
    }
}