//
// Created by solevi on 10/23/15.
//

#ifndef ASSIGNMENT4_OBJECT3DD_H
#define ASSIGNMENT4_OBJECT3DD_H
#include <iostream>
#include "Eigen/Geometry"
using namespace Eigen;

class Object3D {

protected:
    Vector3f position;
    Vector3f forward;
    Vector3f up;
    Vector3f right;
public:
    Object3D() {

    }
    Object3D(Vector3f p , Vector3f f, Vector3f u , Vector3f r) {
        position = p;
        forward = f;
        up = u;
        right = r;
    }
    Vector3f getPosition() {
        return position;
    }
    Vector3f getForward() {
        return forward;
    }
    Vector3f getUp() {
        return up;
    }
    Vector3f getRight() {
        return right;
    }

    void moveForward(double amount) {
        Vector3f f = forward;
        position = position + f * amount;
    }
    void moveRight( double amount) {
        Vector3f r = right;
        position = position + r * amount;
    }
    void moveUp( double amount) {
        Vector3f u = up;
        position = position + u * amount;
    }
    void turnOver( double angle ) {
        angle = angle * 3.14 / 180;
        AngleAxisf a( angle , forward);
        up = a * up;
        right = a * right;
    }
    void turnRight( double angle) {
        angle = angle * 3.14 / 180;
        AngleAxisf a( angle , up);
        forward = a * forward;
        right = a * right;
        forward = forward / sqrt ( forward.dot(forward) );
        right = right / sqrt( right.dot(right));
    }
    void turnUp ( double angle) {
        angle = angle * 3.14 / 180;
        AngleAxisf a( angle , right);
        up = a * up;
        forward = a * forward;
        up = up / sqrt ( up.dot(up) );
        forward = forward / sqrt ( forward.dot(forward) );
    }
};


#endif //ASSIGNMENT4_OBJECT3DD_H
