# Javascript-Astar

Simple pathfinding script for a 2d grid.

### Limitations

The grid has to be a square, and it does not support diagonal movement.
The walls / obstacles covers an entire cell.

### How to use

```javascript
// Prepare size and positions
var mapSize = 9,
    startPosition = {x: 0, y: 5},
    targetPosition = {x: 8, y: 7}

// Prepare some walls
// Wall takes two parameters: x- and y coordinate
var walls = [
    new Wall(5, 5),
    new Wall(5, 6),
    new Wall(5, 7),
    new Wall(5, 8)
]

// Create a new astar object
// This initializes an empty grid with the size of mapSize
var aS = new aStar(mapSize, mapSize)

// Set walls
aS.setWalls(walls)

// Set s start position
aS.setStartPosition(startPosition.x, startPosition.y)

// Set a target position
aS.setTargetPosition(targetPosition.x, targetPosition.y)

// Get the path
var path = aS.getPath()

```
