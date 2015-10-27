TILE_LENGTH = 16;

// Tiles enum
var ROAD_TILE  =  1;
var BLACK_TILE =  0;

// Object enum
var PLAYER_OBJ    = 50;
var IRON_RAIL_OBJ = 255;


function World() {
    this.tiles = {};
    this.tiles[ROAD_TILE]      = ResourceManager.loadImage("./images/tiles/IronPath_0.png");
    this.tiles[IRON_RAIL_OBJ]  = ResourceManager.loadImage("./images/tiles/IronPath_1.png");
    this.tiles[BLACK_TILE]     = ResourceManager.loadImage("./images/tiles/BlackTile.png");

    this.worldMap              = ResourceManager.loadImage("./images/tiles/TileMap.png");
    this.monsterManager = new MonsterManager();

    this.terrainMap = [];
}

World.prototype.init = function() {
    this.WorldWidth  = this.worldMap.width;
    this.WorldHeight = this.worldMap.height;
    this.viewScreenWidth =  Math.floor(CAMERA_NATIVE_WIDTH / TILE_LENGTH);
    this.viewScreenHeight = Math.floor(CAMERA_NATIVE_HEIGHT / TILE_LENGTH);

    var result = LoadTileMap(this.worldMap);
    this.terrainMap = result.terrain;
    var objs = result.objs;
    this.objs = {};
    for ( var key in objs ) {
        var obj = objs[key];
        switch( obj.type ) {
            case IRON_RAIL_OBJ: {
                obj.obj = new IronRod(obj.pos , this.tiles[IRON_RAIL_OBJ]);
                this.objs[key] = obj;
                break;
            }
            case PLAYER_OBJ: {
                player.position = obj.pos;
            }
        }
    }
    for ( var key in result.monsters) {
        var obj = result.monsters[key];
        this.monsterManager.addMonster(obj.pos , obj.type);
    }
};

World.prototype.getDrawables = function() {
    var drawables = [];
    var viewInfo = Camera.getViewScreenInfo();
    for ( var r = viewInfo.startRow; r < viewInfo.startRow + viewInfo.rows; r++) {
        for ( var c = viewInfo.startCol; c < viewInfo.startCol + viewInfo.cols; c++ ) {
            var index = r * this.WorldWidth + c;
            if ( index >= 0 && index < this.terrainMap.length) {
                if ( this.objs[index] && this.objs[index].obj ) {
                    drawables.push(this.objs[index].obj);
                }
            }
        }
    }
    drawables = drawables.concat( this.monsterManager.getMonstersOnScreen() );
    return drawables;
};

World.prototype.drawTerrain = function() {
    if ( this.terrainMap.length == 0)
        return;

    var viewInfo = Camera.getViewScreenInfo();
    for ( var r = viewInfo.startRow - 5; r < viewInfo.startRow + viewInfo.rows +5; r++ ) {
        for ( var c = viewInfo.startCol - 5; c < viewInfo.startCol + viewInfo.cols + 5; c++) {
            var index;
            if ( r  < 0 || c < 0){
                index  =-1;
            }
            else {
                index = r * this.WorldWidth + c;

            }
            if ( index >=0 && index < this.terrainMap.length) {
                img = this.tiles[this.terrainMap[index]];
            } else {
                img = this.tiles[BLACK_TILE];
            }
            Camera.drawImageWorldPos(img, c * TILE_LENGTH, r * TILE_LENGTH , TILE_LENGTH, TILE_LENGTH);
        }

    }

};

World.prototype.nearByObjects = function(pos , radius) {

    var tileC = Math.floor(pos.x / TILE_LENGTH);
    var tileR = Math.floor(pos.y / TILE_LENGTH);
    radius = Math.floor(radius / TILE_LENGTH) + 1;
    var possible = [];
    for ( var r = tileR - radius; r < tileR + radius; r++) {
        for ( var c = tileC - radius; c < tileC + radius; c++) {
            var index = r  * this.WorldWidth + c;
            var obj = this.objs[index];
            var type = undefined;
            if ( obj )
                type = obj.type;
            switch (type) {
                case IRON_RAIL_OBJ: {
                    possible.push(obj.obj);
                    break;
                }
                case undefined: {

                }

            }
        }
    }
    //possible = possible.concat( this.monsterManager.getMonstersOnScreen() );
    return possible;
}

World.prototype.getMonsters = function() {
    return this.monsterManager.monsters;
}

World.prototype.update = function() {
    this.monsterManager.updateAll();
};