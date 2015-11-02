// Util is an object used like a namespace
var Util = {};

/**
 * Removes an element from an array by matching the value.
 * @param arr, target array, val, value to match
 */
Util.removeByValue = function(arr, val)
{
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
};

/**
 * Finds the angle between to points
 * @param a & b, {x, y} objects to find the angle between
 * @return angle between a and b in degrees
 */
Util.angleTo = function(a, b)
{
    var c = {
        x: b.x - a.x,
        y: b.y - a.y
    };

    //console.log("X: "+c.x+" | Y: "+c.y);

    var theta =  Math.atan2(c.y, c.x);

    return theta;

    if (theta < 0)
        theta += 2 * Math.PI;

    return (theta * 180) / Math.PI;
};


Util.getTime = function()
{
    var d =  new Date();
    return d.getTime();
};

Util.getRandomNumber = function(bound)
{
    return Math.floor(Math.random() * bound);
};


Util.getImageData = function(img) {
    var canvas  = document.getElementById('blendCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0,0, 640 , 400);
    context.drawImage(img,  0,0 , 640 , 400 );
    var data = context.getImageData(0,0 , 640 , 400);
    return data;
};