function PosArea(pos, width, height) {
    this.position = pos;

    this.width = width;
    this.height = height;
}

PosArea.prototype.getTopBounds = function() {
    return this.position.y;
};

PosArea.prototype.getBottomBounds = function() {
    return this.position.y + this.height;
};

PosArea.prototype.getLeftBounds = function() {
    return this.position.x;
};

PosArea.prototype.getRightBounds = function() {
    return this.position.x + this.width;
};