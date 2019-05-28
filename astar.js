class Vector {

    constructor (x,y) {
        this.x = x
        this.y = y
    }
}

class Node {

    constructor (parent, vector, worldWidth) {
        this.parent = parent
        this.x = vector.x
        this.y = vector.y
        this.worldWidth = worldWidth
        this.value = this.x + (this.y * worldWidth)
        this.f = 0 // the cost to get to this node from the start
        this.g = 0 // The cost to get from this node to the goal
    }

    calculateCost (costs) {
        this.f = costs.f
        this.g = costs.g
    }

    toVector () {
        return new Vector(this.x, this.y)
    }

}

class Astar {
    
    constructor (worldWidth, worldHeight) {
        this.world = []
        this.worldWidth = worldWidth
        this.worldHeight = worldHeight

        this.createEmpty()
    }

    /**
     * Creates the outline of the worldmap
     */
    createEmpty () {
        for (var y = 0; y < this.worldHeight; y++) {
            this.world[y] = []
            for (var x = 0; x < this.worldWidth; x++) {
                this.world[y][x] = 0
            }
        }
    }

    /**
     * Sets collision map
     * 
     * @param obstacles  
     */
    setObstacles (obstacles) {
        for (let obstacle of obstacles) {
            this.world[obstacle.y][obstacle.x] = 1
        }
    }

    /**
     * Gets path between two vectors with 10 attempts
     * 
     * @param fromPos 
     * @param toPos 
     */
    getPath (fromPos, toPos) {
        // Try a maximum of 10 times to get the path
        var builtPath = [],
            maxTries = 10
        while (builtPath.length === 0 && maxTries > 0) {
            builtPath = this._findPath(fromPos, toPos)
            maxTries--
        }
        return builtPath
    }

    /**
     * Finds the path between two points
     * 
     * @param {x, y} fromPos 
     * @param {x, y} toPos 
     */
    _findPath (fromPos, toPos) {
        const worldSize = this.worldWidth * this.worldHeight,
              pathStartNode = new Node(null, fromPos, this.worldWidth),
              pathStopNode = new Node(null, toPos, this.worldWidth),
              grid = new Array(worldSize),
              openNodes = [pathStartNode],
              closedNodes = [],
              path = []
        
        while (openNodes.length) {
            const curNode = openNodes.shift()

            // Check if the current node is at the end of the path
            if (curNode.value === pathStopNode.value) {
                var end = closedNodes[closedNodes.push(curNode) - 1]

                do {
                    path.push(end.toVector())
                } while (end = end.parent)

                grid.length = closedNodes.length = openNodes.length = 0
                path.reverse()
            } else {
                const neighbours = this.getNeighbours(curNode)
                for (let neighbour of neighbours) {
                    const nNode = new Node(curNode, neighbour, this.worldWidth)
                    if (!grid[nNode.value]) {
                        nNode.calculateCost({
                            g: curNode.g + this.manhattanDistance(neighbour, curNode),
                            f: nNode.g + this.manhattanDistance(neighbour, pathStopNode)
                        })

                        openNodes.push(nNode)

                        // mark this node in the world graph as visited
                        grid[nNode.value] = true
                    }
                }

                closedNodes.push(curNode)
            }
        }

        // remove the first element as it is the current position
        path.shift()
        return path
    }

    /**
     * Calculate manhattan distance between two nodes
     * @param point 
     * @param goal 
     */
    manhattanDistance (point, goal) {
        return Math.abs(point.x - goal.x) + Math.abs(point.y + goal.y)
    }
    
    /**
     * Gets neighbours of a node
     * @param node 
     */
    getNeighbours (node) {
        const neighbours = [],
              positionsToCheck = [
                  new Vector(node.x, node.y - 1), // North
                  new Vector(node.x + 1, node.y), // West
                  new Vector(node.x, node.y + 1), // South
                  new Vector(node.x - 1, node.y), // East
              ]

        for (let pos of positionsToCheck) {
            if (pos.y >= 0 && pos.y < this.worldHeight && pos.x >= 0 && pos.x < this.worldWidth && this.world[pos.y][pos.x] === 0) {
                neighbours.push(pos)
            }
        }

        return neighbours
    }

    graph (path) {
        const lines = []
        for (let y = 0; y < this.worldHeight; y++) {
            const line = []
            for (let x = 0; x < this.worldWidth; x++) {
                if (this.world[y][x] === 1) {
                    line.push`X`
                } else {
                    const pathTrail = path.find(trail => trail.x === x && trail.y === y)
                    if (pathTrail)
                        line.push`#`
                    else
                        line.push`O`
                }
            }

            lines.push(line.join``)
        }

        return lines.join("\n")
    }

}
