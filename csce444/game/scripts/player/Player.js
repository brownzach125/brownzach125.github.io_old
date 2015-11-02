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
    this.offRoadOverLays[4]        = ResourceManager.loadImage("./images/overlays/OffRoadOverLay5.png");
    this.blankOverLay              = ResourceManager.loadImage("./images/overlays/BlankOverLay.png");

}


Player.prototype.init = function() {
    this.onPathMusic.play();
    this.onPathMusic.volume = .05;
    this.commitSinSound.volume = .05;

    this.offRoadDatas = [];
    this.offRoadDatas[0]  = Util.getImageData(this.offRoadOverLays[0]);
    this.offRoadDatas[1]  = Util.getImageData(this.offRoadOverLays[1]);
    this.offRoadDatas[2]  = Util.getImageData(this.offRoadOverLays[2]);
    this.offRoadDatas[3]  = Util.getImageData(this.offRoadOverLays[3]);
    this.offRoadDatas[4]  = Util.getImageData(this.offRoadOverLays[4]);
    this.onRoadData   = Util.getImageData(this.roadOverLay);
    this.blankData = Util.getImageData(this.blankOverLay);
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

    if(moving) {
        this.velocity += PLAYER_ACCEL;
        this.vector = Math.atan2(vX, vY);
    }

    var newPos = {
        x: this.position.x + Math.sin(this.vector ) *  this.velocity,
        y: this.position.y + Math.cos(this.vector ) *  this.velocity
    };


    var oldPos = {};
    oldPos.x = this.position.x;
    oldPos.y = this.position.y;
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

    this.pathChangeHandler( oldPos , newPos );

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



Part = {};
Part.straightAndNarrow = 0;
Part.road = 1;
Part.aroundRoad = 2;
Part.offRoad = 3;

Player.prototype.onPart = function(part , pos) {
    var distance = Math.abs( pos.y - world.roadPosition.y );
    switch (part) {
        case Part.straightAndNarrow:{
            if (distance < 15) {
              return true;
            }
            break;
        }
        case Part.road: {
          if ( distance >=15 &&  distance < 62 ) {
              return true;
          }
          break;
        }
        case Part.aroundRoad: {
            if ( distance >= 62 && distance < 200 ) {
                return true;
            }
            break;
        }
        case Part.offRoad: {
            if ( distance >= 200 ) {
                return true;
            }
            break;
        }
    }
    return false;
};

Player.prototype.pathChangeHandler = function(oldPos , newPos) {
    // Off straight and narrow
    if ( this.onPart( Part.straightAndNarrow , oldPos ) &&  !this.onPart( Part.straightAndNarrow , newPos ) ) {
        this.roadEvent(RoadEvent.offStraight);
        console.log("Got off straight and narrow");
    }
    // Off road
    if ( this.onPart( Part.road , oldPos ) &&  !this.onPart( Part.road , newPos ) && !this.onPart( Part.straightAndNarrow , newPos)) {
        this.roadEvent(RoadEvent.offRoad);
        console.log("Got off road");
    }
    // Off around road
    if ( this.onPart( Part.aroundRoad , oldPos ) &&  !this.onPart( Part.aroundRoad , newPos ) && !this.onPart( Part.road , newPos)) {
        this.roadEvent(RoadEvent.offAroundRoad);
        console.log("Got off aroundroad");
    }

    // Back around road
    if ( this.onPart( Part.offRoad , oldPos ) &&  !this.onPart( Part.offRoad , newPos )) {
        this.roadEvent(RoadEvent.onAroundRoad);
        console.log("Got on aroundroad");
    }
    // Back on road
    if ( this.onPart( Part.aroundRoad , oldPos ) &&  this.onPart( Part.road , newPos )) {
        this.roadEvent(RoadEvent.onRoad);
        console.log("Got on road");
    }
    // Back on straiht and narrow
    if ( this.onPart( Part.road , oldPos ) &&  this.onPart( Part.straightAndNarrow , newPos )) {
        this.roadEvent(RoadEvent.onStraight);
        console.log("Got on straight and narrow");
    }
};
RoadEvent = {};
RoadEvent.offStraight = 0;
RoadEvent.offRoad = 1;
RoadEvent.offAroundRoad = 2;
RoadEvent.onAroundRoad = 3;
RoadEvent.onRoad = 4;
RoadEvent.onStraight = 5;
Player.prototype.roadEvent = function( event ) {
    switch (event ) {
        case RoadEvent.onStraight: {
            this.lightLevel = 0;
            if ( this.beenFarOut ) {
                var message = "You have found the one true light again.";
                ToggleWordBlock(message);
                this.beenFarOut = false;
            }
            break;
        }
        case RoadEvent.offRoad: {
            console.log("Off Road Event");
            var message = "There is nothing out there... Come back or perish";
            ToggleWordBlock(message);
            break;
        }
        case RoadEvent.offAroundRoad: {
            var message = "You are alone.";
            ToggleWordBlock(message);
            this.beenFarOut = true;
            break;
        }
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

Player.prototype.drawLight = function() {
    if ( !world.roadPosition)
        return;

        if ( this.count % 5 == 0) {
            this.blendImages(this.onRoadData, this.offRoadDatas[this.lightLevel], this.blankData);
        }
        this.count++;
        Camera.drawImageSmooth(this.blankOverLay , 0 , 0 , CAMERA_NATIVE_WIDTH , CAMERA_NATIVE_HEIGHT);
};

Player.prototype.blendImages = function(img1 , img2, newImage) {
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