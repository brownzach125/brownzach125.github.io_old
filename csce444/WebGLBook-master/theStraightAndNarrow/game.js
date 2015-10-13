// Constructor
Game = function() {
    Sim.App.call(this);
}

// Subclass Sim.App
Game.prototype = new Sim.App();

// Our custom initializer
Game.prototype.init = function(param) {
    // Call superclass init code to set up scene, renderer, default camera
    Sim.App.prototype.init.call(this, param);

    param = param || {};
    this.param = param;

    this.hud = param.hud;
    this.sounds = param.sounds;

    this.createEnvironment();

    this.curTime = Date.now();
    this.deltat = 0;

    this.running = false;
    this.state = Game.STATE_LOADING;

    // Make sure the Game has keyboard focus
    this.focus();

    this.addContextListener();
}

Game.prototype.createEnvironment = function() {
    this.environment = new Environment();
    this.environment.init(
        {app:this,
         textureGround:true
        }
    );
    this.addObject(this.environment);
}

Game.prototype.addContextListener = function() {
    var that = this;
    this.renderer.domElement.addEventListener("webglcontextlost",
        function(e) {
            that.handleContextLost(e);
        },
        false);
}
