/*

Welcome to the "Gameplay" section of the code for this project!

The purpose of this code is to interpret input from the user and use functions from the "Generate a Sudoku Solution" part to
display changes in the game to the user.

It does this by using the JQuery library and other methods of HTML to update the layout of the HTML webpage which displays this game.

*/

// This portion declares a few global variables which should not be changed by the user.

// When the game begins, the initial difficulty is "Hard" mode.
const defaultMode = 'hard';

// The user should not be able to access the "Dev Mode" which was used to test this game.
const developmentMode = !true;

// In the case that I ever expand this game to other dimensions of Sudoku-like grids, I want the grid size to be variable.
// However, for this project I kept the gridSize constant at 9x9.
const gridSize=9;

// This global variable can be changed by the user when they select a difficulty mode. Its default value is 'hard'.
// It is a global variable because I needed a way to keep track of the difficulty for different end states.
var difficulty = 'hard';

// This function serves as a placeholder for the 9x9 Sudoku grid so I did not have to refer to it by its ID in all of the following
// functions.
function grid() {
    return $("#sudoku-grid");
}

// This function updates the game board when the easy button is pressed by the user. It generates a random sudoku hint using that
// section of the code and updates the game board accordingly. It lets the user know that they have switched the difficulty by
// updating the end state div.
function easy() {
    populateGridWithData(generateRandomSudokuHint(0));
    console.log(gridData());
    console.log("After");
    clearEndState();
    addEndState("You have switched to easy mode.");
    difficulty = 'easy';
}
// This function updates the game board when the medium button is pressed by the user. It generates a random sudoku hint using that
// section of the code and updates the game board accordingly. It lets the user know that they have switched the difficulty by
// updating the end state div.
function medium() {
    populateGridWithData(generateRandomSudokuHint(1));
    console.log(gridData());
    console.log("After");
    clearEndState();
    addEndState("You have switched to medium mode.");
    difficulty = 'medium';
}
// This function updates the game board when the hard button is pressed by the user. It generates a random sudoku hint using that
// section of the code and updates the game board accordingly. It lets the user know that they have switched the difficulty by
// updating the end state div.
function hard() {
    populateGridWithData(generateRandomSudokuHint(2));
    console.log(gridData());
    console.log("After");
    clearEndState();
    addEndState("You have switched to hard mode.");
    difficulty = 'hard';
}
// This function gives the user an end state message when the check button is pressed by the user. It uses the isValidSudoku function
// to determine what problems exist in the grid and lets the player know accordingly. In the case that the user has finished, the
// function congratulates them based on the global difficulty variable.
function check() {
    console.log(gridData());
    console.log("Before");
    var endString = isValidSudoku(gridData());
    if(endString == "Congratulations!") {
      clearEndState();
      addEndState("Feel free to try again on another difficulty.");
      addEndState("Congratulations! You have beaten the game on " + difficulty + " mode!");
    } else {
      clearEndState();
      addEndState(endString);
    }
}
// This function controls the function of each of the buttons in the HTML page remotely from the Javascript source. While these
// commands could have been placed in the HTML page directly, I preferred to separate the Javascript source from the page itself.

// In the case that I wished to test the game with its 'Dev Mode', I could update the global variable and this function would
// show the corresponding dev mode buttons and give them their intended purposes.
function setupControls() {
    var controls=$("#sudoku-controls");
    var controlsHtml="";
    controlsHtml+="<button onclick='easy()'>easy</button>";
    controlsHtml+="<button onclick='medium()'>medium</button>";
    controlsHtml+="<button onclick='hard()'>hard</button>";
    controlsHtml+="<button onclick='check()'>check</button>";
    if (developmentMode) {
        controlsHtml+="<br/><br/><br/>";
        controlsHtml+="<button onclick='solvedPopulateGrid()'>load solution</button>";
        controlsHtml+="<button onclick='randomPopulateGrid()'>random</button>";
        controlsHtml+="<button onclick='populateGrid()'>clear</button>";
        for (var num = 1; num < gridSize+1 ; num++) {
            controlsHtml+="<button onclick='populateGrid("+num+")'>"+num+"</button>";
        }
    }

    controls.html(controlsHtml);
}

/*
This function sets the specified cell to the value that the user or the computer entered. It takes the object "info" as input.
The object "info" contains the position of the cell, the intended value of the cell, and whether the cell should be something which
could be edited by the user.
*/
function setCell(info) {
    $("#"+gridId(info.row,info.col)).val(info.value!==0?info.value:'');
    var disabled = false;
    if (info.disabled) {
        disabled = info.disabled;
    }
    $("#"+gridId(info.row,info.col)).prop( "disabled", disabled );
    $("#"+gridId(info.row,info.col)).removeClass('red');
    $("#"+gridId(info.row,info.col)).removeClass('preset');
    if (disabled) {
        $("#"+gridId(info.row,info.col)).addClass('preset');
    }

}

/*

This function creates a cell with an "editable" text box based on whether the computer specifies that the cell should be "editable"
by the user.

*/
function buildCell(info) {
    var id = gridId(info.row,info.col);
    var disabled = false;
    if (info.disabled) {
        disabled = info.disabled;
    }
    return "<input type='text' id='"+id+"' class='square' "+(disabled?'disabled':'')+" maxlength='1'>";

}

/*

This function sets up the grid by iterating over the size of the grid with the buildCell function. At first, all cells are
"editable".

*/

function setupGrid() {
    var gridHtml = "";

    for (var row = 0; row < gridSize ; row++) {
        for (var col = 0 ; col < gridSize; col++) {
            var id = gridId(row,col);
            gridHtml+=buildCell({row:row,col:col,disabled:false});
        }
        gridHtml+="<br/>";
    }
    grid().html(gridHtml);

};

/*
This function creates the "listener" functionality for the "editable" text boxes in the grid. It ensures that the user can only
input numbers into the grid and that when the user mouses over an "editable" cell, the color of the cell changes.
*/
function afterSetup() {
  $( ".square" ).mouseover(function() {
    $( this ).addClass('red');
    $( this ).focus();
    $( this ).select();
  });
  $( ".square" ).mouseout(function() {
      $( this ).removeClass('red');
    });
  $( ".square" ).keydown(function(event) {
  });
  $(".square").keydown(function (e) {

      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
          (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
          (e.keyCode >= 35 && e.keyCode <= 40)) {
               return;
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }
  });
}
/*
This cell creates an ID for a cell based on its 0-based row and column numbers.
*/
function gridId(row,col) {
    return 'row-'+row+'-col-'+col;
}
/*
This function populates the grid in a solved state when a button is pressed in the 'Dev Mode'.
*/
function solvedPopulateGrid() {
  populateGridWithData([[6, 1, 2, 3, 5, 4, 7, 9, 8],
    [8, 4, 3, 7, 9, 2, 6, 5, 1],
    [5, 7, 9, 6, 1, 8, 3, 2, 4],
    [2, 9, 8, 4, 7, 3, 5, 1, 6],
    [1, 5, 6, 2, 8, 9, 4, 3, 7],
    [7, 3, 4, 1, 6, 5, 9, 8, 2],
    [3, 6, 5, 8, 2, 7, 1, 4, 9],
    [9, 8, 1, 5, 4, 6, 2, 7, 3],
    [4, 2, 7, 9, 3, 1, 8, 6, 5]]);
}
/*
This function populates the grid with completely random potentially impossible values when a button is pressed in the 'Dev Mode'.
*/
function randomPopulateGrid() {
    for (var row = 0; row < gridSize ; row++) {
        for (var col = 0 ; col < gridSize; col++) {
            var randomNumber0to9 = Math.floor(Math.random()*(gridSize-0+1)+0);
            setCell({row:row,col:col,value:randomNumber0to9,disabled:randomNumber0to9!==0});
        }
    }
}
/*
This function populates all cells in the grid with the same number when a button is pressed in the 'Dev Mode'.
*/
function populateGrid(num) {
    var num = (num) ? num : 0;
    for (var row = 0; row < gridSize ; row++) {
        for (var col = 0 ; col < gridSize; col++) {
            var id = 'row-'+row+'-col-'+col;
            //$("#"+id).val(num);
            setCell({row:row,col:col,value:num,disabled:num!==0});
        }
    }
}
/*
This function clears the grid when a button is pressed in the 'Dev Mode'.
*/
function clearGrid() {
  populateGrid(0);
}
/*
This function populates the grid with a 9x9 square of data. Typically, this would be a sudoku solution with incomplete hints from
the other section of the code.
*/
function populateGridWithData(dat) {
  // 0 means blank
    for (var row in dat) {
        for (var col in dat[row]) {
            var value = dat[row][col];
            if (value === 0) {
                value = '';
            }
            setCell({row:row,col:col, value:value, disabled:(value !== '')});
        }

    }
}

/*
This function provides a quarter second delay as the page loads the grid and other parts of this program.
*/

setTimeout(function() {

    setupControls();
    setupGrid();
    afterSetup();
}, 250);

/*
This function returns a 9x9 array with the values in the grid.
*/

function gridData() {
  var gridNumbers = [];
  for(var r in range(9)) {
    var tempRow = [];
    for (var c in range(9)) {
      var tempId = gridId(r,c);
      var v = $("#"+tempId);
      var value = v.val();
      if (value === '') {
        value = 0;
      } else {
        value = parseInt(value);
      }
      tempRow.push(value);
    }
    gridNumbers.push(tempRow);
  }
  console.log(JSON.stringify(gridNumbers));
  return gridNumbers;
}

/*
This function adds text to the End State div.
*/

function addEndState(msg) {
  $("#sudoku-end-state").html(msg+"<br/>"+$("#sudoku-end-state").html());
}
/*
This function clears text in the End State div.
*/
function clearEndState() {
  $("#sudoku-end-state").html('');
}
/*
These method calls set the initial game conditions.
*/
clearEndState();
addEndState("Please choose a game difficulty.");
addEndState("The grid is currently cleared.");
clearGrid();
