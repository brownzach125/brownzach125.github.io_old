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
        this.monsters.update();
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
}

function Monster(pos , type , img) {
    this.position = pos;
    this.img = img;
    this.type = type;
}

Monster.prototype.draw = function() {
    Camera.drawImageWorldPos(this.img , this.position.x , this.position.y , 50 , 50);
};

Monster.prototype.update = function() {

};

Monster.prototype.onScreen = function(viewInfo){
    return true;
};
