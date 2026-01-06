let grid;
let cols, rows;
let resolution = 10; // Experiment: Change this to 5 or 20
let isPaused = false;

function setup() {
    let canvas = createCanvas(windowWidth - 250, windowHeight);
    canvas.parent('canvas-holder');
    initGrid();
}

function initGrid() {
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    grid = create2DArray(cols, rows);

    // Random Start
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = floor(random(2)); 
        }
    }
}

function draw() {
    background(5, 5, 10);

    // 1. Rendering Loop
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let age = grid[i][j];
            if (age > 0) {
                renderCell(i, j, age);
            }
        }
    }

    // 2. Logic Update
    if (!isPaused) {
        let next = create2DArray(cols, rows);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let neighbors = countNeighbors(grid, i, j);
                let state = grid[i][j];

                // Standard Conway Rules
                if (state > 0 && (neighbors === 2 || neighbors === 3)) {
                    next[i][j] = state + 1; // Survive & Age
                } else if (state === 0 && neighbors === 3) {
                    next[i][j] = 1; // New Birth
                } else {
                    next[i][j] = 0; // Death
                }
            }
        }
        grid = next;
    }
}

function renderCell(i, j, age) {
    colorMode(HSB);
    // Experiment: Change 200 (Cyan) and 360 (Red) to change color range
    let hueValue = map(min(age, 50), 0, 50, 200, 360); 
    fill(hueValue, 80, 100);
    noStroke();
    rect(i * resolution, j * resolution, resolution - 1, resolution - 1);
    colorMode(RGB);
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
    return sum - (grid[x][y] > 0 ? 1 : 0);
}

function create2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(0);
    }
    return arr;
}

// Controls
function mouseDragged() {
    let i = floor(mouseX / resolution);
    let j = floor(mouseY / resolution);
    if (i >= 0 && i < cols && j >= 0 && j < rows) {
        grid[i][j] = 1;
    }
}

function keyPressed() {
    if (key === ' ') isPaused = !isPaused;
    if (key === 'r' || key === 'R') initGrid();
    if (key === 'c' || key === 'C') grid = create2DArray(cols, rows);
}

function windowResized() {
    resizeCanvas(windowWidth - 250, windowHeight);
    initGrid();
}