var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleSystemApp = (function (_super) {
    __extends(ParticleSystemApp, _super);
    function ParticleSystemApp(container, document) {
        _super.call(this, container);
        //var triangle = new TrianglePolygon();
        //this.simulation.addObject(triangle);
        var square = new SquarePolygon(50, 0xFFFFFF, new THREE.Vector3(0, 0, 0), 90);
        var hitSquare = new SquarePolygon(10, 0xFF02C1, new THREE.Vector3(0, 5, 4), -45);
        var hitSquare2 = new SquarePolygon(10, 0xFF02C1, new THREE.Vector3(0, 5, -4), 45);
        var hitSquare3 = new SquarePolygon(5, 0xFF02C1, new THREE.Vector3(0, 2, 0), 90, 0);
        //var hitSquare4 = new SquarePolygon(10 , 0xFF02C1 , new THREE.Vector3(-10, 5 ,0) , -45);
        //var hitSquare3 = new SquarePolygon(10 , 0xFF02C1 , new THREE.Vector3(0, 5 ,7) , -45);
        //var hitSquare4 = new SquarePolygon(10 , 0xFF02C1 , new THREE.Vector3(0, 5 ,-7) , 45);
        //var hitSquare5 = new SquarePolygon(10 , 0XFF02C1, new THREE.Vector3(4,5,0) , 0 , 90);
        //var hitSquare6 = new SquarePolygon(10 , 0XFF02C1, new THREE.Vector3(-4,5,0) , 0 , 90);
        this.simulation.addObject(square);
        this.simulation.addObject(hitSquare);
        this.simulation.addObject(hitSquare2);
        this.simulation.addObject(hitSquare3);
        //this.simulation.addObject(hitSquare4);
        //this.simulation.addObject(hitSquare5);
        //this.simulation.addObject(hitSquare6);
        var particleSystem = new ParticleSystem(document, new Array(square, hitSquare, hitSquare2, hitSquare3));
        this.simulation.addObject(particleSystem);
    }
    return ParticleSystemApp;
})(Application);
//# sourceMappingURL=ParticleSystemApp.js.map