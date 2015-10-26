var CAMERA_NATIVE_WIDTH = 480;
var CAMERA_NATIVE_HEIGHT = 270;

var Camera = {};

Camera.canvas = null;
Camera.context = null;

Camera.scale = 0;
Camera.width = CAMERA_NATIVE_WIDTH * Camera.scale;
Camera.height = CAMERA_NATIVE_HEIGHT * Camera.scale;

Camera.init = function() {
    Camera.canvas = document.getElementById('gameCanvas');
    Camera.context = Camera.canvas.getContext('2d');

    Camera.canvas.width = Camera.width,
        Camera.canvas.height = Camera.height;

    Camera.bestFitCamera();
};

Camera.bestFitCamera = function() {
    var bestScaleW = 1;
    while(CAMERA_NATIVE_WIDTH * (bestScaleW+1) < window.innerWidth)
        bestScaleW++;

    var bestScaleH = 1;
    while(CAMERA_NATIVE_HEIGHT * (bestScaleH+1) < window.innerHeight)
        bestScaleH++;

    var bestScale = (bestScaleW < bestScaleH) ? bestScaleW : bestScaleH;

    Camera.setScale(bestScale);
};

Camera.positionCanvas = function() {
    var x = (window.innerWidth - Camera.width) / 2;
    var y = (window.innerHeight - Camera.height) / 2;

    if(y > 100)
        y = 100;

    if(EMBED)  {
        x = 0;
        y = 0;
    }

    Camera.canvas.style.left = x + "px";
    Camera.canvas.style.top = y + "px";
};

Camera.setScale = function(scale) {
    Camera.scale = scale;
    Camera.width = CAMERA_NATIVE_WIDTH * Camera.scale;
    Camera.height = CAMERA_NATIVE_HEIGHT * Camera.scale;

    Camera.canvas.width = Camera.width;
    Camera.canvas.height = Camera.height;

    Camera.positionCanvas();

    redraw();
};

Camera.clear = function() {

};

Camera.center = { x : 0 ,y: 0 };

Camera.drawImage = function(img, x, y, width, height) {
    //draw canvas without smoothing
    Camera.context.imageSmoothingEnabled = false;
    Camera.context.mozImageSmoothingEnabled = false;
    Camera.context.oImageSmoothingEnabled = false;
    Camera.context.imageSmoothingEnabled = false;
    Camera.context.drawImage(img, x*Camera.scale, y*Camera.scale, width*Camera.scale, height*Camera.scale);
};

Camera.drawImageWorldPos = function(img , x , y , width , height) {
    Camera.context.imageSmoothingEnabled = false;
    Camera.context.mozImageSmoothingEnabled = false;
    Camera.context.oImageSmoothingEnabled = false;
    Camera.context.imageSmoothingEnabled = false;
    Camera.context.drawImage(img, (x - Camera.center.x)*Camera.scale, ( y - Camera.center.y )*Camera.scale, width*Camera.scale, height*Camera.scale);
}


Camera.drawLine = function(color, x, y, dx, dy) {
    Camera.context.beginPath();
    Camera.context.moveTo(x*Camera.scale,y*Camera.scale);
    Camera.context.lineTo(dx*Camera.scale,dy*Camera.scale);
    Camera.context.strokeStyle= color;
    Camera.context.stroke();
};

