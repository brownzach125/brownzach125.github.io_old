//
// Created by solevi on 9/22/15.
//

#ifndef ASSIGNMENT3_CLIPPINGALG_H_H
#define ASSIGNMENT3_CLIPPINGALG_H_H
#include "Geometry.h"
#include <iostream>
#include <list>

void setFramebuffer(int x, int y, float R, float G, float B);
// TODO fix what happens when you go out of range
void drawClippingRectangle(Point& a, Point& b) {
    int incrX;
    int incrY;
    if ( a.xpos < b.xpos) {
        incrX = 1;
    }else {
        incrX = -1;
    }
    if ( a.ypos < b.ypos) {
        incrY = 1;
    }
    else {
        incrY  =-1;
    }
    for ( int i = a.xpos; i != b.xpos; i += incrX) {
        setFramebuffer( i , a.ypos , 1.0 , 1.0 , 1.0);
        setFramebuffer( i , b.ypos , 1.0 , 1.0 , 1.0);
    }
    for ( int i = a.ypos; i != b.ypos; i+= incrY ) {
        setFramebuffer( a.xpos , i , 1.0 , 1.0 , 1.0);
        setFramebuffer( b.xpos, i , 1.0 , 1.0 , 1.0);
    }
}

typedef enum { Left , Right , Bottom , Top } Boundary;

bool inside(Point p , Boundary b , Point wMin , Point wMax ) {
    // y grows down
    switch( b ) {
        case Left: if ( p.xpos < wMin.xpos ) {
                return false;
            }
            break;
        case Right: if ( p.xpos > wMax.xpos ) {
                return false;
            }
            break;
        case Top: if ( p.ypos < wMax.ypos ) {
                return false;
            }
            break;
        case Bottom: if ( p.ypos > wMin.ypos ) {
                return false;
            }
            break;
    }
    return true;
}

bool cross( Point& A , Point& B, Boundary& b, Point& wMin , Point& wMax ) {
    if ( inside ( A , b , wMin , wMax) == inside ( B , b , wMin , wMax)) {
        return false;
    }
    else {
        return true;
    }
}

Point intersect( Point& A , Point& B , Boundary& boundary , Point& wMin , Point& wMax) {
    Point intersectPoint;
    double slope;

    if ( A.xpos != B.xpos ) slope = ( A.ypos - B.ypos) / double( A.xpos - B.xpos );
    switch( boundary ) {
        case Left:
            intersectPoint.xpos = wMin.xpos;
            intersectPoint.ypos = B.ypos + (wMin.xpos - B.xpos) * slope;
            break;
        case Right:
            intersectPoint.xpos = wMax.xpos;
            intersectPoint.ypos = B.ypos + (wMax.xpos - B.xpos) * slope;
            break;
        case Bottom:
            intersectPoint.ypos = wMin.ypos;
            if ( A.xpos != B.xpos) intersectPoint.xpos = B.xpos + (wMin.ypos - B.ypos) / slope;
            else {
                intersectPoint.xpos = B.xpos;
            }
                        break;
        case Top:
            intersectPoint.ypos = wMax.ypos;
            if ( A.xpos != B.xpos) intersectPoint.xpos = B.xpos + (wMax.ypos - B.ypos) / slope;
            else {
                intersectPoint.xpos = B.xpos;
            }
            break;
    }
    return intersectPoint;
}


void clipPolygons( list<Polygon>& polygons , Point A, Point B) {
    // determine bottom left and top right point
    Point wMin;
    Point wMax;
    if ( A.xpos < B.xpos ) {
        wMin.xpos = A.xpos;
        wMax.xpos = B.xpos;
    }
    else {
        wMin.xpos = B.xpos;
        wMax.xpos = A.xpos;
    }

    if ( A.ypos > B.ypos ) {
        wMin.ypos = A.ypos;
        wMax.ypos = B.ypos;
    }
    else {
        wMin.ypos = B.ypos;
        wMax.ypos = A.ypos;
    }
    cout << "wMin :" << wMin << " wMax  " << wMax << endl;
    for ( list<Polygon>::iterator it = polygons.begin(); it != polygons.end(); it++) {
        for ( int b = Left; b<=Top; b++) {
            list<Point> points = it->points;
            it->clear();
            list<Point>::iterator firstPoint  = points.begin();
            list<Point>::iterator secondPoint = ++points.begin();
            //For this boundary clip all points
            while( firstPoint != points.end() ) {
                Boundary bound = static_cast<Boundary>(b);
                if (cross(*firstPoint, *secondPoint, bound, wMin, wMax)) {
                    Point intersectPoint = intersect(*firstPoint, *secondPoint, bound, wMin, wMax);
                    // The first point is inside but the second is outside
                    if (  inside(*firstPoint , bound , wMin , wMax) && !inside(*secondPoint , bound , wMin, wMax) ) {
                        it->addPoint(intersectPoint);
                    }
                    else { //if cross but not in out must be out in
                        it->addPoint(intersectPoint);
                        it->addPoint(*secondPoint);
                    }
                } // No cross and inside so add second point to newPoint list
                else if ( inside(*firstPoint , bound , wMin , wMax) && inside(*secondPoint , bound , wMin, wMax) ) {
                    it->addPoint(secondPoint->xpos, secondPoint->ypos);
                }
                firstPoint++;
                secondPoint++;
                if (secondPoint == points.end() ) {
                    secondPoint = points.begin();
                }
            }
        }
        // All the points were added and all but the last edge
        it->finish();
    }
}





#endif //ASSIGNMENT3_CLIPPINGALG_H_H
