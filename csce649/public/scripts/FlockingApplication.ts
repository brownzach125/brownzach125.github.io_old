/// <reference path= './Application.ts' />
/// <reference path= './FlockSystem.ts' />
'use strict'

class FlockingApplication extends Application {
    cameraControls;
    gooseSystem: FlockSystem;
    constructor(){
        super();
    }
    init(params) {
        super.init(params);

        var light = new THREE.DirectionalLight(0xFFFFFF , 1);
        this.scene.add(light);
        this.cameraControls = new THREE.TrackballControls( this.camera, this.renderer.domElement );

        var thing = new Collidable();
        this.gooseSystem = new FlockSystem();
        params.collidables = [ thing ];
        this.gooseSystem.init(params);
        this.addObject(this.gooseSystem);
        this.addObject(thing);
        var axes = this.buildAxes(10);
        this.scene.add(axes);
    }

    buildAxes( length ) {
        var axes = new THREE.Object3D();

        axes.add( this.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( this.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( this.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( this.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( this.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( this.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        return axes;

    }
    buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat;

        if(dashed) {
            mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
            mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LineSegments );

        return axis;

    }
    update(delta? ,  timestep?) {
        super.update(delta , timestep);
        this.cameraControls.update(delta);
    }

    handleKeyDown(keyCode, charCode) {
        //if (this.player) {
        //    this.player.handleKeyDown(keyCode, charCode);
        //}
        if ( this.gooseSystem ){
            this.gooseSystem.handleKeyDown(keyCode , charCode);
        }
    }

    handleKeyUp (keyCode, charCode) {
        //if (this.player) {
        //    this.player.handleKeyUp(keyCode, charCode);
        //}
        if ( this.gooseSystem ){
            this.gooseSystem.handleKeyUp(keyCode , charCode);
        }
    }


}