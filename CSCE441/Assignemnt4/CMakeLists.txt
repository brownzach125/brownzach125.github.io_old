cmake_minimum_required(VERSION 3.3)
project(Assignment4)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES main.cpp Object3D.h)
add_executable(Assignment4 ${SOURCE_FILES})

target_link_libraries(Assignment4 -lglut -lGL -lGLU)