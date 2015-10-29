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




function DrawBoundingBox(obj , color) {
    Camera.drawLineWorldPos(color, obj.getLeftBounds(), obj.getTopBounds(), obj.getRightBounds(), obj.getTopBounds());
    Camera.drawLineWorldPos(color, obj.getRightBounds(), obj.getTopBounds(), obj.getRightBounds(), obj.getBottomBounds());
    Camera.drawLineWorldPos(color, obj.getRightBounds(), obj.getBottomBounds(), obj.getLeftBounds(), obj.getBottomBounds());
    Camera.drawLineWorldPos(color, obj.getLeftBounds(), obj.getBottomBounds(), obj.getLeftBounds(), obj.getTopBounds());
};