package main

import (
    "fmt"
    "os"
)

type Station struct {
    Name     string
    Distance map[string]int
}

var stations = map[string]Station{
    "A": {"A", map[string]int{"B": 5, "C": 10}},
    "B": {"B", map[string]int{"A": 5, "D": 15}},
    "C": {"C", map[string]int{"A": 10, "D": 20, "E": 10}},
    "D": {"D", map[string]int{"B": 15, "C": 20, "E": 5}},
    "E": {"E", map[string]int{"C": 10, "D": 5}},
}

type Route struct {
    Stations []string
    Distance int
}

func findShortestPath(start, end string) (Route, error) {
    if start == end {
        return Route{}, fmt.Errorf("start and end stations cannot be the same")
    }

    if _, ok := stations[start]; !ok {
        return Route{}, fmt.Errorf("start station %s does not exist", start)
    }

    if _, ok := stations[end]; !ok {
        return Route{}, fmt.Errorf("end station %s does not exist", end)
    }

    var shortestDistance = map[string]int{}
    var previous = map[string]string{}
    var unvisited = make(map[string]bool)
    var infinity = 1<<31 - 1

    for station := range stations {
        shortestDistance[station] = infinity
        unvisited[station] = true
    }

    shortestDistance[start] = 0

    for len(unvisited) != 0 {
        var current string
        dist := infinity
        for station := range unvisited {
            if shortestDistance[station] < dist {
                current = station
                dist = shortestDistance[station]
            }
        }
        if current == "" {
            break
        }

        delete(unvisited, current)

        for neighbor, distance := range stations[current].Distance {
            if _, ok := unvisited[neighbor]; ok {
                if newDist := shortestDistance[current] + distance; newDist < shortestDistance[neighbor] {
                    shortestDistance[neighbor] = newDist
                    previous[neighbor] = current
                }
            }
        }
    }

    path := []string{}
    for at := end; at != "" && at != start; at = previous[at] {
        path = append([]string{at}, path...)
        if previous[at] == "" {
            return Route{}, fmt.Errorf("no path found from %s to %s", start, end)
        }
    }

    if len(path) == 0 || path[0] != start {
        return Route{}, fmt.Errorf("no valid path found from %s to %s", start, end)
    }

    return Route{Stations: append([]string{start}, path...), Distance: shortestDistance[end]}, nil
}

func main() {
    start := os.Getenv("START_STATION")
    end := os.Getenv("END_STATION")

    if start == "" || end == "" {
        fmt.Println("Environment variables for START_STATION or END_STATION are not set. Please set them to proceed.")
        return
    }

    route, err := findShortestPath(start, end)
    if err != nil {
        fmt.Println("Error finding shortest path:", err)
        return
    }

    fmt.Printf("The shortest route from %s to %s is through stations: %v with a total distance of %d.\n", start, end, route.Stations, route.Distance)
}