/*
A basic implementation of John Conway's Game of Life CA based on Daniel Shiffman Coding Challenge in P5js

Main Implementation includes user interaction:
click and drag the mouse to effect cell's state, click + drag + keypress to add red barriers

Minor implementations:
1_ avoid creating a new array each frame but, instead swapping just two arrays
2_ populate the grid with cell objects insetead of simple numeric values for future implementations
*/



// 1_a_ define a custom function to bult an empty 2D array with nothing in it
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

let grid;
let cols;
let rows;
let resolution = 10;

let next;

function setup() {
  //createCanvas(600, 400);
  createCanvas(windowWidth, windowHeight);
  setColsRows();
  init();
}


function draw() {
  //frameRate(2);
  background(0);
  // 1_d_ render the grid
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      //rect(x * resolution - 1, y * resolution - 1, s, s);
      grid[x][y].show(); //
    }
  }
  //Compute next based on current grid
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let state = grid[x][y].state; // state equals the atcual value in the cell

      // Count live neighbors!
      let neighbors = countNeighbors(grid, x, y);
      if (state == 0 && neighbors == 3) {
        // alive
        next[x][y] = 1; // in the generation cycle I am alive!
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        // dead
        next[x][y] = 0; // in the generation cycle I am dead!
      } else {
        next[x][y] = state;
      }
    }
  }
  // update each cell state_
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      grid[x][y].update(next[x][y]);
    }
  }
}

function countNeighbors(grid, x, y) {
  let sum = 0; // the initial sum of alive neighbors around each and every single cell
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (i + x + cols) % cols; // the extra "+ cols" is for shifting values preventing negative values to be counted by the modulus operator, as -1 % 10 = -1 and it is causing an error
      let row = (j + y + rows) % rows; // the extra "+ rows" is for shifting values preventing negative values to be counted by the modulus operator, as -1 % 10 = -1 and it is causing an error
      sum += grid[col][row].state;
    }
  }
  sum -= grid[x][y].state; // subtracting the current cell's value from the summatory
  return sum;
}


// reset board when mouse is pressed
function mouseDragged() {
  let x = Math.round(mouseX / resolution);
  let y = Math.round(mouseY / resolution);
  for (let i = -3; i < 4; i++) {
    for (let j = -3; j < 4; j++) {
      if (typeof grid[x + i][y + j] != "undefined") {
        if (keyIsPressed === true) {
          // eraseMode
          grid[x + i][y + j].state = 3;
        } else {
          grid[x + i][y + j].state = 1;
        }
      } else {
        console.log("NOT happening");
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setColsRows();
  init();
}

function init() {
  // 1_b_ building the grid
  grid = make2DArray(cols, rows);
  // filling the my grid using a nested loop
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      //grid[x][y] = floor(random(2)); // 0 or 1 value
      grid[x][y] = new Cell(x * resolution - 1, y * resolution - 1, floor(random(2)));
    }
  }
  // 2_a create a second grid to keep track of the current cells values
  next = make2DArray(cols, rows);
  console.table(grid);
}

function setColsRows() {
  let w = windowWidth;
  let h = windowHeight;
  if (w % 2 == 1) { // if = 0 == falsy = windowWidth it's an even number, if not..
    w -= 1; // we make it
  };
  if (h % 2 == 1) { // if = 0 == falsy = windowHeight it's an even number, if not...
    h -= 1; // we make it
  };
  while (w % resolution) {
    w -= 1;
  };
  while (h % resolution) {
    h -= 1;
  }
  cols = w / resolution;
  rows = h / resolution;
}
