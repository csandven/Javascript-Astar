# Javascript-Astar

Simple pathfinding script for a 2d grid.

### Limitations

The grid has to be a square, and it does not support diagonal movement.
The walls / obstacles covers an entire cell.

### How to use

```javascript
// Prepare size and positions
const mapSize = 9,
    startPosition = {x: 0, y: 5},
    targetPosition = {x: 8, y: 7}

// Prepare some walls
// Wall takes two parameters: x- and y coordinate
const obstacles = [
    { x: 5, y: 4 },
    { x: 5, y: 5 },
    { x: 5, y: 6 },
    { x: 5, y: 7 },
    { x: 5, y: 8 }
]

// Create a new astar object
// This initializes an empty grid with the size of mapSize
const aS = new Astar(mapSize, mapSize)

// Set walls
aS.setObstacles(obstacles)

// Get the path
const path = aS.getPath(startPosition, targetPosition)

```

#### Graph

You can also get out a debug graph for the path it finds.

```javascript
// Get the path
const aS = new Astar(mapSize, mapSize)
const path = aS.getPath(startPosition, targetPosition)

// Get the graph
const graph = aS.graph(path)

/*
 * Will output this: 
 * Where the O's are free cells, X's are obstacles and # are the path
OOOOOOOOO
OOOOOOOOO
OOOOOOOOO
#########
#OOOOXOO#
OOOOOXOO#
OOOOOXOO#
OOOOOXOO#
OOOOOXOOO
*/

```
