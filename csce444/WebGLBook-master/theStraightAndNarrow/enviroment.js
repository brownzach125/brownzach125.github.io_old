// Constructor
Environment = function() {
    Sim.Object.call(this);
}

// Subclass Sim.App
Environment.prototype = new Sim.Object();

// Our custom initializer
Environment.prototype.init = function(param) {
    // Call superclass init code to set up scene, renderer, default camera
    Sim.Object.prototype.init.call(this, param);

    param = param || {};

    var app = param.app;
    if (!app)
        return;

    //this.textureSky = param.textureSky;
    this.textureGround = param.textureGround;
    //this.textureFinishLine = param.textureFinishLine;
    //this.displaySigns = param.displaySigns;

    // Create a headlight to show off the model
    this.headlight = new THREE.DirectionalLight( 0xffffff, 1);
    this.headlight.position.set(0, 0, 1);
    app.scene.add(this.headlight);

    this.toplight = new THREE.DirectionalLight( 0xffffff, 1);
    this.toplight.position.set(0, 1, 0);
    app.scene.add(this.toplight);

    this.ambient = new THREE.AmbientLight( 0xffffff, 1);
    app.scene.add(this.ambient);

    this.app = app;
    //this.createSky();
    this.createRoad();
    //this.createGround();
    //this.createGuardRails();
    //this.createFinishLine();
    //if (this.displaySigns) {
    //    this.createSigns();
    //}
    this.curTime = Date.now();
}

Environment.prototype.createGround = function() {
    var texture = null;
    // Sand texture
    if (this.textureGround) {
        texture = THREE.ImageUtils.loadTexture('../images/Sand_002.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
    }
    else {
        texture = null;
    }
    var ground = new THREE.Mesh( new THREE.PlaneGeometry( Environment.GROUND_WIDTH,
                                                          Environment.GROUND_LENGTH ),
                                 new THREE.MeshBasicMaterial(
                                    { color: this.textureGround ? 0xffffff : 0xaaaaaa, ambient: 0x333333, map:texture }
                                 )
    );
    ground.rotation.x = -Math.PI/2;
    ground.position.y = -.02 + Environment.GROUND_Y;
    this.app.scene.add( ground );
    this.ground = ground;
}

Environment.prototype.createRoad = function() {
    var texture = null;
    // Road texture by Arenshi
    // http://www.turbosquid.com/Search/Artists/Arenshi
    // http://www.turbosquid.com/FullPreview/Index.cfm/ID/414729
    var texture = THREE.ImageUtils.loadTexture('../images/road-rotated.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 40);

    var road = new THREE.Mesh( new THREE.PlaneGeometry( Environment.ROAD_WIDTH, Environment.ROAD_LENGTH * 2),
                               new THREE.MeshBasicMaterial( { color: 0xaaaaaa, shininess:100, ambient: 0x333333, map:texture } )
    );
    road.rotation.x = -Math.PI/2;
    road.position.y = 0 + Environment.GROUND_Y;
    this.app.scene.add( road );
    this.road = road;
}

Environment.prototype.createGuardRails = function() {
    var texture = null;
    var texture = THREE.ImageUtils.loadTexture('../images/Guard_Rail-rotated.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 40);

    var leftrail = new THREE.Mesh( new THREE.PlaneGeometry( Environment.RAIL_WIDTH,
            Environment.RAIL_LENGTH * 2),
        new THREE.MeshBasicMaterial(
            { color: 0xaaaaaa, shininess:100, ambient: 0x333333, map:texture }
        )
    );
    leftrail.rotation.x = -Math.PI/2;
    leftrail.rotation.y = Math.PI/2;
    leftrail.position.x = -Environment.ROAD_WIDTH / 2;
    leftrail.position.y = .5 + Environment.GROUND_Y;

    this.app.scene.add( leftrail );
    this.leftrail = leftrail;

    var rightrail = new THREE.Mesh( new THREE.PlaneGeometry( Environment.RAIL_WIDTH,
            Environment.RAIL_LENGTH * 2),
        new THREE.MeshBasicMaterial(
            { color: 0xaaaaaa, shininess:100, ambient: 0x333333, map:texture }
        )
    );
    rightrail.rotation.x = -Math.PI/2;
    rightrail.rotation.y = -Math.PI/2;
    rightrail.position.x = Environment.ROAD_WIDTH / 2;
    rightrail.position.y = .5 + Environment.GROUND_Y;

    this.app.scene.add( rightrail );
    this.rightrail = rightrail;

}

Environment.prototype.createSky = function() {
    var texture = null;

    // Clouds by moodflow
    // http://www.turbosquid.com/Search/Artists/moodflow
    // http://www.turbosquid.com/FullPreview/Index.cfm/ID/433395		
    if (this.textureSky) {
        texture = THREE.ImageUtils.loadTexture('../images/clouds1273.jpg');
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(1, 1);
    }
    else
    {
        texture = null;
    }

    var sky = new THREE.Mesh( new THREE.PlaneGeometry( Environment.SKY_WIDTH,
            Environment.SKY_HEIGHT ),
        new THREE.MeshBasicMaterial(
            { color: this.textureSky ? 0xffffff : 0x3fafdd, map:texture }
        )
    );
    sky.position.y = 100 + Environment.GROUND_Y;
    sky.position.z = -Environment.GROUND_LENGTH / 2;
    this.app.scene.add( sky );
    this.sky = sky;
}

Environment.prototype.update = function() {
    if (this.textureSky) {
        this.sky.material.map.offset.x += 0.00005;
    }

    if (this.app.running)
    {
        var now = Date.now();
        var deltat = now - this.curTime;
        this.curTime = now;

        dist = -deltat / 1000 * this.app.player.speed;
        this.road.material.map.offset.y += (dist * Environment.ANIMATE_ROAD_FACTOR);
    }

    Sim.Object.prototype.update.call(this);
}

Environment.SKY_WIDTH = 3000;
Environment.SKY_HEIGHT = 200;
Environment.GROUND_Y = -10;
Environment.GROUND_WIDTH = 2000;
Environment.GROUND_LENGTH = 800;
Environment.ROAD_WIDTH = 8;
Environment.ROAD_LENGTH = 400;
Environment.RAIL_WIDTH = .2;
Environment.RAIL_LENGTH = Environment.ROAD_LENGTH;
Environment.ANIMATE_ROAD_FACTOR = 2;
Environment.FINISH_SIGN_WIDTH = 4.333;
Environment.FINISH_SIGN_HEIGHT = 1;
Environment.FINISH_SIGN_Y = 2.22;
Environment.NUM_SIGNS = 8;
Environment.SIGN_SCALE = .5;