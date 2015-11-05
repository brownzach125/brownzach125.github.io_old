/// <reference path= './Application.ts' />
/// <reference path= './SpringyMeshSystem.ts' />
/// <reference path= './Polygon.ts' />
'use strict'

class SpringMeshApplication extends Application {
    cameraControls;
    constructor(){
        super();
    }
    init(params) {
        super.init(params);
        this.params = params;
        var light = new THREE.DirectionalLight(0xFFFFFF , 1);
        this.scene.add(light);

        var axes = this.buildAxes(10);

        var system = new SpringyMeshSystem();
        system.init(params);
        this.addObject(system);

        var polygon = new SquarePolygon(10 , 0xFF0000 , new THREE.Vector3(0,-10,0) );
        polygon.rotateX(0);

        this.addObject(polygon);
        this.scene.add(axes);
    }

    update(delta? ,  timestep?) {
        super.update(delta , timestep);
        this.cameraControls.update(delta);
    }

    handleKeyDown(keyCode, charCode) {
        //if ( this.gooseSystem ){
        //    this.gooseSystem.handleKeyDown(keyCode , charCode);
        //}
    }

    handleKeyUp (keyCode, charCode) {

    }
}