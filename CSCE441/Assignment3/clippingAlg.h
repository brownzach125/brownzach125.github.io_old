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

void clipPolygons( list<Polygon>& polygons , Point A, Point B) {
    list<Edge> clippingEdges;
    clippingEdges.push_back( Edge(A.xpos , A.ypos , A.xpos , B.ypos) ); // Left in mind
    clippingEdges.push_back( Edge(A.xpos , A.ypos , B.xpos , A.ypos) ); // Top in mind

    clippingEdges.push_back( Edge(B.xpos , B.ypos , B.xpos , A.ypos) ); // Right in mind
    clippingEdges.push_back( Edge(B.xpos , B.ypos , A.xpos , B.ypos) ); // Bottom in mind

}

#endif //ASSIGNMENT3_CLIPPINGALG_H_H
