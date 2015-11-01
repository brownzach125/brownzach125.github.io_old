var PLAYER_SPEED = 2;
var PLAYER_ACCEL = 0.5;
var PLAYER_SPEED_FRICTION = 0.4;

var PLAYER_LENGTH = TILE_LENGTH * 5;
var DEFAULT_GUY_OFFSET_RIGHT  = PLAYER_LENGTH *   .1;
var DEFAULT_GUY_OFFSET_LEFT   = PLAYER_LENGTH  * -.2;
var DEFAULT_GUY_OFFSET_TOP    = PLAYER_LENGTH  * -.3;
var DEFAULT_GUY_OFFSET_BOTTOM = PLAYER_LENGTH  *  .2;

var PLAYER_TURN_SPEED = 10;

function Player() {
    this.position = {
        x: 60,
        y: 0
    };

    this.canSin = true;
    this.lightLevel = 0;
    this.onRoad = true;

    this.vector = Math.PI/2;
    this.velocity = 0;
    this.lightPosition = {
        x: 0,
        y: 0
    };
    this.count = 0;
    this.facing = "right";
    // images
    this.playerImageLeft    = ResourceManager.loadImage('./images/player/CharacterLeft.png');
    this.playerImageRight   = ResourceManager.loadImage('./images/player/CharacterRight.png');
    this.playerImageUp      = ResourceManager.loadImage('./images/player/CharacterUp.png');
    this.playerImageDown    = ResourceManager.loadImage('./images/player/CharacterDown.png');

    // sounds
    this.commitSinSound     = ResourceManager.loadSound('./sounds/CommitSin.mp3');
    this.onPathMusic        = ResourceManager.loadSound('./sounds/OnThePath.mp3');


    // Overlays
    this.roadOverLay            = ResourceManager.loadImage("./images/overlays/RoadOverLay.png");
    this.offRoadOverLays = [];
    this.overlay = 0;
    this.offRoadOverLays[0]        = ResourceManager.loadImage("./images/overlays/OffRoadOverLay1.png");
    this.offRoadOverLays[1]        = ResourceManager.loadImage("./images/overlays/OffRoadOverLay2.png");
    this.offRoadOverLays[2]        = ResourceManager.loadImage("./images/overlays/OffRoadOverLay3.png");
    this.offRoadOverLays[3]        = ResourceManager.loadImage("./images/overlays/OffRoadOverLay4.png");
    this.blankOverLay              = ResourceManager.loadImage("./images/overlays/BlankOverLay.png");

}


Player.prototype.init = function() {
    this.onPathMusic.play();
    this.onPathMusic.volume = .05;
    this.commitSinSound.volume = .05;

    this.offRoadData  = getImageData(this.offRoadOverLays[0]);
    this.onRoadData   = getImageData(this.roadOverLay);
    this.blankData = getImageData(this.blankOverLay);
}

Player.prototype.update = function() {
    var moving = false;

    var vX = 0;
    var vY = 0;

    if(KeyHandler.up) {
        vY -= 1;
        moving = true;
    }

    if(KeyHandler.down) {
        vY += 1;
        moving = true;
    }

    if(KeyHandler.left) {
        vX -= 1;
        moving = true;
    }

    if(KeyHandler.right) {
        vX += 1;
        moving = true;
    }
    
    // if attacking
    if(this.attacking) {
        if(this.isAttackFinished())
            this.resetAttack();
    }

    // else if preparing to attack
    else if(this.preppingAttack) {
        if(this.isAttackReady())
            this.attack();

        // keep prepping that attack bro
        this.vector = Math.atan2(vX, vY);
    }

    else if(moving) {
        this.velocity += PLAYER_ACCEL;
        this.vector = Math.atan2(vX, vY);
    }

    var newPos = {
        x: this.position.x + Math.sin(this.vector ) *  this.velocity,
        y: this.position.y + Math.cos(this.vector ) *  this.velocity
    };

    this.pathChangeHandler( this.position , newPos );

    if(canBeAt({x: newPos.x, y: this.position.y}, this)) {
        this.position.x = newPos.x;
    }
    else { // try to move a smaller amount
        newPos.x = this.position.x + Math.sin(this.vector ) * this.velocity / 2;
        if(canBeAt({x: newPos.x, y: this.position.y}, this))
            this.position.x = newPos.x;
    }

    if(canBeAt({x: this.position.x, y: newPos.y}, this)) {
        this.position.y = newPos.y;
    }
    else { // try to move a smaller amount
        newPos.y = this.position.y + Math.cos(this.vector ) *  this.velocity / 2;
        if(canBeAt({x: this.position.x, y: newPos.y}, this))
            this.position.y = newPos.y;
    }

    this.velocity -= this.velocity * PLAYER_SPEED_FRICTION;
    // Update camera center
    Camera.center = { x: this.position.x - CAMERA_NATIVE_WIDTH/2 , y: this.position.y - CAMERA_NATIVE_HEIGHT/2}

    //update facing
    if(this.vector > 0 && this.vector < Math.PI)
        this.facing = "right";
    else if(this.vector < 0)
        this.facing = "left";
    if ( this.vector == Math.PI) {
        this.facing = "up";
    }
    if ( this.vector == 0) {
        this.facing = "down";
    }
};

Player.prototype.getHitBox = function() {
    var pos = {};
    var hitBoxWidth  = PLAYER_LENGTH * .2;
    var hitBoxHeight = PLAYER_LENGTH * .5;
    pos.x = this.position.x - .5 * hitBoxWidth - 4;
    pos.y = this.position.y - .5 * hitBoxHeight -4;

    var w = hitBoxWidth;
    var h = hitBoxHeight;
    return new PosArea(pos, w, h);
};

Player.prototype.draw = function() {

    if(this.dead) {
        //Camera.drawImage(this.deadImage, this.position.x - 11, this.position.y + 21, 35, 30);
        return;
    }

    //guy shadow
    //Camera.drawImage(this.shadowImage, this.position.x - 3, this.position.y + 33, 21, 12);
    var img;
    if ( this.facing == 'left') {
        img = this.playerImageLeft;
    }
    else if( this.facing == 'right') {
        img = this.playerImageRight;
    } else if( this.facing =='up') {
        img = this.playerImageUp;
    } else {
        img = this.playerImageDown;
    }
    Camera.drawImageWorldPos(img , this.position.x -.5 * PLAYER_LENGTH , this.position.y -.5 * PLAYER_LENGTH , PLAYER_LENGTH , PLAYER_LENGTH);
    if(DEBUG) {
        var dx = this.position.x +  9 - Math.sin(this.vector ) * this.velocity * 8;
        var dy = this.position.y + 16 - Math.cos(this.vector ) * this.velocity * 8;

        Camera.drawLineWorldPos("blue", this.position.x + 9, this.position.y + 16, dx, dy);

        var vx = this.position.x +  9 + Math.sin(this.vector ) * 6;
        var vy = this.position.y + 16 + Math.cos(this.vector ) * 6;

        Camera.drawLineWorldPos("green", this.position.x + 9, this.position.y + 16, vx, vy);

        var fx = this.position.x +  9 + 3;
        if(this.facing == "left")
            fx = this.position.x +  9 - 3;

        var fy = this.position.y + 16 ;

        Camera.drawLineWorldPos("yellow", this.position.x + 9, this.position.y + 16, fx, fy);

        DrawBoundingBox(this , "purple");

        var box = this.getHitBox();

        DrawBoundingBox(box , "blue");
    }
};

Player.prototype.onTheStraightAndNarrow = function(pos) {
    var distance = Math.abs(pos.y - world.roadPosition.y);
    if ( distance < 65 ) {
        return true;
    } else {
        return false;
    }
};

Player.prototype.offRoad = function(pos) {
    var distance = Math.abs(pos.y - world.roadPosition.y);
    if ( distance > 200 ) {
        return true;
    } else {
        return false;
    }
};

Player.prototype.commitSin = function() {
    if ( this.lightLevel == this.offRoadOverLays.length - 1)
        return
    if ( this.canSin ) {
        this.lightLevel = (this.lightLevel + 1) % this.offRoadOverLays.length;
        this.commitSinSound.play();
        this.canSin = false;
        var that = this;
        setTimeout( function() {
            that.canSin = true;
        } ,
        1000);
    }
};

Player.prototype.pathChangeHandler = function(oldPos , newPos) {
    if ( !this.offRoad(oldPos) && this.offRoad(newPos) ) {
        // Going off road
        console.log("Going off road");
        this.onPathMusic.volume = 0;
        this.onRoad = false;

        offRoadEvent();
        return;
    }

    if ( this.onTheStraightAndNarrow(oldPos) && !this.onTheStraightAndNarrow(newPos)) {
        offStraightAndNarrow();
        return;
    }

    if ( !this.onRoad && this.onTheStraightAndNarrow(newPos) ) {
        backOnRoadEvent();
        // Got back on straight and narrow
        console.log("Back on the narrow");
        this.onPathMusic.volume = .05;
        this.onRoad = true;
        this.lightLevel = 0;
        return;
    }
};

Player.prototype.drawLight = function() {
    if ( !world.roadPosition)
        return;

        if ( this.count % 5 == 0) {
            this.blendImages(this.onRoadData, this.offRoadData, this.blankData, this.blankOverLay.width, this.blankOverLay.height);
        }
        this.count++;
        Camera.drawImageSmooth(this.blankOverLay , 0 , 0 , CAMERA_NATIVE_WIDTH , CAMERA_NATIVE_HEIGHT);
};

Player.prototype.blendImages = function(img1 , img2, newImage , width , height) {
    var canvas  = document.getElementById('blendCanvas');
    var context = canvas.getContext('2d');

    if ( Math.abs(roadPosY) > 300)
        return;
    var roadPosY = Math.floor(player.position.y - world.roadPosition.y);

    var pos = 0;

    var max = 640 * 400;
    for ( var r = 0; r < 400; r++ ) {
        for ( var c = 0; c < 640; c++) {
            var indexSelfLight = (r * 640 + c);
            var roadLight      = ((r + roadPosY)  * 640 + c);
            if ( roadLight < 0 || roadLight > (max)) {
                indexSelfLight *= 4;
                for ( var p = 0; p < 4; p++) {
                    newImage.data[indexSelfLight + p] = img2.data[indexSelfLight + p];
                }
            }
            else {
                roadLight *=4;
                indexSelfLight *=4;
                for ( var p = 0; p < 4; p++) {
                    newImage.data[indexSelfLight + p] = Math.min( img1.data[roadLight + p] , img2.data[indexSelfLight +p]);
                }
            }
        }
    }
    context.clearRect(0,0,640,400);
    context.putImageData(newImage , 0 ,0);
    this.blankOverLay.src = canvas.toDataURL();
};

function getImageData(img) {
    var canvas  = document.getElementById('blendCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0,0, 640 , 400);
    context.drawImage(img,  0,0 , 640 , 400 );
    var data = context.getImageData(0,0 , 640 , 400);
    return data;
}

function offStraightAndNarrow() {
    var sassyMessage = "There is nothing out there... Come back or perish"
    ToggleWordBlock(sassyMessage);
    PAUSE = true;
}

function offRoadEvent() {
    if ( player.fallen)
        return;
    console.log("Off road event");
    var sassyMessage = "You have fallen.";
    player.fallen = true;
    ToggleWordBlock(sassyMessage);
    PAUSE = true;
}

function backOnRoadEvent() {
    player.fallen = false;
    console.log("Cant wait to get on the road again");
    var sassyMessage = "It is so nice to see you again.";
    ToggleWordBlock(sassyMessage);
    PAUSE = true;
}



Player.prototype.getTopBounds = function() {
    return this.position.y + DEFAULT_GUY_OFFSET_TOP;
};

Player.prototype.getBottomBounds = function() {
    return this.position.y + DEFAULT_GUY_OFFSET_BOTTOM;
};

Player.prototype.getLeftBounds = function() {
    return this.position.x + DEFAULT_GUY_OFFSET_LEFT;
};

Player.prototype.getRightBounds = function() {
    return this.position.x + DEFAULT_GUY_OFFSET_RIGHT;
};

Player.prototype.getTopBoundsFromPos = function(pos) {
    return pos.y + DEFAULT_GUY_OFFSET_TOP;
};

Player.prototype.getBottomBoundsFromPos = function(pos) {
    return pos.y + DEFAULT_GUY_OFFSET_BOTTOM;
};

Player.prototype.getLeftBoundsFromPos = function(pos) {
    return pos.x + DEFAULT_GUY_OFFSET_LEFT;
};

Player.prototype.getRightBoundsFromPos = function(pos) {
    return pos.x + DEFAULT_GUY_OFFSET_RIGHT;
};