import java.util.LinkedList;
import java.util.List;

/*
 * Given x, y, and z dimensions and a series of straight and bent snake cube pieces,
 * determines whether the sequence is solvable into a "cube" (rectangular prism)
 * and prints the coordinates of each piece if so.
 */
public class SnakeSolver {
	
	enum Dir {
		LEFT, RIGHT, DOWN, UP, IN, OUT
	};
	
	private static final String EXAMPLE = "3 3 3 001110110111010111101010100";
	
	/*
	 * Usage: "java Snake X Y Z [binary snake string]"
	 */
	public static void main(String input[]){
		String[] args;
		if(input.length < 4 || !isBinary(input[3])){
			System.out.println("Usage: \"java Snake X Y Z [binary snake string]\". Running example:");
			System.out.println("java Snake " + EXAMPLE + "\n");
			args = EXAMPLE.split(" ");
		} else args = input;
		int x = Integer.parseInt(args[0]);
		int y = Integer.parseInt(args[1]);
		int z = Integer.parseInt(args[2]);
		snake_cube_solution(x, y, z, args[3]);
	}
	
	/*
	 * Checks if the given string consists only of '0's and '1's
	 */
	private static boolean isBinary(String str){
		for(int i = 0; i < str.length(); i++){
			char ch = str.charAt(i);
			if(ch != '0' && ch != '1') return false;
		}
		return true;
	}
	
	/*
	 * Solves the given snake cube.
	 * includes input sanity checking:
	 * the input string must be binary, and x*y*z must equal the length of the string.
	 */
	public static void snakeCubeSolution(int x, int y, int z, String str){
		if(x * y * z != str.length()) {
			printFailureAndExit();
		}
		
		//special case: at least one dimension is 0. True only if input string is empty
		if(x == 0 || y == 0 || z == 0){
			if(str.length() == 0){
				System.out.println("1 (Vacuously solvable)");
				System.exit(0); 
			} else printFailureAndExit();
		}
		permuteSnakes(x, y, z, str);
		System.out.println("0");
	}
	
	/*
	 * Alternate method name to match problem spec.
	 * Redirects to snakeCubeSolution to maintain consistency of camelcase naming.
	 */
	public static void snake_cube_solution(int x, int y, int z, String str){
		snakeCubeSolution(x, y, z, str);
	}
	
	/*
	 * Generates permutations of snake cubes based on the input.
	 * The starting cube can face any direction, but is given to be located at (1,1,1).
	 */
	public static void permuteSnakes(int x, int y, int z, String str){
		boolean[][][] cube = new boolean[x][y][z];
		List<SnakePoint> path = new LinkedList<SnakePoint>();
		SnakePoint boundsOfCube = new SnakePoint(x,y,z);
		SnakePoint startingLoc = new SnakePoint(1,1,1);
		permuteSnakesRecursive(boundsOfCube, startingLoc, null, cube, path, str);
	}
	
	/*
	 * arrays are 0-indexed while SnakePoints are 1-indexed, 
	 * so these helper functions take care of getting and setting cube values
	 */
	private static boolean cubeGet(boolean[][][] cube, SnakePoint loc){
		return cube[loc.x - 1][loc.y - 1][loc.z - 1];
	}
	private static void cubeSet(boolean[][][] cube, SnakePoint loc, boolean value){
		cube[loc.x - 1][loc.y - 1][loc.z - 1] = value;
	}
	
	/*
	 * Recursively tries every way to turn the given string into a snake given the dimensions.
	 * Backtracks when it hits overlap or goes out-of-bounds.
	 * If neither happens before we reach the empty string, we must have a successful cube
	 * (since we check earlier that the number of chars in the string equals the number of cubes
	 * that fit within the given dimensions). Exits upon success.
	 */
	public static void permuteSnakesRecursive(SnakePoint cubeDim, SnakePoint loc, Dir dir, boolean[][][] cube, List<SnakePoint> path, String str){
		//check if finished
		if(str.length() == 0){
			printVictoryAndExit(path);
			System.exit(0);
		}
		//check for out-of-bounds
		if(loc.x <= 0 || loc.x > cubeDim.x) return;
		if(loc.y <= 0 || loc.y > cubeDim.y) return;
		if(loc.z <= 0 || loc.z > cubeDim.z) return;
		//check for overlap
		if(cubeGet(cube, loc)) return;
		
		//otherwise, enter recursive step:
		cubeSet(cube, loc, true);
		path.add(loc);
		
		String rest = str.length() > 1 ? str.substring(1) : "";
		char cur = str.charAt(0);
		if(cur == '1' || dir == null){
			for(Dir d : Dir.values()){
				SnakePoint next = step(loc, d);
				permuteSnakesRecursive(cubeDim, next, d, cube, path, rest);
			}
		} else {
			permuteSnakesRecursive(cubeDim, step(loc, dir), dir, cube, path, rest);
		}
		
		//undo alterations to cube and path to enable recursive backtracking
		cubeSet(cube, loc, false);
		path.remove(loc);
	}
	
	/*
	 * Prints a "0" indicating failure, and closes the program.
	 */
	private static void printFailureAndExit(){
		System.out.println("0");
		System.exit(0);
	}

	/*
	 * Prints a "1" indicating success, and prints the coordinates of the path taken by the cubes.
	 * Closes the program.
	 */
	private static void printVictoryAndExit(List<SnakePoint> path) {
		System.out.println("1");
		String coords = "Coordinates: ";
		for(int i = 0; i < path.size(); i++){
			if(i != 0) coords += ",";
			coords += path.get(i);
		}
		System.out.println(coords);
		System.exit(0);
	}

	/*
	 * Returns a new point one step in the given direction from the old point.
	 */
	private static SnakePoint step(SnakePoint pOld, Dir d) {
		SnakePoint p = new SnakePoint(pOld);
		switch(d){
			case LEFT: p.x--; break;
			case RIGHT: p.x++; break;
			case DOWN: p.y--; break;
			case UP: p.y++; break;
			case IN: p.z--; break;
			case OUT: p.z++; break;
		}
		return p;
	}
	
}
