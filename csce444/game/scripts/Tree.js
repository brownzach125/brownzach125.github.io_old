TREE_LENGTH = 100;
var PLAYER_TURN_SPEED = 10;

function Tree(img) {
    this.position = {
        x: 0,
        y: 0
    };
    this.img = img;
}

Tree.prototype.init = function() {

};


Tree.prototype.draw = function() {

    Camera.drawImageWorldPos(this.img , this.position.x -.5 * TREE_LENGTH , this.position.y -.5 * TREE_LENGTH , TREE_LENGTH,TREE_LENGTH);
    if(DEBUG) {
        DrawBoundingBox(this , "purple");
    }
};

Tree.prototype.getTopBounds = function() {
    return this.position.y + DEFAULT_GUY_OFFSET_TOP;
};

Tree.prototype.getBottomBounds = function() {
    return this.position.y + DEFAULT_GUY_OFFSET_BOTTOM;
};

Tree.prototype.getLeftBounds = function() {
    return this.position.x + DEFAULT_GUY_OFFSET_LEFT;
};

Tree.prototype.getRightBounds = function() {
    return this.position.x + DEFAULT_GUY_OFFSET_RIGHT;
};

Tree.prototype.getTopBoundsFromPos = function(pos) {
    return pos.y + DEFAULT_GUY_OFFSET_TOP;
};

Tree.prototype.getBottomBoundsFromPos = function(pos) {
    return pos.y + DEFAULT_GUY_OFFSET_BOTTOM;
};

Tree.prototype.getLeftBoundsFromPos = function(pos) {
    return pos.x + DEFAULT_GUY_OFFSET_LEFT;
};

Tree.prototype.getRightBoundsFromPos = function(pos) {
    return pos.x + DEFAULT_GUY_OFFSET_RIGHT;
};