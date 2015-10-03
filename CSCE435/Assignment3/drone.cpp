// Game of Drones
//
// Find the drone in a grid
//
// *** Lines marked "Do not remove" should be retained in your code ***
//
// Warning: Return values of calls are not checked for error to keep
// the code simple.
//
// Compilation command on ADA:
//   module load intel
//   icc -o find_drone.exe drone.c -lpthread -lrt
//
// Requires drone.h to be in the same directory
//
// Sample execution and output ($ sign is the shell prompt):
//
// $ ./find_drone.exe 100 0 100000
// Drone = (14,40), success = 1, time (sec) =   1.5213
// $ ./find_drone.exe 400 0 100000
// Drone = (14,240), success = 1, time (sec) =  24.3714
//
#include <pthread.h>
#include <stdio.h>
#include <time.h>
#include <iostream>
#include <math.h>
#include "drone.h"		// Do not remove

#define MAX_THREADS     65536

struct timespec start, stop; 	// Do not remove
double total_time;		// Do not remove
int gridsize;			// Do not remove

int drone_i, drone_j; 		//Coordinates of drone (to be found)
// -------------------------------------------------------------------------
// Data structures and multithreaded code to find drone in the grid
// ...
// ...
// ...
// ...
// ...
// ...
// -------------------------------------------------------------------------
// Main program to find drone in a grid

typedef struct {
    int id;
    int lastDistance;
    int startRowRealGrid;
    int startColRealGrid;
    int lastGuessRow;
    int lastGuessCol;
} ThreadContext;

int workingGridSize;
int workingGridRow;
int workingGridCol;
int num_threads; // Must be a power of 2
int rootThreads;
pthread_t threads[MAX_THREADS];
ThreadContext contexts[MAX_THREADS];

pthread_attr_t attr;
pthread_mutex_t lock;
pthread_barrier_t barrier;
pthread_cond_t cond;

bool found;
void *threadMain(void *context) {
    ThreadContext* threadContext = (ThreadContext*)context;
    int id = threadContext->id;

    while(1) {
        //--------------------
        // Check if found TODO do I need lock? ehh, only one will ever set
        //--------------------
        if (found) {
            pthread_exit(NULL);
        }
        //----------------
        // Compute which rows and columns are mine
        //----------------
        int quadRow  = id / rootThreads;
        int quadCol  = id % rootThreads;
        int quadSize = workingGridSize / rootThreads;
        int startRow = quadRow * quadSize + workingGridRow;
        int endRow   = (quadRow +1 ) * quadSize + workingGridRow;
        int startCol = quadCol * quadSize + workingGridCol;
        int endCol   = (quadCol + 1) * quadSize + workingGridCol;
        threadContext->startRowRealGrid = startRow;
        threadContext->startColRealGrid = startCol;

        /*
        if ( id == 0) {
            std::cout << "Hi im the  " << id << std::endl;
            std::cout << "The working grid size is " << workingGridSize << std::endl;
            std::cout << "Root threads " << rootThreads << std::endl;
            std::cout << "Quad Size " << quadSize << std::endl;
            std::cout << "Working grid row start" << workingGridRow << std::endl;
            std::cout << "Working grid col start" << workingGridCol << std::endl;
        }
        */

        if ( workingGridSize == 32) {
            for ( int i = startRow; i < endRow; i++) {
                for ( int j = startCol; j < endCol; j++ ) {
                    int distance = check_grid(i , j);
                    if ( distance == 0){
                        threadContext->lastDistance = 0;
                        threadContext->lastGuessRow = i;
                        threadContext->lastGuessCol = j;
                        found = true;
                        break;
                    }
                }
            }
        }
        else {
            //-----------------------------
            // Ping in the middle of my quad
            //-----------------------------
            int quadMidX = quadRow * quadSize + quadSize / 2 + workingGridRow;
            int quadMidY = quadCol * quadSize + quadSize / 2 + workingGridCol;
            threadContext->lastDistance = check_grid(quadMidX, quadMidY);
            threadContext->lastGuessRow = quadMidX;
            threadContext->lastGuessCol = quadMidY;
        }
        //-------------------------------
        // Wait at barrier
        //-------------------------------
        int master = pthread_barrier_wait(&barrier);
        if ( master == PTHREAD_BARRIER_SERIAL_THREAD) {
            //------------
            // I am the serial thread and must do some serial work.
            //------------

            //-----------------
            // Find the minimum
            //-----------------
            int minValue = contexts[0].lastDistance;
            int minThread = 0;
            for ( int i =1; i < num_threads; i++) {
                //std::cout << "Thread " << i <<" was " << std::endl;
                if ( contexts[i].lastDistance < minValue ) {
                    minValue = contexts[i].lastDistance;
                    minThread = i;
                }

            }
            std::cout << "The working gridSize is " << workingGridSize << std::endl;
            std::cout << "The quad size is " << workingGridSize / rootThreads << std::endl;
            std::cout << "The closest thread is " << minThread << " with " << minValue << std::endl;
            std::cout << "They checked " << contexts[minThread].lastGuessRow << " " << contexts[minThread].lastGuessCol << std::endl;
            if ( minValue == 0) {
                found = true;
                drone_i = contexts[minThread].lastGuessRow;
                drone_j = contexts[minThread].lastGuessCol;
            }
            else {
                //-----------
                // Setup next search area
                //-----------
                // breakdown quadrant
                //workingGridSize = quadSize;
                //workingGridRow  = contexts[minThread].startRowRealGrid;
                //workingGridCol  = contexts[minThread].startColRealGrid;

                // Make new quad
                workingGridSize = 2 * minValue;
                workingGridRow  = contexts[minThread].lastGuessRow - minValue;
                workingGridCol  = contexts[minThread].lastGuessCol - minValue;
            }
            //----------------------
            // I was the serial thread I need to wake up the others
            //----------------------
            pthread_barrier_wait(&barrier);
        }
        else {
            pthread_barrier_wait(&barrier);
        }
    }
}

void prepareForThread() {
    num_threads = 16;
    rootThreads  = sqrt(num_threads);
    pthread_mutex_init(&lock, NULL);
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr , PTHREAD_CREATE_JOINABLE);

    pthread_barrier_init( &barrier , NULL , num_threads);
    pthread_cond_init(&cond , NULL);

    found = false;
    workingGridSize = gridsize;
    workingGridCol  = 0;
    workingGridRow  = 0;
}

void cleanUpThreadStuff() {
    pthread_attr_destroy(&attr);
    pthread_mutex_destroy(&lock);
    pthread_barrier_destroy(&barrier);
    pthread_cond_destroy(&cond);
}

int main(int argc, char *argv[]) {
    if (argc != 4) {
        printf("Need four integers as input \n");
        printf("Use: <executable_name> <grid_size> <random_seed> <nanosleep_ntime\n");
        exit(0);
    }
    // Initialize grid
    gridsize = abs((int) atoi(argv[argc-3])); 		// Do not remove
    int seed = (int) atoi(argv[argc-2]); 		// Do not remove
    int nanosleep_ntime = abs((int) atoi(argv[argc-1]));	// Do not remove
    initialize_grid(gridsize, seed, nanosleep_ntime); 	// Do not remove
    gridsize = get_gridsize();	 			// Do not remove

    std::cout << _drone_i << " " << _drone_j << std::endl;
    prepareForThread(); // Just Initialize my shared structures
    clock_gettime(CLOCK_REALTIME, &start); 	// Do not remove



    // Multithreaded code to find drone in the grid
    // ...
    // ...
    // ... sample serial code shown below ...
    for ( int i =0; i < num_threads; i++) {
        contexts[i].id = i;
        pthread_create(&threads[i] , &attr , threadMain , (void *) &contexts[i]);
    }
    // Join threads
    for (int i = 0; i < num_threads; i++) {
        pthread_join(threads[i], NULL);
    }
    // ...
    // ...
    // ...

    // Compute time taken
    clock_gettime(CLOCK_REALTIME, &stop);			// Do not remove
    total_time = (stop.tv_sec-start.tv_sec)			// Do not remove
                 +0.000000001*(stop.tv_nsec-start.tv_nsec);		// Do not remove

    // Check if drone found, print time taken
    printf("Drone = (%d,%d), success = %d, time (sec) = %8.4f\n", // Do not remove
           drone_i, drone_j, check_drone_location(drone_i,drone_j), total_time);// Do not remove

    // Other code to wrap up things
    // ...
    // ...
    // ...
    cleanUpThreadStuff(); // Just cleans up my locks and such

}

