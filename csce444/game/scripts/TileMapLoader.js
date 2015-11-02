function LoadTileMap(img) {
    var result = { terrain: [] , objs: {} , monsters: [] }
    var width = img.width;
    var height = img.height;

    Camera.context.drawImage(img , 0,0, width , height);
    var pixels = Camera.context.getImageData( 0 , 0 , width , height).data;

    for ( var i =0; i < pixels.length/4; i++) {
        // Ground type red bit
        var groundType = pixels[i*4];
        // Monster type green bit
        var monsterType = pixels[i*4 +1];
        // Obj type blue bit
        var objType  = pixels[i*4 +2];

        var r = Math.floor(i / width);
        var c = i % width;
        var ground;
        var obj;
        var pos = { x: c * TILE_LENGTH + Math.floor(TILE_LENGTH/2) , y: r * TILE_LENGTH + Math.floor(TILE_LENGTH /2)};
        result.terrain.push(groundType);
        if ( objType != 0) {
            result.objs[ i ] = ( { type: objType , pos: pos});
        }
        if ( monsterType !=0) {
            result.monsters.push( { type: monsterType , pos:pos});
        }
    }
    return result;
}
