// Header file for find_drone.c
//
// *** THIS HEADER FILE SHOULD NOT BE MODIFIED ***
//
// Contains following routines
//
//    check_grid(int i, int j)
//	- check grid location (i,j) to determine if drone is present
//
//    initialize_grid(int n, int seed)
//	- initialize gridsize to n, initializes drone location randomly
//	  in the grid, and initializes other parameters
//
//    get_gridsize()
//	- returns n where the grid is of size n x n
//
//    check_drone_location(int drone_i, int drone_j)
//	- used to check if drone has been located correctly
//
#include <stdlib.h>
#include <time.h>

// -------------------------------------------------------------------------
// Data structure and routines for the grid
int _grid_size = 4096;
int _drone_i, _drone_j;
struct timespec sleeptime;

// -------------------------------------------------------------------------
// Routines for the grid

// Query grid location (i,j) to determine if drone present
// - Returns 0 if the drone is at (i,j), otherwise returns an integer k
//   such that the drone is no more that k steps from (i,j), (a step equals
//   the distance between two adjacent nodes of the grid); note that
//   k the smallest integer which is a multiple of 16;
// - Introduces delay
int check_grid(int i, int j) {
    nanosleep(&sleeptime, NULL);
    int k;
    int distance = abs(_drone_i-i) + abs(_drone_j-j);
    int d = (distance-1)/16;
    if (distance == 0)
        k = 0;
    else
        k = 16*(d+1);
    return k;
}

// Initialize grid size, drone location, and
// sleep duration for each check_grid query
void initialize_grid(int n, int seed, int nanosleep_ntime) {
    // Initialize grid size
    if ((n > 0) && (n <= _grid_size)) {
        _grid_size = n;
    } else {
        printf("initialize_grid: Grid size set to %u (maximum allowed)\n",
               _grid_size);
    }
    // Initialize location of drone to random grid location
    srand48(seed);
    _drone_i = lrand48() % _grid_size;
    _drone_j = lrand48() % _grid_size;
    // Intialize sleep time
    sleeptime.tv_sec = nanosleep_ntime / 1000000000;
    sleeptime.tv_nsec = nanosleep_ntime % 1000000000;
}

// Determine grid size
int get_gridsize() {
    return _grid_size;
}

// Check drone location
int check_drone_location(int drone_i, int drone_j) {
    if ((drone_i == _drone_i) && ( drone_j == _drone_j))
        return 1;
    else
        return 0;
}
