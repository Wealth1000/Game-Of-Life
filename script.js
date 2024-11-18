const startGameBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const grid = document.getElementById('grid');

let row;
let column;

function calculateGridDimensions() {
    const cellSize = 20;
    const buttonRowHeight = 12;
    row = Math.floor((window.innerHeight / cellSize)) - buttonRowHeight;
    column = Math.floor((window.innerWidth / cellSize));
}

function createGrid(numRows, numCols) {
    grid.innerHTML = '';
    for (let row = 0; row < numRows; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < numCols; col++) {
            const td = document.createElement('td');
            td.classList.add('cell');
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
}

function toggleAlive(grid) {
    const cells = grid.getElementsByTagName('td');
    for (let cell of cells) {
        cell.addEventListener('click', function () {
            cell.classList.toggle('alive');
        });
    }
}

function resetGrid(grid) {
    const cells = grid.getElementsByTagName('td');
    for (let cell of cells) {
        cell.classList.remove('alive');
    }
}

function countLiveNeighbors(grid, rowIndex, colIndex) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    let liveNeighbors = 0;
    directions.forEach(([dx, dy]) => {
        const newRow = rowIndex + dx;
        const newCol = colIndex + dy;
        if ((newRow >= 0) && (newRow < row) && (newCol >= 0) && (newCol < column)) {
            const neighborCell = grid.rows[newRow].cells[newCol];
            if (neighborCell.classList.contains('alive')) {
                liveNeighbors++;
            }
        }
    });
    return liveNeighbors;
}

function calcNewGridState(grid) {
    const newState = [];
    for (let rowIndex = 0; rowIndex < row; rowIndex++) {
        const rowState = [];
        for (let colIndex = 0; colIndex < column; colIndex++) {
            const cell = grid.rows[rowIndex].cells[colIndex];
            const liveNeighbors = countLiveNeighbors(grid, rowIndex, colIndex);
            const isAlive = cell.classList.contains('alive');

            // Apply the Game of Life rules
            if (isAlive) {
                rowState.push(liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0);
            } else {
                rowState.push(liveNeighbors === 3 ? 1 : 0);
            }
        }
        newState.push(rowState);
    }

    return newState;
}

function updateGrid(grid, newState) {
    for (let rowIndex = 0; rowIndex < row; rowIndex++) {
        for (let colIndex = 0; colIndex < column; colIndex++) {
            const cell = grid.rows[rowIndex].cells[colIndex];
            if (newState[rowIndex][colIndex] === 1) {
                cell.classList.add('alive'); // Cell becomes alive
            } else {
                cell.classList.remove('alive'); // Cell becomes dead
            }
        }
    }
}

// Initialize the game
calculateGridDimensions();
createGrid(row, column);
toggleAlive(grid);

let gameInterval;

startGameBtn.addEventListener('click', function () {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        const newState = calcNewGridState(grid);
        updateGrid(grid, newState);
    }, 500);
});

resetBtn.addEventListener('click', function () {
    clearInterval(gameInterval);
    resetGrid(grid);
    gameInterval = null;
});

window.addEventListener('resize', () => {
    calculateGridDimensions();
    createGrid(row, column);
    toggleAlive(grid);
});