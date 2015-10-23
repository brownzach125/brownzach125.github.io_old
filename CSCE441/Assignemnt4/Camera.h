#include <iostream>
#include "Eigen/Geometry"
#include "Object3D.h"
using namespace Eigen;

class Camera : public Object3D {
public:
    Camera() {
    }
    Camera(Vector3f p , Vector3f f, Vector3f u , Vector3f r) :        Object3D(p , f, u , r) {
    }
};