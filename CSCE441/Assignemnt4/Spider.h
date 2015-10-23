#include <vector>
#include <math.h>
#include "Eigen/Geometry"
#include "Object3D.h"

using namespace Eigen;

const double bodyLength = 2;

const double Mid_LegLength     = bodyLength/8.0 * 10;
const double Upper_LegLength   = bodyLength/8.0 *5;
const double Lower_LegLength   = bodyLength/8.0 * 10;

const double legRadius = .1;


class Leg {
public:
    Vector3f pos;
    Vector3f shoulderRotation;
    Vector3f elbowRotation;
    Vector3f wristRotation;
    int id;
    bool left;
    bool back;
public:
    Leg( Vector3f p , int left, bool back , int id) {
        this->left = left;
        this->back = back;
        this->id = id;
        pos = p;
        shoulderRotation = Vector3f( -45 , 90  , 0);
        elbowRotation    = Vector3f( 90 , 90 , 0);
        wristRotation    = Vector3f( 45 , 90 , 0);
    }
    void drawConnector() {
        glColor3f(.5,0,.5);
        glutSolidSphere( .2 , 32 , 16);
    }
    void drawUpperLeg() {
        glColor3f (0, 0 , .5);
        glutSolidCylinder(legRadius , Upper_LegLength , 32 , 1);
    }
    void drawMidLeg() {
        glColor3f(0,0,.5);
        glutSolidCylinder(legRadius , Mid_LegLength , 32 , 1);
    }
    void drawLowerLeg() {
        glColor3f(0,0,.5);
        glutSolidCylinder(legRadius , Lower_LegLength,32,1);
    }
    void draw() {

        glTranslatef(pos[0] , pos[1], pos[2]);
        drawConnector();
        double rotationY = shoulderRotation[1];
        if ( left ) {
            rotationY *=-1;
        }
        glRotatef( (GLfloat) rotationY , 0, 1 ,0);
        glRotatef( (GLfloat) shoulderRotation[0] , 1, 0 ,0);

        drawUpperLeg();

        glTranslatef(0 , 0 , Upper_LegLength);
        glRotatef( (GLfloat) elbowRotation[0] , 1, 0 ,0);

        drawConnector();

        drawMidLeg();

        glTranslatef(0,0,Mid_LegLength);
        glRotatef( (GLfloat) wristRotation[0] , 1 , 0,0);

        drawConnector();
        drawLowerLeg();
    }

    void animateForward(double amount , int spread , int up ) {
        if ( back) {
            amount *= -1;
            up*=-1;
        }
        double mult = 1;
        if ( id == 0 || id == 1 || id == 6 || id == 7) {
            mult = 2;
        }
        amount *= spread * mult ;
        shoulderRotation[1] += amount;
        shoulderRotation[0] += up * .5;
    }

    void crouch(int amount , int hinge) {
        switch( hinge ) {
            case 1:
                shoulderRotation[0] += amount;
                break;
            case 2:
                elbowRotation[0] += amount;
                break;
            case 3:
                wristRotation[0] += amount;
                break;
            default:
                break;
        }
    }
};

class Spider : public Object3D {
    std::vector<Leg> legs;
    int spread = -1;
    double angle = 0;
    double xchange = 0;
    double counter = 10;
    double up = 1;
    double headX;
    double headY;
public:
    Spider(Vector3f pos) : Object3D( pos , Vector3f(0,0,1) , Vector3f(0,1,0), Vector3f(-1,0,0) ) {
        initLegs();
    }
    void initLegs() {
        for (int i = 0; i < 4; i++) {
            double offset = (legRadius * 4) * i;
            bool back = true;
            if ( i > 1) {
                back = false;
            }
            legs.push_back(Leg(Vector3f(bodyLength / 2.0, bodyLength / 2.0 + legRadius / 2.0,
                                        bodyLength / 2.0 - legRadius - offset),
                               0 , back , i * 2)
            );
            legs.push_back(Leg(Vector3f(-1 * (bodyLength / 2.0), bodyLength / 2.0 + legRadius / 2.0,
                                         bodyLength / 2.0 - legRadius - offset),
                               1 , back , i * 2 + 1)
            );
        }
    }
    void drawBody() {
        glColor3f (0, .5 , 0);
        glutSolidSphere(1.5 , 32, 16);
    }

    void drawEyes() {
        glColor3f( 0,0,0);
        glTranslatef(0,.2,.5);
        glPushMatrix();
        glTranslatef(-.3 , 0 , 0);
        glutSolidSphere(.1, 32 , 16);
        glPopMatrix();
        glPushMatrix();
        glTranslatef(.3 , 0 ,0);
        glutSolidSphere(.1, 32 , 16);
        glPopMatrix();
    }

    void drawHead() {
        glColor3f (.5, 0 , 0);
        glRotatef( headX , 1,0,0);
        glRotatef( headY , 0,1,0);
        glutSolidSphere(.5 , 32 , 16);
        drawEyes();
    }

    void drawLegs() {
        for ( int i =0; i < legs.size(); i++) {
            glPushMatrix();
            legs[i].draw();
            glPopMatrix();
        }
    }
    void draw() {
        glTranslatef( position[0] , position[1], position[2]);
        glRotatef(  xchange , 0,1,0);
        drawBody();
        drawLegs();
        glTranslatef(0 , 1 , 1);
        drawHead();
    }
    void turnRight(double angle) {
        Object3D::turnRight(angle);
        xchange+=angle;
    }
    void animateForward(double step) {
        counter +=up;
        if ( counter == 20 || counter == 0) {
            up *=-1;
        }
        for ( int i =0; i < 8; i++) {
            legs[i].animateForward(step , spread , up);
        }
        step *= spread;
        angle += step;
        if ( angle < 0 || angle > 45) {
            spread *= -1;
        }
        position[1] += up * .05;
    }
    void crouch(int amount , int hinge) {
        for ( int i = 0; i< 8; i++) {
            legs[i].crouch(amount , hinge);
        }
    }
    void moveHead(int diffX , int diffY) {
        headY += diffX;
        headX += diffY;
    }
};
