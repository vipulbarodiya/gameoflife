let grid;
let cols, rows;
let resolution = 10;
let runGame = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initializeGrid();
}

function initializeGrid() {
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  grid = create2DArray(cols, rows);
}

function draw() {
  background(11, 14, 20);

  // 1. Draw the current grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let age = grid[i][j];
      if (age > 0) {
        // HSB mode makes the "Age to Color" transition look amazing
        colorMode(HSB);
        let hue = map(min(age, 40), 0, 40, 180, 320); // Cyan to Purple
        fill(hue, 80, 100);
        noStroke();
        rect(i * resolution, j * resolution, resolution - 1, resolution - 1);
        colorMode(RGB);
      }
    }
  }

  // 2. Logic Update (only if not paused)
  if (runGame) {
    let next = create2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        let neighbors = countNeighbors(grid, i, j);

        if (state > 0) { // Alive
          if (neighbors < 2 || neighbors > 3) next[i][j] = 0; // Die
          else next[i][j] = state + 1; // Age up
        } else { // Dead
          if (neighbors === 3) next[i][j] = 1; // Born
        }
      }
    }
    grid = next;
  }
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      if (grid[col][row] > 0) sum++;
    }
  }
  if (grid[x][y] > 0) sum--;
  return sum;
}

// Interactivity
function mouseDragged() {
  let i = floor(mouseX / resolution);
  let j = floor(mouseY / resolution);
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    grid[i][j] = 1;
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') initializeGrid();
  if (key === ' ') runGame = !runGame;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeGrid();
}

function create2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}