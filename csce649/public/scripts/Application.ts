/// <reference path= './Object2.ts' />
'use strict'
class Application {
    clock: THREE.Clock;
    container;
    renderer;
    scene;
    camera;
    root;
    projector;
    clickedObject;
    overObject;
    objects: Object2[];
    constructor() {
        this.clock = new THREE.Clock();
    }

    init(param) {
        param = param || {};
        var container = param.container;
        var canvas = param.canvas;

        // Create the Three.js renderer, add it to our div
        var renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild( renderer.domElement );
        renderer.setClearColor( 0x7EC0EE, 1 );
        // Create a new Three.js scene
        var scene = new THREE.Scene();
        scene.add( new THREE.AmbientLight( 0x505050 ) );
        scene.data = this;

        // Put in a camera at a good default location
        var camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 10000 );
        camera.position.set( 0, 0, 10 );
        camera.lookAt(new THREE.Vector3(0,0,0));

        scene.add(camera);

        // Create a root object to contain all other scene objects
        var root = new THREE.Object3D();
        scene.add(root);

        // Create a projector to handle picking
        //var projector = new THREE.Projector();

        // Save away a few things
        this.container = container;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.root = root;
        this.objects = [];

        // Set up event handlers
        this.initMouse();
        this.initKeyboard();
        this.addDomHandlers();
    }
    addObject(obj) {
        this.objects.push(obj);
        // If this is a renderable object, add it to the root scene
        if (obj.object3D) {
            this.root.add(obj.object3D);
        }
    }
    run() {
        var delta = this.clock.getDelta();
        this.update(delta ,.01);
        this.renderer.render( this.scene, this.camera );
        var that = this;
        requestAnimationFrame(function() { that.run();});
    }

    update(delta? , timestep?) {
        var i, len;
        len = this.objects.length;
        for (i = 0; i < len; i++) {
            this.objects[i].update(delta , timestep);
        }
    }

    focus() {
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.focus();
        }
    }

    initMouse() {
        var dom = this.renderer.domElement;

        var that = this;
        dom.addEventListener( 'mousemove',
            function(e) { that.onDocumentMouseMove(e); }, false );
        dom.addEventListener( 'mousedown',
            function(e) { that.onDocumentMouseDown(e); }, false );
        dom.addEventListener( 'mouseup',
            function(e) { that.onDocumentMouseUp(e); }, false );

        dom.addEventListener("mousewheel", function(e, delta) {that.onDocumentMouseScroll(e, delta);} , false);
        /*
        $(dom).mousewheel(
            function(e, delta) {
                that.onDocumentMouseScroll(e, delta);
            }
        );
        */
        this.overObject = null;
        this.clickedObject = null;
    }

    onDocumentMouseMove(event) {
        event.preventDefault();

        if (this.clickedObject && this.clickedObject.handleMouseMove)
        {
            var hitpoint = null, hitnormal = null;
            var intersected = this.objectFromMouse(event.pageX, event.pageY);
            if (intersected.object == this.clickedObject)
            {
                hitpoint = intersected.point;
                hitnormal = intersected.normal;
            }
            this.clickedObject.handleMouseMove(event.pageX, event.pageY, hitpoint, hitnormal);
        }
        else {
            var handled = false;

            var oldObj = this.overObject;
            var intersected = this.objectFromMouse(event.pageX, event.pageY);
            this.overObject = intersected.object;

            if (this.overObject != oldObj) {
                if (oldObj) {
                    this.container.style.cursor = 'auto';

                    if (oldObj.handleMouseOut) {
                        oldObj.handleMouseOut(event.pageX, event.pageY);
                    }
                }

                if (this.overObject) {
                    if (this.overObject.overCursor) {
                        this.container.style.cursor = this.overObject.overCursor;
                    }

                    if (this.overObject.handleMouseOver) {
                        this.overObject.handleMouseOver(event.pageX, event.pageY);
                    }
                }

                handled = true;
            }

            if (!handled && this.handleMouseMove)
            {
                this.handleMouseMove(event.pageX, event.pageY);
            }
        }
    }

    onDocumentMouseDown(event) {
        event.preventDefault();

        var handled = false;

        var intersected = this.objectFromMouse(event.pageX, event.pageY);
        if (intersected.object)
        {
            if (intersected.object.handleMouseDown)
            {
                intersected.object.handleMouseDown(event.pageX, event.pageY, intersected.point, intersected.normal);
                this.clickedObject = intersected.object;
                handled = true;
            }
        }

        if (!handled && this.handleMouseDown) {
            this.handleMouseDown(event.pageX, event.pageY);
        }
    }

    onDocumentMouseUp(event) {
        event.preventDefault();

        var handled = false;

        var intersected = this.objectFromMouse(event.pageX, event.pageY);
        if (intersected.object)
        {
            if (intersected.object.handleMouseUp)
            {
                intersected.object.handleMouseUp(event.pageX, event.pageY, intersected.point, intersected.normal);
                handled = true;
            }
        }

        if (!handled && this.handleMouseUp)
        {
            this.handleMouseUp(event.pageX, event.pageY);
        }

        this.clickedObject = null;
    }
    onDocumentMouseScroll(event , delta ){
        event.preventDefault();

        if (this.handleMouseScroll)
        {
            this.handleMouseScroll(delta);
        }
    }

    handleMouseMove(x , y) {
        // THINK Virtual
    }
    handleMouseDown( x , y) {
        // THINK Virtual
    }

    handleMouseUp( x, y) {
        // THINK Virtual
    }

    handleMouseScroll(delta) {
        // THINK Virtual
    }

    objectFromMouse( pagex , pagey ) {
        // Translate page coords to element coords
        var eltx = pagex - this.renderer.domElement.offsetLeft;
        var elty = pagey - this.renderer.domElement.offsetTop;

        // Translate client coords into viewport x,y
        var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
        var vpy = - ( elty / this.container.offsetHeight ) * 2 + 1;

        var vector = new THREE.Vector3( vpx, vpy, 0.5 );

        vector.unproject( this.camera );

        var ray = new THREE.Ray( this.camera.position, vector.sub( this.camera.position ).normalize() );
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera( new THREE.Vector2(  pagex , pagey ) , this.camera);
        //var intersects = ray.intersectObject( this.scene  , true); // uuhhhh
        var intersects = raycaster.intersectObject( this.scene );
        if ( intersects.length > 0 ) {
            var i = 0;
            while(!intersects[i].object.visible) {
                i++;
            }

            var intersected = intersects[i];
            var mat = new THREE.Matrix4().getInverse(intersected.object.matrixWorld);
            var point = mat.applyToVector3Array([ intersected.point.x , intersected.point.y , intersected.point.z]);

            return (this.findObjectFromIntersected(intersected.object, intersected.point, intersected.face.normal));
        }
        else {
            return { object : null, point : null, normal : null };
        }
    }

    initKeyboard() {
        var dom = this.renderer.domElement;

        var that = this;
        dom.addEventListener( 'keydown',
            function(e) { that.onKeyDown(e); }, false );
        dom.addEventListener( 'keyup',
            function(e) { that.onKeyUp(e); }, false );
        dom.addEventListener( 'keypress',
            function(e) { that.onKeyPress(e); }, false );

        // so it can take focus
        dom.setAttribute("tabindex", 1);
        dom.style.outline='none';
    }
    onKeyDown(event) {
        // N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
        event.preventDefault();
        if (this.handleKeyDown) {
            this.handleKeyDown(event.keyCode, event.charCode);
        }
    }
    onKeyUp(event) {
        // N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
        event.preventDefault();

        if (this.handleKeyUp)
        {
            this.handleKeyUp(event.keyCode, event.charCode);
        }
    }
    onKeyPress(event) {
        // N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
        event.preventDefault();

        if (this.handleKeyPress)
        {
            this.handleKeyPress(event.keyCode, event.charCode);
        }
    }
    handleKeyDown( keyCode , charCode) {
    }
    handleKeyUp( keyCode , charCode) {
    }
    handleKeyPress( keyCode , charCode) {
    }

    addDomHandlers() {
        var that = this;
        window.addEventListener( 'resize', function(event) { that.onWindowResize(event); }, false );
    }
    onWindowResize(event) {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
    }
    findObjectFromIntersected(object , point , normal) {
        if (object.data) {
            return { object: object.data, point: point, normal: normal };
        }
        else if (object.parent) {
            return this.findObjectFromIntersected(object.parent, point, normal);
        }
        else {
            return { object : null, point : null, normal : null };
        }
    }
}
