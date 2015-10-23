#include <GL/freeglut.h>
#include <iostream>
#include "Spider.h"
#include "Camera.h"
#include <map>

using namespace std;

Camera* camera;
Spider spider(Vector3f(0,0,-5));
int homeX = -1;
int homeY = -1;
int hinge = 1;

std::map<char , bool> keys;
std::map<int , bool> specialKeys;

void init(void)  {
    glClearColor(1.0, 1.0, 1.0, 0.0);
    glShadeModel(GL_FLAT);
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_CULL_FACE);
    glFrustum(-1,1,-1 ,1 , 1.5 , 4000);
    camera = new Camera( Vector3f(0,0,0) , Vector3f(0,0,-1) , Vector3f(0,1,0),  Vector3f(-1,0,0));
}

void display(void) {
    glClear(GL_COLOR_BUFFER_BIT);
    glClear(GL_DEPTH_BUFFER_BIT);

    Vector3f pos    = camera->getPosition();
    Vector3f forward = camera->getForward();
    Vector3f center =  pos + (10 * forward);
    Vector3f up     = camera->getUp();

    glPushMatrix();
    gluLookAt(	pos[0], pos[1], pos[2], center[0] , center[1] , center[2] , up[0] , up[1] , up[2] );

    glPushMatrix();
    spider.draw();
    glPopMatrix();

    glPopMatrix();

    glutSwapBuffers();
}

void reshape(int w, int h) {
    glFrustum(-1,1,-1 ,1 , 1.5 , 4000);
    glRotatef( (GLfloat) 10 , 0 , 1 , 0);
    glViewport(0, 0, (GLsizei) w, (GLsizei) h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(65.0, (GLfloat) w/(GLfloat) h, 1.0, 200.0);
    glScalef(2,2,2);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}

void keyboard(unsigned char key, int x, int y)  {
    keys[key] = true;
    switch (key) {
        case '1':
            hinge = 1;
            break;
        case '2':
            hinge = 2;
            break;
        case '3':
            hinge = 3;
            break;
        case '4':
            hinge = 4;
            break;
        default:
             break;
    }
}

void keyboardUp(unsigned char key, int x, int y)  {
    keys[key] = false;
}

void specialInput(int key , int x , int y){
    specialKeys[key] = true;
}

void specialUpInput(int key , int x , int y) {
    specialKeys[key] = false;
}

void animation(void) {
    if ( keys['e'] ) {
        camera->turnOver(.5);
    }
    if ( keys['q']) {
        camera->turnOver(-.5);
    }
    if ( keys['a'] ) {
        camera->turnRight(.5);
    }
    if ( keys['d']) {
        camera->turnRight(-.5);
    }
    if ( keys['w'] ) {
        camera->turnUp(-.5);
    }
    if ( keys['s']) {
        camera->turnUp(.5);
    }
    if ( keys['E'] ) {
        camera->moveForward(.5);
    }
    if ( keys['Q']) {
        camera->moveForward(-.5);
    }
    if ( keys['A'] ) {
        camera->moveRight(.5);
    }
    if ( keys['D']) {
        camera->moveRight(-.5);
    }
    if ( keys['W'] ) {
        camera->moveUp(.5);
    }
    if ( keys['S']) {
        camera->moveUp(-.5);
    }
    if ( specialKeys[GLUT_KEY_RIGHT] ) {
        spider.turnRight(-.5);
    }
    if ( specialKeys[GLUT_KEY_LEFT] ) {
        spider.turnRight(.5);
    }
    if ( specialKeys[GLUT_KEY_UP] ) {
        spider.moveForward(.05);
        spider.animateForward(2);
    }
    if ( specialKeys[GLUT_KEY_DOWN] ) {
        spider.moveForward(-.05);
        spider.animateForward(-2);
    }
    glutPostRedisplay();
}

void mouseMove(int x , int y) {
    int diffY = y - homeY;
    int diffX = x - homeX;
    homeX = x;
    homeY = y;
    if ( hinge ==4 ) {
        spider.moveHead(diffX , diffY);
    }
    else {
        spider.crouch(diffY , hinge);
    }
}



void mouse(int button , int state, int x , int y) {
    if (state == GLUT_DOWN) {
        homeX = x;
        homeY = y;
    }
    if (state == GLUT_UP) {
        homeX = -1;
        homeY = -1;
    }
}


int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(500, 500);
    glutInitWindowPosition(100, 100);
    glutCreateWindow(argv[0]);
    init();
    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutKeyboardFunc(keyboard);
    glutKeyboardUpFunc(keyboardUp);
    glutSpecialFunc(specialInput);
    glutSpecialUpFunc(specialUpInput);
    glutMotionFunc(mouseMove);
    glutMouseFunc(mouse);
    glutIdleFunc(animation);
    glutMainLoop();
    return 0;
}