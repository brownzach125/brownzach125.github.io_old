#include <GL/freeglut.h>
#include <math.h>
#include <list>
#include <map>
#include <fstream>
#include <iostream>
#include "Geometry.h"
#include "scanLineAlg.h"
#include "clippingAlg.h"

using namespace std;

/******************************************************************
	Notes:
	Image size is 400 by 400 by default.  You may adjust this if
		you want to.
	You can assume the window will NOT be resized.
	Call clearFramebuffer to clear the entire framebuffer.
	Call setFramebuffer to set a pixel.  This should be the only
		routine you use to set the color (other than clearing the
		entire framebuffer).  drawit() will cause the current
		framebuffer to be displayed.
	As is, your scan conversion should probably be called from
		within the display function.  There is a very short sample
		of code there now.
	You may add code to any of the subroutines here,  You probably
		want to leave the drawit, clearFramebuffer, and
		setFramebuffer commands alone, though.
  *****************************************************************/

#define ImageW 400
#define ImageH 400

float framebuffer[ImageH][ImageW][3];

struct color {
    float r, g, b;		// Color (R,G,B values)
};

// Draws the scene
void drawit(void)
{
    glDrawPixels(ImageW,ImageH,GL_RGB,GL_FLOAT,framebuffer);
    glFlush();
}

// Clears framebuffer to black
void clearFramebuffer()
{
    int i,j;

    for(i=0;i<ImageH;i++) {
        for (j=0;j<ImageW;j++) {
            framebuffer[i][j][0] = 0.0;
            framebuffer[i][j][1] = 0.0;
            framebuffer[i][j][2] = 0.0;
        }
    }
}

// Sets pixel x,y to the color RGB
// I've made a small change to this function to make the pixels match
// those returned by the glutMouseFunc exactly - Scott Schaefer
void setFramebuffer(int x, int y, float R, float G, float B)  {
    // changes the origin from the lower-left corner to the upper-left corner
    y = ImageH - 1 - y;
    if (R<=1.0)
    if (R>=0.0)
        framebuffer[y][x][0]=R;
    else
        framebuffer[y][x][0]=0.0;
    else
        framebuffer[y][x][0]=1.0;
    if (G<=1.0)
    if (G>=0.0)
        framebuffer[y][x][1]=G;
    else
        framebuffer[y][x][1]=0.0;
    else
        framebuffer[y][x][1]=1.0;
    if (B<=1.0)
    if (B>=0.0)
        framebuffer[y][x][2]=B;
    else
        framebuffer[y][x][2]=0.0;
    else
        framebuffer[y][x][2]=1.0;
}

Point firstRectPoint;
Point secondRectPoint;
bool drawingClipping = 0;
list<Polygon> polygons;
Polygon activePolygon;
void display(void) {
    clearFramebuffer();
    drawPolygonEdge(activePolygon);
    if (drawingClipping) {
        drawClippingRectangle(firstRectPoint, secondRectPoint);
    }
    for( list<Polygon>::iterator it = polygons.begin(); it!= polygons.end(); it++) {
        drawPolygon(*it);
    }
    drawit();
}

void init(void) {
    clearFramebuffer();
}

void mouseDrawPolygon(int button, int state, int x, int y) {
    if (state == GLUT_DOWN) {
        switch (button) {
            case GLUT_LEFT_BUTTON:
                activePolygon.addPoint(x , y);
                //glutIdleFunc(spinDisplay);
                break;
            case GLUT_RIGHT_BUTTON:
                activePolygon.addLastPoint( x, y);
                polygons.push_back(activePolygon);
                activePolygon = Polygon();
                break;
            case GLUT_MIDDLE_BUTTON:
                break;
            default:
                break;
        }
    }
    else { // Button up
        //glutIdleFunc(NULL);
    }
    glutPostRedisplay();
}

void mouseClipping(int button, int state, int x, int y) {
    //glutIdleFunc(NULL);
    if (state == GLUT_DOWN) {
        switch (button) {
            case GLUT_LEFT_BUTTON:
                firstRectPoint = Point(x , y);
                for ( list<Polygon>::iterator it = polygons.begin(); it!= polygons.end(); it++) {
                    it->reset();
                }
                drawingClipping = true;
                break;
            case GLUT_RIGHT_BUTTON:
                break;
            case GLUT_MIDDLE_BUTTON:
                break;
            default:
                break;
        }
    }
    else { // Button up
        clipPolygons( polygons , firstRectPoint , secondRectPoint );
    }
    glutPostRedisplay();
}

void keyboard(unsigned char key , int x, int y) {
    if ( key == 'C') {
        glutMouseFunc(mouseClipping);
    }
}

void mouseMove(int x , int y) {
    if ( drawingClipping ) {
        secondRectPoint = Point(x, y);
    }
    glutPostRedisplay();
}

int main(int argc, char** argv) {
    // NOTE TO SELF TOP CORNER is 0,0 with y growing down
    glutInit(&argc,argv);
    glutInitDisplayMode(GLUT_SINGLE|GLUT_RGB);
    glutInitWindowSize(ImageW,ImageH);
    glutInitWindowPosition(100,100);
    glutCreateWindow("Zachary J Brown - Homework 2");
    init();
    glutDisplayFunc(display);
    glutMouseFunc(mouseDrawPolygon);
    glutKeyboardFunc(keyboard);
    glutMotionFunc(mouseMove);
    glutMainLoop();
    return 0;
}

/*
 *  Polygon testSquare; // Square for testing scan fill algorithm
    Polygon testSquare2;
    Polygon testPoly;
    testSquare.addEdge(0 , 0 , 50  , 0);
    testSquare.addEdge(50 , 0 , 50  , 50);
    testSquare.addEdge(50, 50, 0  , 50);
    testSquare.addEdge(0 , 50, 0  , 0);
    //polygons.push_back(testSquare);
    testSquare2.addEdge(200 , 200 , 250  , 200);
    testSquare2.addEdge(250 , 200 , 250  , 250);
    testSquare2.addEdge(250, 250, 200  , 250);
    testSquare2.addEdge(200, 250, 200  , 200);
    //polygons.push_back(testSquare2);
    testPoly.addEdge(300 , 250 , 325 , 225);
    testPoly.addEdge(325 , 225 , 350 , 250);
    testPoly.addEdge(350 , 250 , 300 , 250);
    polygons.push_back(testPoly);
 */