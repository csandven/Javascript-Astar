function Vector (x,y) {
	this.x = x
	this.y = y
}

function Node (parent, vector, worldWidth) {
	this.parent = parent
	this.x = vector.x
	this.y = vector.y
	this.worldWidth = worldWidth
	this.value = this.x + (this.y * worldWidth)
	this.f = 0 // the cost to get to this node from the start
	this.g = 0 // The cost to get from this node to the goal
}
Node.prototype.get = function () { 
	return this
}
Node.prototype.calculateCost = function (costs) {
	this.f = costs.f
	this.g = costs.g
}

function aStar (worldWidth, worldHeight) { 
	this.world = [[]]
	this.worldWidth = worldWidth
	this.worldHeight = worldHeight
	this.currentPath = []

	this.createEmpty()
}
aStar.prototype.createEmpty = function() { 
	for (var x = 0; x < this.worldWidth; x++) {
		this.world[x] = []
		for (var y = 0; y < this.worldHeight; y++) {
			this.world[x][y] = 0
		}
	}
}
aStar.prototype.setWalls= function(walls) {
	walls.forEach(w => this.world[w.pos.x][w.pos.y] = 1)
}
aStar.prototype.setStartPosition = function(x,y) { 
	this.startPosition = new Vector(x,y)
}
aStar.prototype.setTargetPosition = function(x,y) { 
	this.targetPosition = new Vector(x,y)
}
aStar.prototype.getPath= function() {
	var maxTries = 10
	while (this.currentPath.length === 0 && maxTries > 0) {
		this.currentPath = this.findPath()
		maxTries--
	}
	return this.currentPath
}
aStar.prototype.findPath = function () {
	var worldSize = this.worldWidth * this.worldHeight,
		pathStart = new Node(null, this.startPosition, this.worldWidth),
		pathStop = new Node(null, this.targetPosition, this.worldWidth),
		grid = new Array(worldSize),
		openNodes = [pathStart.get()],
		closedNodes = [],
		path = []

	while(openNodes.length) {
		var tmpPath = null,
			max = worldSize,
			min = -1

		openNodes.forEach((node, key) => {
			if (node.f < max) {
				max = node.f
				min = key
			}
		})

		// grab the next node and remove it from open nodes
		curNode = openNodes.shift()

		if (curNode.value === pathStop.value) { // The end of the path
			tmpPath = closedNodes[closedNodes.push(curNode) - 1]

			do {
				path.push(new Vector(tmpPath.x, tmpPath.y))
			} while (tmpPath = tmpPath.parent)

			grid = closedNodes = openNodes = []
			path.reverse() // reverse the array to get the correct pathline
		} else { // not the target destination

			// Loop through the node's neighbours
			this.getNeighbours(curNode).forEach(neighbour => {
				tmpPath = new Node(curNode, neighbour, this.worldWidth).get()
				if (!grid[tmpPath.value]) {
					tmpPath.calculateCost((function (currentNode, neighbour, tempPath, pathStop, astar) {
						return {
							g: currentNode.g + astar.manhattanDistance(neighbour, currentNode), // cost for the route this far
							f: tempPath.g + astar.manhattanDistance(neighbour, pathStop.get()) // cost for entire route
						}
					})(curNode, neighbour, tmpPath, pathStop, this))

					openNodes.push(tmpPath)
					grid[tmpPath.value] = true // mark this node in the world graph as visited
				}
			})

			closedNodes.push(curNode)
		}
	}
	path.shift() // remove the first element as it is the current position
	return path
}
aStar.prototype.manhattanDistance = function (point, goal) {
	var	abs = Math.abs
	return abs(point.x - goal.x) + abs(point.y - goal.y)
}
aStar.prototype.canWalkHere = function (x, y) {
	return (this.world[x] !== null && this.world[x][y] !== null && this.world[x][y] < 1)
}
aStar.prototype.getNeighbours = function (node) {
	var	neighbours = [],
		north = node.y - 1,
		south = node.y + 1,
		east = node.x + 1,
		west = node.x - 1

	if(north > -1 && this.canWalkHere(node.x, north))
		neighbours.push(new Vector(node.x, north))

	if(east < this.worldWidth && this.canWalkHere(east, node.y))
		neighbours.push(new Vector(east, node.y))

	if(south < this.worldHeight && this.canWalkHere(node.x, south))
		neighbours.push(new Vector(node.x, south))

	if(west > -1 && this.canWalkHere(west, node.y))
		neighbours.push(new Vector(west, node.y))

	return neighbours
}

function Wall (x,y) {
	this.pos = new Vector(x,y)
}
