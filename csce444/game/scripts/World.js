var TILE_LENGTH = 64;


// Tile enum
var ROAD_TILE =1;
var IRON_ROAD_TILE = 255;
var BLACK_TILE = 2;

function World() {
    this.tiles = {};
    this.tiles[ROAD_TILE]      = ResourceManager.loadImage("./images/tiles/IronPath_0.png");
    this.tiles[IRON_ROAD_TILE] = ResourceManager.loadImage("./images/tiles/IronPath_1.png");
    this.tiles[BLACK_TILE]     = ResourceManager.loadImage("./images/tiles/BlackTile.png");

    this.worldMap    = ResourceManager.loadImage("./images/tiles/TileMap.png");

    this.position = {
        x : 0,
        y : -50
    };
    this.map = [];
}

World.prototype.init = function() {
    this.WorldWidth  = this.worldMap.width;
    this.WorldHeight = this.worldMap.height;
    this.viewScreenWidth =  Math.floor(CAMERA_NATIVE_WIDTH / TILE_LENGTH);
    this.viewScreenHeight = Math.floor(CAMERA_NATIVE_HEIGHT / TILE_LENGTH);
    Camera.context.drawImage(this.worldMap , 0,0, this.worldMap.width , this.worldMap.height);
    var pixels = Camera.context.getImageData( 0 , 0 , this.worldMap.width , this.worldMap.height);
    for ( var i =0; i < pixels.data.length/4; i++) {
        //this.map.push( pixels.data[i*4]);

        var type = pixels.data[i*4];
        var r = i / this.WorldWidth;
        var c = i % this.WorldWidth;
        var obj;
        var pos = { x: c * TILE_LENGTH + TILE_LENGTH/2 , y: r * TILE_LENGTH + TILE_LENGTH /2};
        switch( type ) {
            case IRON_ROAD_TILE:{
                obj = { type: type , obj: new IronRod(pos)};
                break;
            }
            default: {
                obj = { type: type , obj: { position: pos}};
                break;
            }
        }
        //this.map[r , c] = obj;
        this.map.push(obj);
    }
}


World.prototype.getDrawables = function() {

}

World.prototype.draw = function() {
    if ( this.map.length == 0)
        return;

    var rows = this.viewScreenHeight + 5;
    var cols = this.viewScreenWidth + 5;
    var startRow = Math.floor(player.position.y / TILE_LENGTH) - Math.floor(this.viewScreenHeight /2);
    var offsetR = player.position.y % TILE_LENGTH;
    var offsetC = player.position.x % TILE_LENGTH;
    var startCol = Math.floor(player.position.x / TILE_LENGTH) - Math.floor(this.viewScreenWidth  /2);
    var count =0;
    for ( var r = 0; r < rows; r++ ) {
        for ( var c = 0; c < cols; c++) {
            var index;

            if ( r + startRow < 0 || c + startCol < 0){
                index  =-1;
            }
            else {
                index = (r + startRow) * this.WorldWidth + (c + startCol);
            }

            /*
            var img;
            var type;
            var obj = this.map[(r + startRow) , (c+startCol)];
            if ( obj ) {
                type = obj.type;
            }
            else {
                type = BLACK_TILE;
            }
            */

            if ( index >=0 && index < this.map.length) {
                img = this.tiles[this.map[index].type];
            } else {
                img = this.tiles[BLACK_TILE];
            }

            //img = this.tiles[type];
            Camera.drawImage(img, c * TILE_LENGTH - offsetC, r * TILE_LENGTH - offsetR , TILE_LENGTH, TILE_LENGTH);
            count++;
        }

    }
    //console.log("Count " + count);

};

World.prototype.nearByObjects = function(pos , radius) {

    var tileC = Math.round(pos.x / TILE_LENGTH);
    var tileR = Math.round(pos.y / TILE_LENGTH);
    radius = Math.floor(radius / TILE_LENGTH) + 1;
    // TODO kinda hacky
    var possible = [];
    for ( var r = tileR - radius; r < tileR + radius; r++) {
        for ( var c = tileC - radius; c < tileC + radius; c++) {
            var index = r  * this.WorldWidth + c;
            var obj = this.map[index];
            var type = undefined;
            if ( obj )
                type = obj.type;
            switch (type) {
                case IRON_ROAD_TILE: {
                    possible.push(obj.obj);
                    break;
                }
                case undefined: {

                }

            }
        }
    }
    return possible;
}

ROD_OFFSET_TOP    = -2 *  TILE_LENGTH/4;
ROD_OFFSET_BOTTOM =       TILE_LENGTH/8;
ROD_OFFSET_RIGHT  =       TILE_LENGTH/4;
ROD_OFFSET_LEFT   = -1 *  TILE_LENGTH/4;

IronRod = function(pos) {
    this.position = pos;
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