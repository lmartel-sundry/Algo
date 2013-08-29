/**
* PriorityQueue implementation by Leo Martel (http://lpm.io)
* Use it if you want it; MIT License.
*/

PriorityQueue = _PriorityQueue;
function _PriorityQueue(compare){
    this.heap = new Array(11);
    this.length = 0;
    this.compare = compare || function(a, b){
        return a < b;
    }
}

(function(){
    PriorityQueue.prototype.push = push;
    function push(elem, priority){
        var child = new Node(elem, priority);
        var ci = this.length + 1;
        set(this, ci, child);
        this.length += 1;
        while(true){
            var pi = parentIndex(ci);
            var parent = get(this, pi);
            if(!parent || this.compare(parent.priority, child.priority)) break;
            set(this, pi, child);
            set(this, ci, parent);
            ci = pi;
        }
    }

    PriorityQueue.prototype.pop = pop;
    function pop(){
        if(this.length === 0) return undefined;
        var root = get(this, 1);
        set(this, 1, undefined);

        var parent = get(this, this.length);
        var pi = 1;
        set(this, pi, parent);
        set(this, this.length, undefined);
        this.length -= 1;
        while(true){
            var lci = leftChildIndex(pi);
            var lchild = get(this, lci);

            var rci = rightChildIndex(pi);
            var rchild = get(this, rci);

            var canLeft = lchild && !this.compare(parent.priority, lchild.priority);
            var canRight = rchild && !this.compare(parent.priority, rchild.priority);

            if(canLeft && canRight){
                if(this.compare(lchild.priority, rchild.priority)){
                    swapLeft(this);
                } else {
                    swapRight(this);
                }
            } else if(canLeft){
                swapLeft(this);
            } else if(canRight){
                swapRight(this);
            } else break;
        }
        return root.elem;

        function swapLeft(context){
            set(context, pi, lchild);
            set(context, lci, parent);
            pi = lci;
        }

        function swapRight(context){
            set(context, pi, rchild);
            set(context, rci, parent);
            pi = rci;
        }

    }
    PriorityQueue.prototype.peek = peek;
    function peek(){
        if(this.length === 0) return undefined;
        return get(this, 1).elem;
    }

    PriorityQueue.prototype.size = size;
    function size(){
        return this.length;
    }

    PriorityQueue.prototype.empty = empty;
    function empty(){
        return this.length === 0;
    }

    PriorityQueue.prototype.clear = clear;
    function clear(){
        this.heap = new Array(11);
        this.length = 0;
    }

    function set(context, k, node){
        context.heap[k - 1] = node;
    }

    function get(context, k){
        return context.heap[k - 1];
    }

    function parentIndex(k){
        return Math.floor(k/2);
    }

    function leftChildIndex(k){
        return 2 * k;
    }

    function rightChildIndex(k){
        return 2 * k + 1;
    }


    function Node(elem, priority){
        this.elem = elem;
        this.priority = priority;
        this.left = null;
        this.right = null;
    }
})();