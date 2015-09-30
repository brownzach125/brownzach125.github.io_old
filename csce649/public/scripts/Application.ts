/// <reference path= './Simulation2.ts' />
/// <reference path= './Object2.ts' />
'use strict'

class Application {
    //simulation : Simulation2;
    simulation;
    constructor(container) {
        this.simulation = new Simulation2(container);
        this.addMouseHandler();
        this.addKeyBoardHandler();
            }
    start() {
        this.run(this);
    }
    run(that) {
        that.simulation.simulate();
        requestAnimationFrame(function() {
            that.run(that);
        });
    }
    addMouseHandler() {
        //var dom = renderer.domElement;
        //dom.addEventListener( 'mouseup', onMouseUp, false);
    }
    addKeyBoardHandler() {
        //document.addEventListener('keydown', function(event) {
        //simulation.keyPress(event.keyCode);
    }
}

class ParticleSystemApp extends Application {
    constructor(container , document) {
        super(container);
        var particleSystem = new ParticleSystem(document);
        this.simulation.addObject(particleSystem);

        //var triangle = new TrianglePolygon();
        //this.simulation.addObject(triangle);
        var square = new SquarePolygon();
        square.rotateX(90);
        this.simulation.addObject(square);
    }
}
