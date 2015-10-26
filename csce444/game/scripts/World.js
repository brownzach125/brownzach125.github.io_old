var WorldWidth = 60;
var WorldHeight = 34;
var TILE_LENGTH = 16;

var ROAD_TILE =1;
var IRON_ROAD_TILE = 255;
var BLACK_TILE = -1;

var viewScreenWidth  = 30;
var viewScreenHeight = 17;

function World() {
    this.tiles = {};
    this.tiles[ROAD_TILE]      = ResourceManager.loadImage("./images/tiles/IronPath_0.png");
    this.tiles[IRON_ROAD_TILE] = ResourceManager.loadImage("./images/tiles/IronPath_1.png");
    this.tiles[BLACK_TILE] = ResourceManager.loadImage("./images/tiles/BlackTile.png");

    this.worldMap    = ResourceManager.loadImage("./images/tiles/TileMap.png");

    this.position = {
        x : 0,
        y : -50
    };
    this.map = [];


}

World.prototype.init = function() {
    Camera.context.drawImage(this.worldMap , 0,0, this.worldMap.width , this.worldMap.height);
    var pixels = Camera.context.getImageData( 0 , 0 , this.worldMap.width , this.worldMap.height);
    for ( var i =0; i < pixels.data.length/4; i++) {
        this.map.push( pixels.data[i*4]);
    }
}

World.prototype.draw = function() {
    if ( this.map.length == 0)
        return;

    var rows = viewScreenHeight;
    var cols = viewScreenWidth;
    var startRow = Math.floor(player.worldPosition.y / TILE_LENGTH) - viewScreenHeight /2;
    var offsetR = player.worldPosition.y % TILE_LENGTH;
    var offsetC = player.worldPosition.x % TILE_LENGTH;
    var startCol = Math.floor(player.worldPosition.x / TILE_LENGTH) - viewScreenWidth  /2;
    for ( var r = 0; r < rows; r++ ) {
        for ( var c = 0; c < cols; c++) {
            var index = (r + startRow) * WorldWidth + (c + startCol);
            if ( index >=0 && index < this.map.length) {
                Camera.drawImage(this.tiles[this.map[index]], c * 16 - offsetC, r * 16 - offsetR , TILE_LENGTH, TILE_LENGTH);
            } else {
                Camera.drawImage(this.tiles[BLACK_TILE] , c * 16 , r * 16 , TILE_LENGTH , TILE_LENGTH);
            }
        }
    }

};
