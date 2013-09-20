A* and PriorityQueue
====================
Implementations of the A* pathfinding algorithm and a PriorityQueue data structure used by the algorithm.

PriorityQueue
-------------
API:
```
new PriorityQueue(compareFn)
    compareFn: function(a, b), returns true if a comes before b (strict ordering)
push(value, priority)
pop()
peek()
remove(value)
move(value, newPriority)
size()
empty()
clear()
```

A*
--
```
function A_star(all, start, target, options)
 *
 * {Location} can be any object that works with ===. Just make sure your grid, start, and target are all {Location}s.
 *
 * @param {Array.Location} all       array of all possible grid locations
 * @param {Location} start           the starting location
 * @param {Location} target          the ending location
 * @param {Object} options :
 * @returns {Array.location} path    the path from start (exclusive) to target (inclusive)
 *      neighbors: function(Location) => {Array.Location}   produces all viable neighbors.
 *          Default: assumes Location is a [x,y] tuple on a rectangular grid.
 *      heuristic: function(Location) => {Number}           a function that "guesses" the distance and never overestimates
 *          (for example, Manhattan distance on a rectangular grid)
 *          Default: always guesses 0. This reduces A* to Dijkstra's algorithm.
 *      cost: function(Location) => {Number}                a function that calculates the movement cost through the given location.
 *          Default: all Locations cost 1 to move through.
```

MIT License
-----------
Use them if you want them!
