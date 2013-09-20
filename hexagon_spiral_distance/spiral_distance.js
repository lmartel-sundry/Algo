var EXPLAIN = true;

function explain(msg){
    if(EXPLAIN) console.log(msg);
}

function getDistance(){
    var start = parseInt($(".start").val());
    var end = parseInt($(".end").val());
    var dist = distance(start, end);
    if(!isNaN(start) && !isNaN(end)) $(".results").append("<li>Distance from " + start + " to " + end + " is " + dist + ".</li>");
    return false;
}

/**
 * Finds the distance between two hexagons by converting the spiral coordinate
 * to axial coordinates.
 *
 * The DIRECTION enumeration (used below) encapsulates the axial coordinate system.
 * You can think of a hexagonal grid as a "sideways view" (isomorphic projection)
 * of a 3D grid of cubes (there are many optical illusions online which illustrate this,
 * see http://en.wikipedia.org/wiki/File:Rhombic_star_tiling.png).
 * Thus we can create a 3-axis coordinate system by using a grid of cubes and then intersecting
 * the grid of cubes with a diagonal plane--for convenience, x + y + z = 0. This makes two things
 * easier.
 * First, we can leave the third coordinate implicit (since z = 0 - x - y), and second,
 * we can very easily calculate distances. Given that the distance between hexagons in the
 * picture above is 1, the grid distance (distance moving only parallel to axes) between cubes
 * is 2. An easy way to see this is to note that the hexagons created by the cubes seem to overlap,
 * hence the optical illusion, so we only look at half of the cubes at once. Grid distances in a
 * cubic grid are easy: abs(dx) + abs(dy) + abs(dz). Just divide that by two to get the hex distance.
 * @param start           start hex number
 * @param end             end hex number
 * @returns {number}      distance between them
 */
function distance(start, end){
    if(start > 0 && end > 0){
        explain("|----------------------------------------|");
        explain("Calculating distance between " + start + " and " + end + ":");
        // Step one: convert to axial coordinates
        var startCoords = findAxialCoordinates(start);
        var endCoords = findAxialCoordinates(end);
        // Step two: find axial delta
        var delta = endCoords.sub(startCoords);
        // Step three: convert to cubic coordinates
        var x = delta.q;
        var y = delta.r;
        var z = 0 - x - y;
        // Step four: get the distance!
        var distance = (Math.abs(x) + Math.abs(y) + Math.abs(z)) / 2;
        explain("The distance between " + start + " and " + end + " is " + distance);
        explain("|----------------------------------------|");
        return distance;
    } else {
        throw "hex numbers must be positive";
    }
}

function findAxialCoordinates(targetHexNum){
    explain("Calculating axial coordinates of hex #" + targetHexNum);
    // Step one: find the ring number of the hexagon.
    var ringNum = calcRingNum(targetHexNum);
    // Step two: find the largest numbered hex in that ring.
    var curHexNum = calcCenteredHexNum(ringNum);
    // Notice that the largest hex in the ring is always on the straight line
    // southeast of hex #1. Thus, we know its exact coordinates from its ring number:
    var curHexCoords = new Pair(ringNum - 1, 0);
    // From here, we can traverse the ring using simple math until we land on our target hexagon.
    // To traverse, we walk ringNum-1 steps in each direction in order (N, NW, SW, S, SE, NE) until
    // we find the target hexagon.
    for(var i = Pair.DIRECTION.START; i < Pair.DIRECTION.END; i++){
        var delta = curHexNum - targetHexNum;
        if(delta === 0) break;
        var dir = Pair.DIRECTION[i];
        var steps = Math.min(delta, ringNum - 1);
        var walkVector = dir.offset.mult(steps);
        var newHexCoords = curHexCoords.add(walkVector);
        explain("Walking " + steps + " steps " + dir.name + " from " + curHexCoords.toString() + " to " + newHexCoords.toString());
        curHexCoords = newHexCoords;
        curHexNum -= steps;
    }
    explain("Found hex #" + curHexNum + " at coordinates " + curHexCoords.toString());
    return curHexCoords;
}

/**
 * Given a spiral hex number we can calculate which "ring" a hex is in
 * (where #1 is in ring 1, #s 2-7 are in ring 2, etc) by reversing the
 * formula for the centered hexagonal number (think of triangular numbers
 * but with hexagons). See http://en.wikipedia.org/wiki/Centered_hexagonal_number.
 * 3r^2 - 3r + 1 = n,
 * where r is the ring number and n is the hex number.
 * Solve for r using the quadratic formula.
 * Round up (since #s 2-7 are all in ring 2, but the second centered hexagonal number is 7).
 * @param n             the hex number
 * @returns {number}    its ring number
 */
function calcRingNum(n){
    var r = Math.ceil(positiveRoot(3, -3, 1 - n));
    explain("Using centered hexagonal numbers, hex #" + n + " is in ring #" + r);
    return r;
}

/**
 * The same formula in the other direction:
 * ring number -> centered hex number, which in the context of this
 * problem is the highest hex number still in ring #r.
 * @param r             ring number
 * @returns {number}    the centered hex number
 */
function calcCenteredHexNum(r){
    var n = (3 * (r * r)) - (3 * r) + 1;
    explain("Using centered hexagonal numbers, hex #" + n + " is the last hex in ring #" + r);
    return n;
}

/**
 * Notice that 3x^2 - 3x + (1 - n) = 0 for n >= 1
 * is a downward shift of the upward-facing parabola
 * 3x^2 - 3x = 0 which has x-intercepts at 0 and 1.
 * Therefore there will always be one negative and one
 * positive root, so we can blindly throw out the smaller root
 * since we only want positive roots.
 * 0 and 1.
 * @param a
 * @param b
 * @param c
 * @returns {number}
 */
function positiveRoot(a, b, c){
    var disc = (b * b) - (4 * a * c);
    return ((-b) + Math.sqrt(disc))/(2 * a);
}

/**
 * A simple Pair class to make calculations easier.
 * @param q     coordinate 1
 * @param r     coordinate 2
 * @constructor
 */
function Pair(q, r){
    this.q = q;
    this.r = r;
}

/**
 * The DIRECTION enumeration includes six direction vectors and the dimensions of those vectors in axial
 * coordinates.
 */
(function(){
    var DIRECTION = {
        N: { value: 0, name: "north", offset: new Pair(0, -1) },
        NW: { value: 1, name: "northwest", offset: new Pair(-1, 0) },
        SW: { value: 2, name: "southwest", offset: new Pair(-1, 1) },
        S: { value: 3, name: "south", offset: new Pair(0, 1) },
        SE: { value: 4, name: "southeast", offset: new Pair(1, 0) },
        NE: { value: 5, name: "northeast", offset: new Pair(1, -1) }
    };
    // Set up reverse mapping for DIRECTION lookup
    for(var dirName in DIRECTION){
        if(!DIRECTION.hasOwnProperty(dirName)) continue;
        var dir = DIRECTION[dirName];
        DIRECTION[dir.value] = dir;
    }
    DIRECTION.START = 0;
    DIRECTION.END = 6;

    Pair.DIRECTION = Object.freeze(DIRECTION);

    Pair.prototype.add = function(p2){
        return new Pair(this.q + p2.q, this.r + p2.r);
    };

    Pair.prototype.sub = function(p2){
        return new Pair(this.q - p2.q, this.r - p2.r);
    };

    Pair.prototype.mult = function(n){
        return new Pair(this.q * n, this.r * n);
    };

    Pair.prototype.toString = function(){
        return "(" + this.q + ", " + this.r + ")";
    }

})();
