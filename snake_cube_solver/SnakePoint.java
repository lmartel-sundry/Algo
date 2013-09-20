/*
 * Simple helper class: a 3D point with pretty printing.
 */

class SnakePoint {
		public int x;
		public int y;
		public int z;
		
		public SnakePoint(int x, int y, int z){
			this.x = x;
			this.y = y;
			this.z = z;
		}
		
		public SnakePoint(SnakePoint p){
			x = p.x;
			y = p.y;
			z = p.z;
		}
		
		@Override
		public String toString(){
			return "(" + x + "," + y + "," + z + ")";
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			SnakePoint other = (SnakePoint) obj;
			if (x != other.x)
				return false;
			if (y != other.y)
				return false;
			if (z != other.z)
				return false;
			return true;
		}
	}