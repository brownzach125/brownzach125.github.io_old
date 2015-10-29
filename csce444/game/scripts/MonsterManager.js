// MonsterType Enum
var TYPE_ONE = 255;

function MonsterManager() {
    this.monsterImage = ResourceManager.loadImage('./images/monsters/JellyFish.png');
    this.monsters = [];
};

MonsterManager.prototype.init = function() {

};

MonsterManager.prototype.updateAll = function() {
    for ( var i =0; i < this.monsters.length; i++) {
        this.monsters[i].update();
    }
};

MonsterManager.prototype.getMonstersOnScreen = function() {
    var viewInfo = Camera.getViewScreenInfo();
    var visibleMonsters = [];
    for ( var i = 0; i < this.monsters.length; i++) {
        if ( this.monsters[i].onScreen(viewInfo)) {
            visibleMonsters.push(this.monsters[i]);
        }
    }
    return visibleMonsters;
};

MonsterManager.prototype.addMonster= function(pos , type) {
    this.monsters.push( new Monster(pos , type , this.monsterImage))
};



MONSTER_HEIGHT = TILE_LENGTH *  1.5;
MONSTER_WIDTH  = TILE_LENGTH *  1.5;
MONSTER_OFFSET_TOP =    MONSTER_HEIGHT * -.45;
MONSTER_OFFSET_BOTTOM = MONSTER_HEIGHT *  .2;
MONSTER_OFFSET_RIGHT =  MONSTER_WIDTH  * .3;
MONSTER_OFFSET_LEFT =   MONSTER_WIDTH  * -.5;

function Monster(pos , type , img) {
    this.position = {};
    this.position.x = pos.x;
    this.position.y = pos.y;
    this.img = img;
    this.type = type;
    this.vector = 0;
    this.range  = 400;
    this.count = 0;
    this.velocity = 5;
}

Monster.prototype.draw = function() {
    Camera.drawImageWorldPos(this.img , this.position.x -.7 * MONSTER_WIDTH , this.position.y -.5 * MONSTER_HEIGHT , MONSTER_WIDTH , MONSTER_HEIGHT);
    if ( DEBUG) {
        Camera.drawLineWorldPos("purple", this.getLeftBounds(), this.getTopBounds(), this.getRightBounds(), this.getTopBounds());
        Camera.drawLineWorldPos("purple", this.getRightBounds(), this.getTopBounds(), this.getRightBounds(), this.getBottomBounds());
        Camera.drawLineWorldPos("purple", this.getRightBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getBottomBounds());
        Camera.drawLineWorldPos("purple", this.getLeftBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getTopBounds());
    }
};

Monster.prototype.update = function() {
    var newPos = {
        x: this.position.x + Math.sin(this.vector ) *  this.velocity,
        y: this.position.y + Math.cos(this.vector ) *  this.velocity
    };

    this.count+= Math.abs(this.velocity);
    if ( this.count == this.range ) {
        this.count %= this.range;
        this.velocity *= -1;
    }

    this.position.x = newPos.x;
    this.position.y = newPos.y;

    if ( intersects( this.position , this , player)) {
        console.log("Ive sinned");
        player.commitSin();
    }

};

Monster.prototype.onScreen = function(viewInfo){
    return true;
};

Monster.prototype.getTopBounds = function() {
    return this.position.y + MONSTER_OFFSET_TOP;
};

Monster.prototype.getBottomBounds = function() {
    return this.position.y + MONSTER_OFFSET_BOTTOM;
};

Monster.prototype.getLeftBounds = function() {
    return this.position.x + MONSTER_OFFSET_LEFT;
};

Monster.prototype.getRightBounds = function() {
    return this.position.x + MONSTER_OFFSET_RIGHT;
};

Monster.prototype.getTopBoundsFromPos = function(pos) {
    return pos.y + MONSTER_OFFSET_TOP;
};

Monster.prototype.getBottomBoundsFromPos = function(pos) {
    return pos.y + MONSTER_OFFSET_BOTTOM;
};

Monster.prototype.getLeftBoundsFromPos = function(pos) {
    return pos.x + MONSTER_OFFSET_LEFT;
};

Monster.prototype.getRightBoundsFromPos = function(pos) {
    return pos.x + MONSTER_OFFSET_RIGHT;
};
