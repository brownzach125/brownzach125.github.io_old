//
// Created by solevi on 9/22/15.
//

#ifndef ASSIGNMENT3_SCANLINEALG_H
#define ASSIGNMENT3_SCANLINEALG_H
#include "Geometry.h"

// Forward declare
void setFramebuffer(int x, int y, float R, float G, float B);

void initEdgeList(map<int , list<Edge>>& edgeListMap , Polygon& polygon) {
    // Add all the polygon's edges to correct scanline list
    for (list<Edge>::iterator it = polygon.edges.begin(); it != polygon.edges.end(); it++) {
        // We don't include horizontal lines
        if ( it->isHorizontal() ){
            continue;
        }
        int key = it->lowestPoint();
        edgeListMap[key].push_back(*it);
    }
    // Sort those lists
    for (map<int , list<Edge>>::iterator it = edgeListMap.begin(); it!= edgeListMap.end(); it++) {
        it->second.sort();
    }
}

void updateActiveList(map<int , list<Edge>>& edgeMap, list<Edge>& activeList,  int scanLine ) {
    if ( edgeMap.find(scanLine) != edgeMap.end()) {
        // Add new edges
        list<Edge> l = edgeMap[scanLine];
        for (list<Edge>::iterator it = l.begin(); it != l.end(); it++) {
            activeList.push_back(*it);
        }
    }

    //  Remove finished edges
    list<Edge>::iterator it = activeList.begin();
    while ( it != activeList.end() ) {
        // Remeber y grows down
        // Remove the edge if its top point
        if ( it->highestPoint() >= scanLine ) {
            activeList.erase(it++); // Iterate first and then erase
        }
        else {
            it++;
        }
    }
    // For good measure
    activeList.sort();
}

void drawScanline( list<Edge>& l , int scanline , float r,  float g, float b) {
    edgeListIt left   = l.begin();
    edgeListIt right  = ++l.begin();

    int interval = 1;
    while ( right != l.end() ) {
        if (interval % 2 == 1) {
            for (int i = left->getXPOS(); i < right->getXPOS(); i++) {
                setFramebuffer(i, scanline, r, g, b);
            }
        }
        interval = (interval + 1) % 2;
        right++;
        left++;
    }
    for (edgeListIt it = l.begin(); it!=l.end(); it++){
        it->incrementX();
    }
}

void drawPolygon(Polygon& polygon) {
    list<Edge> activeEdgeList;
    map<int , list<Edge> > edgeListMap;

    initEdgeList(edgeListMap , polygon);

    int upperScanline = polygon.highPoint();
    int lowerScanline = polygon.lowPoint();
    for( int i = lowerScanline; i >= upperScanline; i--){
        updateActiveList(edgeListMap , activeEdgeList , i);
        drawScanline( activeEdgeList , i , polygon.red , polygon.green , polygon.blue);
    }
}

// TODO really crappy
void drawPolygonEdge(Polygon& polygon) {
    for (edgeListIt it = polygon.edges.begin(); it != polygon.edges.end(); it++) {
        Point A = it->A;
        Point B = it->B;
        double slope = (double)(A.ypos - B.ypos) / (double)(A.xpos - B.xpos);
        if (slope * slope < 1 ) {
            double x;
            double diff;
            double y;
            if (A.xpos < B.xpos) {
                x = A.xpos;
                diff = B.xpos - A.xpos;
                y = A.ypos;
            }
            else {
                x = B.xpos;
                diff = A.xpos - B.xpos;
                y = B.ypos;
            }
            for (int i = x; i < x + (diff); i++) {
                setFramebuffer(i, y, polygon.red, polygon.green, polygon.blue);
                y += slope;
            }
        }else {
            double x;
            double diff;
            double y;
            slope = (A.xpos - B.xpos) / (double)(A.ypos - B.ypos);
            if (A.ypos < B.ypos) {
                x = A.xpos;
                diff = B.ypos - A.ypos;
                y = A.ypos;
            }
            else {
                x = B.xpos;
                diff = A.ypos - B.ypos;
                y = B.ypos;
            }
            for (int i = y; i < y + (diff); i++) {
                setFramebuffer(x, i, polygon.red, polygon.green, polygon.blue);
                x += slope;
            }
        }
    }
}

#endif //ASSIGNMENT3_SCANLINEALG_H
