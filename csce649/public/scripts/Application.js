/// <reference path= './Simulation2.ts' />
/// <reference path= './Object2.ts' />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Application = (function () {
    function Application(container) {
        this.simulation = new Simulation2(container);
        this.addMouseHandler();
        this.addKeyBoardHandler();
    }
    Application.prototype.start = function () {
        this.run(this);
    };
    Application.prototype.run = function (that) {
        that.simulation.simulate();
        requestAnimationFrame(function () {
            that.run(that);
        });
    };
    Application.prototype.addMouseHandler = function () {
        //var dom = renderer.domElement;
        //dom.addEventListener( 'mouseup', onMouseUp, false);
    };
    Application.prototype.addKeyBoardHandler = function () {
        //document.addEventListener('keydown', function(event) {
        //simulation.keyPress(event.keyCode);
    };
    return Application;
})();
var ParticleSystemApp = (function (_super) {
    __extends(ParticleSystemApp, _super);
    function ParticleSystemApp(container, document) {
        _super.call(this, container);
        var particleSystem = new ParticleSystem(document);
        this.simulation.addObject(particleSystem);
        //var triangle = new TrianglePolygon();
        //this.simulation.addObject(triangle);
        var square = new SquarePolygon();
        square.rotateX(90);
        this.simulation.addObject(square);
    }
    return ParticleSystemApp;
})(Application);
//# sourceMappingURL=Application.js.map