//
// Created by solevi on 9/21/15.
//

#ifndef ASSIGNMENT3_GEOMETRY_H
#define ASSIGNMENT3_GEOMETRY_H

#include <ostream>
using namespace std;

class Edge;
typedef list<Edge>::iterator edgeListIt;

class Point {
    friend ostream& operator<<(ostream& os, const Point& p) {
        os << "XPOS: " << p.xpos << " YPOS: " << p.ypos;
        return os;
    }
public:
    int xpos;
    int ypos;
    Point() {

    }
    Point(int xpos ,int ypos): xpos(xpos) , ypos(ypos) {
    }
};

class Edge {
    friend ostream& operator<<(ostream& os , const Edge& e) {
        os << "Edge: A " << e.A << "\n\t B " << e.B;
        return os;
    }
public:
    Point A;
    Point B;
    double xpos; //Where the next xpos should be
    double incX;
    Edge( int x0 ,int y0 ,int x1,int y1 ): A(x0 , y0) , B(x1 , y1) {
        if ( y0 > y1) {
            xpos = x0;
        }
        else {
            xpos = x1;
        }
    }
    int lowestPoint() const {
        // Rememeber y grows down
        if (B.ypos < A.ypos) {
            return A.ypos;
        }
        else {
            return B.ypos;
        }
    }
    int highestPoint() const  {
        // Remember y grows down. So small value is the higher point
        if ( A.ypos < B.ypos) {
            return A.ypos;
        }else {
            return B.ypos;
        }
    }
    bool isHorizontal() const {
        if ( A.ypos == B.ypos) {
            return true;
        }
        else {
            return false;
        }
    }
    int leftMostPoint() const {
        if ( A.xpos < B.xpos ){
            return A.xpos;
        }
        else {
            return B.xpos;
        }
    }
    bool operator<(const Edge& e){
        if ( this->xpos < e.xpos ) {
            return true;
        }
        else {
            return false;
        }
    }
    void incrementX() {
        double slope  = (double)( A.ypos - B.ypos) / (double)(A.xpos  - B.xpos);
        double xslope = (1.0 / slope);
        // remember y grows down
        xpos -=xslope;
    }
    int getXPOS() {
        return xpos;
    }
};
class Polygon {
    int lastX;
    int lastY;
    int firstX;
    int firstY;
public:
    list<Edge> edges;
    Polygon() {
        lastX = -1;
        lastY = -1;
        firstX = -1;
        firstY = -1;
    }
    void addEdge( int x1 , int y1 , int x2 , int y2) {
        edges.push_back( Edge(x1 , y1,  x2 , y2) );
    }
    int lowPoint() {
        int max = -1;
        for( edgeListIt it = edges.begin(); it!= edges.end(); it++) {
            if ( it->lowestPoint() > max || max < 0){
                max = it->lowestPoint();
            }
        }
        return max;
    }
    int highPoint() {
        int min = -1;
        for( edgeListIt it = edges.begin(); it!= edges.end(); it++) {
            if ( it->highestPoint() < min || min < 0){
                min = it->highestPoint();
            }
        }
        return min;
    }
    void addPoint(int x, int y) {
        if ( lastX >= 0 ){
            addEdge( lastX , lastY , x , y);
        } else {
            firstX = x;
            firstY = y;
        }
        lastX = x;
        lastY = y;
    }
    void addLastPoint(int x , int y) {
        addEdge( lastX , lastY , x , y);
        addEdge( x, y , firstX , firstY);
    }
    friend ostream& operator<<(ostream& os , const Polygon& poly) {
        for(list<Edge>::const_iterator it = poly.edges.begin(); it!= poly.edges.end(); it++) {
            os << *it << endl;
        }
        return os;
    }
};

#endif //ASSIGNMENT3_GEOMETRY_H
