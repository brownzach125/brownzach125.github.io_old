var LOOP_DELAY = 16;
var DEBUG = false;
var EMBED = false;
var PAUSE = false;

var player;
var world;

function loadGame() {
    player = new Player();
    world  = new World();
    attemptToStartGame();
}

function attemptToStartGame() {
    if (!ResourceManager.isGameLoaded()) {
        setTimeout(attemptToStartGame , 10);
    }
    else {
        setupGame();
    }
}

function setupGame() {
    // init Camera
    Camera.init();

    // init World
    world.init();

    // set up handlers
    // set resize handler
    window.onresize = resizeHandler;
    window.onkeydown = KeyHandler.onKeyDown;
    window.onkeyup = KeyHandler.onKeyUp;

    gameState = "menu";

    // start game loop
    console.log("starting game loop");
    setInterval(gameLoop, LOOP_DELAY);

}

function resizeHandler(event) {
    Camera.bestFitCamera();
}

function gameLoop() {
    // TODO
    player.update();
    redraw();
}

function redraw() {

    // draw background
    //arena.drawGround();
    world.drawTerrain();
    // draw bottom floor objects
    //for(var i = 0; i < BaddieManager.corpses.length; i++)
    //{
    //    BaddieManager.corpses[i].draw();
    //}

    // put all the drawables together
    var drawables = getAllDrawables();

    drawables.sort(function(a, b) {
        return a.position.y - b.position.y;
    });

    for(var i = 0; i < drawables.length; i++) {
        drawables[i].draw();
    }

    // draw effects
    for(var i = 0; i < drawables.length; i++) {
        if(drawables[i].drawEffects)
            drawables[i].drawEffects();
    }

    // draw player Light effect
    //player.drawLight();
    //HUD.draw();
}

function getAllDrawables() {
    var drawables = [];

    //for(var i = 0; i < BaddieManager.baddies.length; i++)
    //{
    //    drawables.push(BaddieManager.baddies[i]);
    //}
    //drawables.push(world.getDrawables());
    //drawables.push(world);
    var worldObjects = world.getDrawables();
    drawables = drawables.concat( worldObjects );
    drawables.push(player);

    return drawables;
}

function canBeAt(pos, obj) {

    var nearByObjects = world.nearByObjects(pos , TILE_LENGTH * 2);
    if ( nearByObjects.length != 0) {
    }
    for ( var i =0; i < nearByObjects.length; i++) {
        if ( nearByObjects[i] != obj) {
            if (intersects(pos , obj , nearByObjects[i])) {
                return false;
            }
        }
    }

    /*
    // check map objects

    // check baddie objects
    for(var i = 0; i < BaddieManager.corpses.length; i++)
    {
        if(BaddieManager.corpses[i] != obj)
            if(intersectsNew(pos, obj, BaddieManager.corpses[i]))
                return false;
    }

    // check baddies
    for(var i = 0; i < BaddieManager.baddies.length; i++)
    {
        if(BaddieManager.baddies[i] != obj)
            if(intersectsNew(pos, obj, BaddieManager.baddies[i]))
                return false;
    }

    // check player
    if(player != obj)
        if(intersectsNew(pos, obj, player))
            return false;

    return true;
    */
    return true;
};

function intersects(pos, obj, staticObj) {

    if(obj.getRightBoundsFromPos(pos) <= staticObj.getLeftBounds()) {
        return false;
    }

    if(obj.getLeftBoundsFromPos(pos) >= staticObj.getRightBounds()) {
        return false;
    }

    if(obj.getBottomBoundsFromPos(pos) <= staticObj.getTopBounds()) {
        return false;
    }

    if(obj.getTopBoundsFromPos(pos) >= staticObj.getBottomBounds()) {
        return false;
    }

    return true;
}