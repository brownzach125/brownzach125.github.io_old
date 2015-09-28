cmake_minimum_required(VERSION 3.3)
project(Assignement2)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES main.cpp csce435.h list_minimum.cpp list_minimum.h barrier.cpp.cpp barrier.cpp)
add_executable(Assignement2 ${SOURCE_FILES})