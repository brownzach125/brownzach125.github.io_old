var LOOP_DELAY = 16;
var DEBUG = false;
var EMBED = false;
var PAUSE = false;

var player;
var world;

function loadGame() {
    world  = new World();
    player = new Player();
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

    player.init();

    // set up handlers
    // set resize handler
    window.onresize = resizeHandler;
    window.onkeydown = KeyHandler.onKeyDown;
    window.onkeyup = KeyHandler.onKeyUp;

    gameState = "pan";

    // start game loop
    console.log("starting game loop");
    ToggleWordBlock("Get to the tree of life");
    setInterval(gameLoop, LOOP_DELAY);

}

function resizeHandler(event) {
    Camera.bestFitCamera();
}

var pan_rate = 1;

function gameLoop() {

    if (gameState == 'pan') {
        Camera.center.x -= pan_rate;
        if (  Camera.center.x - player.position.x < -1 * CAMERA_NATIVE_WIDTH /2 ) {
            gameState = 'on';
        }
        pan_rate+= .1;
    } else if ( gameState == 'on') {
        if (!PAUSE) {
            world.update();
            player.update();
        }
    }
    // Detect end game
    var distance = Math.abs(world.tree.position.x - player.position.x);
    if ( distance < 5) {
        ToggleWordBlock("You have achieved everlasting life");
        gameState == 'over'
    }
    else {
        redraw();
    }
}

function redraw() {

    // draw background
    world.drawTerrain();

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
    player.drawLight();
    //HUD.draw();
}

function getAllDrawables() {
    var drawables = [];
    var worldObjects = world.getDrawables();
    drawables = drawables.concat( worldObjects );
    drawables.push(player);
    return drawables;
}

function canBeAt(pos, obj) {

    var nearByObjects = world.nearByObjects(pos , TILE_LENGTH * 3);
    for ( var i =0; i < nearByObjects.length; i++) {
        if ( nearByObjects[i] != obj) {
            if (intersects(pos , obj , nearByObjects[i])) {
                return false;
            }
        }
    }

    var monsters = world.getMonsters();
    for ( var i =0; i < monsters.length; i++) {
        if ( monsters[i] != obj ) {
            if ( intersects(pos , obj , monsters[i])) {
                return false;
            }
        }
    }

    if ( player !=obj ) {
        if ( intersects(pos , obj , player))
            return false;
    }
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
function intersectsZ(obj, staticObj, zTolerance) {

    if(Math.abs(obj.position.y - staticObj.position.y) > zTolerance)
        return false;

    return true;
}
