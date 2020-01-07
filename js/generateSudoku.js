/*

Welcome to the "Generating a Sudoku Grid" section of the Javascript code for this project!

In this section, I will use a variety of different algorithms to randomly generate the solution to a sudoku grid.

After generating the solution to a sudoku grid, I will randomly remove some number of squares from the solution.
The number of squares which will be removed depends on the difficulty chosen in the "Gameplay" section of the code.

The main difficulty here is that, according to wikipedia, there are 6,670,903,752,021,072,936,960 different possible solutions.
As a result, I had to be creative in the way that I generated a Sudoku Solution.

*/


// The first section of this code declares a number of different global variables whose values will be constant in the program.
// These global variables will make the process of generating Sudoku grids much faster, despite the fact that these lists may take
// up to a second to be created.

// To simplify the process of generating a Sudoku grid, I began by assuming the top row was simply 1,2,3,4,5,6,7,8,9, as shown below.
var baseRow = [1,2,3,4,5,6,7,8,9];

// Because each row is a rearrangement of the base row, I made a list of all of the permutations of 1,2,3,4,5,6,7,8,9.
var allNinePermutations = allPermutations(baseRow);

// Because each row after the base row is a derangement of the base row, I made a list of all of the derangements of the base row.
//A "derangement" of a sequence is a rearrangement of the sequence where no elements keep their original position.
var allNineDerangements = generateAllDerangements(baseRow,allNinePermutations);

// To deal with the requirement that no two squares in any 3x3 square can be the same, I made a list of sequences which
// do not share any first three values with the first three values of the base row, and the same is true for the next three
// squares and the last three squares.
var allNineThreeRows = generateAllThreeRows(baseRow,allNineDerangements);


/*
This function recursively generates all of the rearrangements of the elements in an array "set" by first finding rearrangements of
subsets of the array and then appending earlier elements in different positions to those subsets.

This function is used to find all of the rearrangements of the base row in the global variables.
*/
function allPermutations(set) {
	var l = set.length;
	if(l === 0) {
		return [];
	}
	if(l === 1) {
		return [set];
	}
	var a = allPermutations(set.slice(1,l));
	var b = set[0];
	var myLength = a[0].length;
	var t = [];
	var v = a.length;
	var c = 0;
	while(c<v) {
		var x = a[c];
		var d = 0;
		while(d<=myLength) {
			var e = x.slice(0,d);
			e.push(b);
			e = e.concat(x.slice(d,myLength));
			t.push(e);
			d+=1;
		}
		c+=1;
	}
	return t;
}

/*
This function recursively generates all of the subsets of an array "set" with "l" elements by first finding subsets of smaller
arrays and then potentially appending earlier elements to those subsets.

This function is later used to select possible subsets of squares to remove from a completed Sudoku solution to create an
incomplete hint.
*/
function generateSubsets(set,l) {
	if(l == 0){
		return [[]];
	}
	if(set.length < l){
		return [];
	}
	if(set.length === l) {
		return [set];
	}
	var v = set[0];
	var rest = set.slice(1,set.length);
	var total = generateSubsets(rest,l);
	var smallSets = generateSubsets(rest,l-1);
	var c = 0
	while(c<smallSets.length) {
		var x = smallSets[c];
		x.push(v);
		total.push(x);
		c += 1;
	}
	return total;
}

/*
This function checks if the array "a" is a "derangement" of the array "b" by iterating through each of the elements of "a" and
checking if they are the same as the corresponding elements in "b".

A "derangement" is a rearrangement where no element maintains its original position.
*/
function isDerangement(a,b) {
	if(a.length!==b.length) {
		return false;
	}
	var c = 0;
	while(c<a.length) {
		if(a[c]===b[c]) {
			return false;
		}
		c+=1
	}
	return true;
}

/*
This function uses the "isDerangement" function to run through the list of "permutations" of the array "set" and make a list
of the ones which are derangements of "set".

This was used earlier to find all of the derangements of the base row in the global variables.
*/
function generateAllDerangements(set,permutations) {
	var v = permutations;
	var t = [];
	var c = 0;
	while(c<v.length) {
		if(isDerangement(v[c],set)) {
			t.push(v[c]);
		}
		c+=1;
	}
	return t;
}

/*
This function implements a feature in the language Python which makes iteration with "for in" or "for each" or "for of" loops
simpler.

Specifically, range(x,y) returns a list of the integers from x to y-1, or x,x+1,...,y-2,y-1.

It is used in many of the other functions in this code to make iteration simpler.

In the case where y is undefined, such as when range(a) is called without a second parameter, the function only returns the list
0,1,2,...,a-1
*/
function range(x,y) {
	if(y===undefined) {
		var n = []
		var c = 0;
		while(c<x) {
			n.push(c);
			c+=1;
		}
		return n;
	} else {
		var n = [];
		var c = x;
		while(c<y) {
			n.push(c);
			c+=1;
		}
		return n;
	}
}

/*
This function checks if two rows "a" and "b" can be in the same set of three consecutive rows in a Sudoku solution.

In order for this condition to be satisfied, "a" must be a derangement of "b", none of the first three elements of "a" can
be the same as any of the first three elements of "b", none of the next three elements of "a" can be the same as any of the next
three elements of "b", and none of the last three elements of "a" can be the same as any of the last three elements of "b".

This function is later used to make sure that the 3x3 square condition of Sudoku grids is satisfied.
*/
function potInThreeRows(a,b) {
	if(isDerangement(a,b)===false) {
		return false;
	}
	for (var x of range(3)) {
		for (var y of range(3)) {
			if(a[x]==b[y]) {
				return false;
			}
		}
	}
	for (var d of range(3,6)) {
		for (var e of range(3,6)) {
			if(a[d]==b[e]) {
				return false;
			}
		}
	}
	for (var f of range(6,9)) {
		for (var g of range(6,9)) {
			if(a[f]==b[g]) {
				return false;
			}
		}
	}
	return true;
}

/*
This function uses the "potInThreeRows" function to run through a list of "derangements" of an array "set" and make a list of the
ones which could be in the same set of three rows as "set".

It is used in the global variables to make a list of such derangements of 1,2,3,4,5,6,7,8,9.
*/
function generateAllThreeRows(set,derangements) {
	var total = []
	var c = 0;
	while(c<derangements.length) {
		var x = derangements[c];
		if(potInThreeRows(set,x)) {
			total.push(x);
		}
		c+=1;
	}
	return total;
}

/*
This function generates a random element of a list using the builtin Math.random function.

The function is later used to generate random rows while generating Sudoku solutions.
*/
function generateRandom(myList) {
	var l = myList.length;
	var r = Math.floor(l*Math.random());
	var i = myList[r];
	return i;
}

// This function generates a random permutation of 1,2,3,4,5,6,7,8,9. While it is not used in the game, it was used for testing
// purposes.
function generatePermutation() {
	return generateRandom(allNinePermutations);
}

// This function generates a random derangement of 1,2,3,4,5,6,7,8,9. While it is not used in the game, it was used for testing
// purposes.
function generateDerangement() {
	return generateRandom(allNineDerangements);
}

// This function generates a random derangement of 1,2,3,4,5,6,7,8,9 which could be in the same set of three rows.
// While it is not used in the game, it was used for testing purposes.
function generateThreeRows() {
	return generateRandom(allNineThreeRows);
}

/*
This function makes a copy of the values in the array "set" and stores them in a new list which does not retain the references
of the original list. This allows me to alter values in copies of old lists without losing the values in those old lists.
*/

function arrayCopy(set) {
	return set.slice(0);
}

/*
This is the function that finally incorporates all of the above functions to make a random sudoku solution where the top row is
the global base row.

It begins by making a cumulative list of remaining derangements of all of the rows which are already in the list.
In addition, it makes a cumulative list of remaining derangements which could be in the same set of three rows as previous rows.

Then, it iterates over all 9 rows. Whenever the row number is 1 more than a multiple of 3, a new set of three consecutive rows is
created, and as a result, the cumulative list of "three row" derangements must be recreated. Otherwise, the list must only be
updated. At every step, the cumulative list of derangements must be updated.

It is possible that this process will result in no possible sudoku grids. In this case, the function is called again within itself
until the process finishes. Perhaps with a different algorithm this potential infinite recursion could be fixed.
*/
function generateTopRowSudoku() {
	var wholeSudoku = [baseRow];
	var tempDerangements = arrayCopy(allNineDerangements);
	var tempThreeRow = arrayCopy(allNineThreeRows);
	var c = 2;
	while(c<=9) {
		if(c%3!==1) {
			if(tempThreeRow.length===0) {
				return generateTopRowSudoku();
			}
			var tempRow = generateRandom(tempThreeRow);
			var old = arrayCopy(tempDerangements);
			tempDerangements = [];
			for (var a of old) {
				if(isDerangement(a,tempRow)) {
					tempDerangements.push(a);
				}
			}
			old = arrayCopy(tempThreeRow);
			tempThreeRow = [];
			for (var a of old) {
				if(potInThreeRows(a,tempRow)) {
					tempThreeRow.push(a);
				}
			}
		} else {
			if(tempDerangements.length===0) {
				return generateTopRowSudoku();
			}
			var tempRow = generateRandom(tempDerangements);
			var old = arrayCopy(tempDerangements);
			tempDerangements = [];
			for (var a of old) {
				if(isDerangement(a,tempRow)) {
					tempDerangements.push(a);
				}
			}
			tempThreeRow = [];
			for (var a of tempDerangements) {
				if(potInThreeRows(a,tempRow)) {
					tempThreeRow.push(a);
				}
			}
		}
		wholeSudoku.push(tempRow);
		c+=1;
	}
	return wholeSudoku;
}

/*
This function finally generates a random sudoku from the list of 6,670,903,752,021,072,936,960. It does so by randomly choosing a
base row sudoku solution with the generateTopRowSudoku function, and then it chooses a random permutation of 1,2,3,4,5,6,7,8,9 to
rearrange the top row.

At long last, we have a function that can quickly generate a solution to sudoku.
*/
function generateRandomSudoku() {
	var mapper = generatePermutation();
	var b = generateTopRowSudoku();
	var newList = [];
	for (var a of b) {
		var tempRow = [];
		for (var x of a) {
			tempRow.push(mapper[baseRow.indexOf(x)]);
		}
		newList.push(tempRow);
	}
	return newList;
}

/*
This function uses the "generateRandomSudoku" function to generate a random solution to sudoku and then based on the "difficulty",
it removes some number of random squares from the sudoku solution.

A difficulty of 0 corresponds to easy mode, a difficulty of 1 corresponds to medium mode, and a difficulty of 2 corresponds to hard
mode. In easy mode, 1-2 squares are randomly removed from each 3x3 square. In medium mode, 3-6 squares are randomly removed from each
3x3 square. in hard mode, 5-7 squares are randomly removed from each 3x3 square.
*/
function generateRandomSudokuHint(difficulty) {
	var solution = generateRandomSudoku();
	if(difficulty === 0) {
		var bounds = [1,2];
	} else if (difficulty === 1) {
		var bounds = [3,6];
	} else {
		var bounds = [5,7];
	}
	var subsets = [];
	var c = bounds[0];
	while(c<=bounds[1]) {
		var z = generateSubsets([1,2,3,4,5,6,7,8,9], c);
		for (var x of z) {
			subsets.push(x);
		}
		c+=1;
	}
	var newList = [];
	for (var a of range(9)) {
		var tempRow = [];
		for (var b of range(9)) {
			tempRow.push(0);
		}
		newList.push(tempRow);
	}
	for (var a of range(3)) {
		for (var b of range(3)) {
			var x = 3*a;
			var y = 3*b;
			var mySubset = generateRandom(subsets);
			for(var c of range(3)) {
				for(var d of range(3)) {
					var v = 3*c+d+1;
					if(mySubset.includes(v) === false) {
						newList[x+c][y+d] = solution[x+c][y+d];
					}
				}
			}
		}
	}
	return newList
}
/*
This function takes "array" and creates a new list which contains all of the same elements as "array" but with repeats removed.

It is used in the "isValidSudoku" function to check whether repeats exist, as an array will only differ from the result of this
function if repeats exist.
*/
function arrayToSet(array) {
	var distinct = [];
	for (var a of array) {
		if(distinct.includes(a) === false) {
			distinct.push(a);
		}
	}
	return distinct;
}

/*
This method uses the arrayToSet method to check whether a given 9x9 "grid" is a valid Sudoku solution.

Essentially, it checks whether each winning condition is met and returns the first rule violation it finds unless the grid is
correct, in which case it returns "Congratulations!". This method will be used to return end states in the "Gameplay" section.
*/
function isValidSudoku(grid) {
	if(grid.length!=9) {
		return "Error: The Sudoku Grid has invalid dimensions.";
	}
	for (var a of grid) {
		if(a.length!=9) {
			return "Error: The Sudoku Grid has invalid dimensions.";
		}
	}
	for(var r of range(9)) {
		var tempRow = [];
		for(var c of range(9)) {
			tempRow.push(grid[r][c]);
		}
		var myRow = arrayToSet(tempRow);
		if(myRow.includes(0)) {
			return "You have not filled in all of the cells in row " + (r+1) + " from the top.";
		} else if (myRow.length!=9) {
			return "You have multiple cells with the same value in row " + (r+1) + " from the top.";
		}
	}
	for(var c of range(9)) {
		var tempCol = [];
		for(var r of range(9)) {
			tempCol.push(grid[r][c]);
		}
		var myCol = arrayToSet(tempCol);
		if(myCol.includes(0)) {
			return "You have not filled in all of the cells in column " + (c+1) + " from the left.";
		} else if (myCol.length!=9) {
			return "You have multiple cells with the same value in column " + (c+1) + " from the left.";
		}
	}
	for(var a of range(3)) {
		for(var b of range(3)) {
			var x = 3*a;
			var y = 3*b;
			var tempSquare = [];
			for(var c of range(3)) {
				for(var d of range(3)) {
					tempSquare.push(grid[x+c][y+d]);
				}
			}
			var mySquare = arrayToSet(tempSquare);
			if(mySquare.length!=9) {
				if(a==0 && b==0) {
					return "You have multiple cells with the same value in the top left 3x3 square.";
				} else if(a==0 && b==1) {
					return "You have multiple cells with the same value in the top 3x3 square.";
				} else if(a==0 && b==2) {
					return "You have multiple cells with the same value in the top right 3x3 square.";
				} else if(a==1 && b==0) {
					return "You have multiple cells with the same value in the left 3x3 square.";
				} else if(a==1 && b==1) {
					return "You have multiple cells with the same value in the center 3x3 square.";
				} else if(a==1 && b==2) {
					return "You have multiple cells with the same value in the right 3x3 square.";
				} else if(a==2 && b==0) {
					return "You have multiple cells with the same value in the bottom left 3x3 square.";
				} else if(a==2 && b==1) {
					return "You have multiple cells with the same value in the bottom 3x3 square.";
				} else {
					return "You have multiple cells with the same value in the bottom right 3x3 square.";
				}
			}
		}
	}
	return "Congratulations!";
}
