cmake_minimum_required(VERSION 3.3)
project(Assignment3)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES main.cpp Geometry.h scanLineAlg.h clippingAlg.h)
add_executable(Assignment3 ${SOURCE_FILES})

target_link_libraries(Assignment3 -lglut -lGL -lGLU)