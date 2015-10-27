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
    this.health = 3;
    this.dead = false;

    this.vector = Math.PI/2;

    this.velocity = 0;

    this.lightPosition = {
        x: 0,
        y: 0
    };

    this.facing = "right";

    this.attacking = false;
    this.preppingAttack = false;

    this.prepTime = 200;
    this.attackTime = 200;
    this.attackResetTime = 100;

    this.prepStartTime = 0;
    this.attackStartTime = 0;
    this.attackEndTime = 0;

    // images
    this.playerImageLeft  = ResourceManager.loadImage('./images/player/CharacterLeft.png');
    this.playerImageRight = ResourceManager.loadImage('./images/player/CharacterRight.png');
    this.playerImageUp    = ResourceManager.loadImage('./images/player/CharacterUp.png');
    this.playerImageDown    = ResourceManager.loadImage('./images/player/CharacterDown.png');
}

Player.prototype.update = function() {
    if(this.dead)
        return;

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


    //aconsole.log(this.vector);
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

    //update light position
    var ldx = this.lightPosition.x - this.position.x;
    var ldy = this.lightPosition.y - this.position.y;

    this.lightPosition.x -= ldx * 0.035;
    this.lightPosition.y -= ldy * 0.035;

};

Player.prototype.attemptAttack = function() {
    if(this.canAttack() && !this.attacking && !this.preppingAttack)
        this.prepAttack();
};

Player.prototype.canAttack = function() {
    if( Util.getTime() > this.attackEndTime + this.attackResetTime)
        return true;

    return false;
};

Player.prototype.prepAttack = function() {
    this.preppingAttack = true;
    this.prepStartTime = Util.getTime();
};

Player.prototype.isAttackReady = function() {
    if( Util.getTime() > this.prepStartTime + this.prepTime)
        return true;

    return false;
};

Player.prototype.attack = function() {
    this.preppingAttack = false;

    this.attacking = true;

    this.attackStartTime = Util.getTime();

    var attackPos = {};

    if(this.facing == "left") {
        attackPos.x = this.position.x - 13 + 0;
        attackPos.y = this.position.y - 0 + 15;
    }
    else
    {
        attackPos.x = this.position.x - 1 + 16;
        attackPos.y = this.position.y - 0 + 15;
    }

    this.attackArea = new PosArea(attackPos, 15, 11);

    // check for hit
    var hit = false;
    for(var i = 0; i < BaddieManager.baddies.length; i++)
    {
        var baddie = BaddieManager.baddies[i];
        if(intersectsZ(this, baddie, 8)) {
            if(intersects(this.attackArea, baddie.getHitBox())) {
                // apply damage
                baddie.loseHealth(1);
                hit = true;
            }
        }
    }

    if(hit) {
        // play hit SOUND
        this.hitSound.play();
    }
    else
    {
        // play miss sound
        this.missSound.play();
    }

};

Player.prototype.isAttackFinished = function() {
    if( Util.getTime() > this.attackStartTime + this.attackTime)
        return true;

    return false;
};

Player.prototype.resetAttack = function() {
    this.attacking = false;
    this.attackArea = null;
    this.attackEndTime = Util.getTime();
};

Player.prototype.loseHealth = function(dmg) {
    this.health -= dmg;

    if(this.health == 0)
        this.die();
};

Player.prototype.die = function() {
    this.dead = true;
    gameState = "over";
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

    // guy
    /*
    if(this.attacking)
    {
        if(this.facing == "left")
            Camera.drawImage(this.attack_left, this.position.x-13, this.position.y, 31, 40);
        else if(this.facing == "right")
            Camera.drawImage(this.attack_right, this.position.x-1, this.position.y, 31, 40);
    }
    else if(this.preppingAttack)
    {
        if(this.facing == "left")
            Camera.drawImage(this.prep_left, this.position.x-1, this.position.y, 35, 40);
        else if(this.facing == "right")
            Camera.drawImage(this.prep_right, this.position.x-17, this.position.y, 35, 40);
    }
    else
    {
        if(this.facing == "left")
            Camera.drawImage(this.guyLeft, this.position.x, this.position.y, 17, 40);
        else if(this.facing == "right")
            Camera.drawImage(this.guyRight, this.position.x, this.position.y, 17, 40);
    }
*/

    if(DEBUG)
    {
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

        Camera.drawLineWorldPos("purple", this.getLeftBounds(), this.getTopBounds(), this.getRightBounds(), this.getTopBounds());
        Camera.drawLineWorldPos("purple", this.getRightBounds(), this.getTopBounds(), this.getRightBounds(), this.getBottomBounds());
        Camera.drawLineWorldPos("purple", this.getRightBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getBottomBounds());
        Camera.drawLineWorldPos("purple", this.getLeftBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getTopBounds());

        var box = this.getHitBox();
        Camera.drawLineWorldPos("blue", box.getLeftBounds(), box.getTopBounds(), box.getRightBounds(), box.getTopBounds());
        Camera.drawLineWorldPos("blue", box.getRightBounds(), box.getTopBounds(), box.getRightBounds(), box.getBottomBounds());
        Camera.drawLineWorldPos("blue", box.getRightBounds(), box.getBottomBounds(), box.getLeftBounds(), box.getBottomBounds());
        Camera.drawLineWorldPos("blue", box.getLeftBounds(), box.getBottomBounds(), box.getLeftBounds(), box.getTopBounds());


    }
};

Player.prototype.drawEffects = function()  {
    //attacl swoosh
    if(this.attacking) {
        if(this.facing == "left")
            Camera.drawImage(this.swoosh_left, this.position.x-13, this.position.y, 31, 40);
        else if(this.facing == "right")
            Camera.drawImage(this.swoosh_right, this.position.x-1, this.position.y, 31, 40);
    }

    if(DEBUG && this.attackArea) {
        Camera.drawLineWorldPos("red", this.attackArea.getLeftBounds(), this.attackArea.getTopBounds(), this.attackArea.getRightBounds(), this.attackArea.getTopBounds());
        Camera.drawLineWorldPos("red", this.attackArea.getRightBounds(), this.attackArea.getTopBounds(), this.attackArea.getRightBounds(), this.attackArea.getBottomBounds());
        Camera.drawLineWorldPos("red", this.attackArea.getRightBounds(), this.attackArea.getBottomBounds(), this.attackArea.getLeftBounds(), this.attackArea.getBottomBounds());
        Camera.drawLineWorldPos("red", this.attackArea.getLeftBounds(), this.attackArea.getBottomBounds(), this.attackArea.getLeftBounds(), this.attackArea.getTopBounds());
    }
};

Player.prototype.drawLight = function() {
    
    //guy light
    //Camera.drawImage(this.lightImage, this.lightPosition.x - 480+9, this.lightPosition.y -270+16 , 960, 540);
    Camera.drawImage(this.lightImage,  - 480+240, -270+135 , 960, 540);
    if(this.dead) {
        Camera.drawImage(this.deathLightImage, -480 + this.position.x + 6, -270 + this.position.y + 36, 960, 540);
    }
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