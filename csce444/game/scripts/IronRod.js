ROD_WIDTH  = TILE_LENGTH;
ROD_HEIGHT = TILE_LENGTH * 2;
ROD_OFFSET_TOP    =       1 * ROD_HEIGHT/2 - ROD_HEIGHT/8;
ROD_OFFSET_BOTTOM =       -.7 * ROD_HEIGHT;
ROD_OFFSET_RIGHT  =       ROD_WIDTH/2;
ROD_OFFSET_LEFT   = -1 *  ROD_WIDTH/2;

IronRod = function(pos , img) {
    this.position = pos;
    this.img = img;
};

IronRod.prototype.draw = function() {
    Camera.drawImageWorldPos( this.img , this.position.x - ROD_WIDTH/2 , this.position.y  - ROD_HEIGHT/2 , ROD_WIDTH , ROD_HEIGHT);
    if ( DEBUG) {
        Camera.drawLineWorldPos("purple", this.getLeftBounds(), this.getTopBounds(), this.getRightBounds(), this.getTopBounds());
        Camera.drawLineWorldPos("purple", this.getRightBounds(), this.getTopBounds(), this.getRightBounds(), this.getBottomBounds());
        Camera.drawLineWorldPos("purple", this.getRightBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getBottomBounds());
        Camera.drawLineWorldPos("purple", this.getLeftBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getTopBounds());
    }
};

IronRod.prototype.getTopBounds = function() {
    return this.position.y + ROD_OFFSET_TOP;
};

IronRod.prototype.getBottomBounds = function() {
    return this.position.y + ROD_OFFSET_BOTTOM;
};

IronRod.prototype.getLeftBounds = function() {
    return this.position.x + ROD_OFFSET_LEFT;
};

IronRod.prototype.getRightBounds = function() {
    return this.position.x + ROD_OFFSET_RIGHT;
};

IronRod.prototype.getTopBoundsFromPos = function(pos) {
    return pos.y + ROD_OFFSET_TOP;
};

IronRod.prototype.getBottomBoundsFromPos = function(pos) {
    return pos.y + ROD_OFFSET_BOTTOM;
};

IronRod.prototype.getLeftBoundsFromPos = function(pos) {
    return pos.x + ROD_OFFSET_LEFT;
};

IronRod.prototype.getRightBoundsFromPos = function(pos) {
    return pos.x + ROD_OFFSET_RIGHT;
};