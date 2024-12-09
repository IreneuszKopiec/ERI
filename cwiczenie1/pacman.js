class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const grid = [
    ['5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5'],
    ['5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '5'],
    ['5', '0', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '0', '5'],
    ['5', '0', '5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '5', '0', '5'],
    ['5', '0', '5', '0', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '0', '5', '0', '5'],
    ['5', '0', '5', '0', '5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '5', '0', '0', '5', '0', '5'],
    ['5', '0', '5', '0', '5', '0', '5', '5', '5', '5', '5', '5', '5', '0', '5', '0', '5', '5', '0', '5'],
    ['5', '0', '5', '0', '5', '0', '5', '0', '0', '0', '0', '0', '5', '0', '5', '0', '5', '0', '0', '5'],
    ['5', '0', '5', '0', '5', '0', '5', '0', '5', '5', '5', '0', '5', '0', '5', '0', '5', '0', '5', '5'],
    ['5', '0', '5', '0', '5', '0', '5', '0', '5', '0', '0', '0', '5', '0', '5', '0', '5', '0', '5', '5'],
    ['5', '0', '5', '0', '5', '0', '5', '0', '5', '5', '5', '0', '5', '0', '5', '0', '5', '0', '5', '5'],
    ['5', '0', '5', '0', '5', '0', '5', '0', '0', '0', '0', '0', '5', '0', '5', '0', '5', '0', '5', '5'],
    ['5', '0', '5', '0', '5', '0', '5', '5', '5', '5', '5', '5', '5', '0', '5', '0', '5', '5', '0', '5'],
    ['5', '0', '5', '0', '5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '5', '0', '0', '5', '0', '5'],
    ['5', '0', '5', '0', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '0', '5', '0', '5'],
    ['5', '0', '5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '5', '0', '5'],
    ['5', '0', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '0', '5'],
    ['5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '5'],
    ['5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5']
];

let pacman = new Cell(1, 1);
let ghosts = [new Cell(17, 17), new Cell(1, 17), new Cell(17, 1)];

function generateTable(rows, cols, grid) {
    const table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");

            if (grid[i][j] === '5') {
                cell.classList.add("wall");
            } else {
                cell.classList.add("path");
            }

            if (i === pacman.y && j === pacman.x) {
                cell.classList.add("pacman");
            }

            ghosts.forEach(ghost => {
                if (i === ghost.y && j === ghost.x) {
                    cell.classList.add("ghost");
                }
            });
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    document.getElementById("container").innerHTML = '';
    document.getElementById("container").appendChild(table);
}

function movePacman(event) {
    let newX = pacman.x;
    let newY = pacman.y;

    switch (event.key) {
        case 'ArrowUp':
            newY--;
            break;
        case 'ArrowDown':
            newY++;
            break;
        case 'ArrowLeft':
            newX--;
            break;
        case 'ArrowRight':
            newX++;
            break;
    }

    if (grid[newY][newX] !== '5') {
        pacman.x = newX;
        pacman.y = newY;
        checkCollision();
        generateTable(grid.length, grid[0].length, grid);
    }
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        let directions = [
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 }   // Right
        ];
        let direction = directions[Math.floor(Math.random() * directions.length)];
        let newX = ghost.x + direction.x;
        let newY = ghost.y + direction.y;

        if (grid[newY][newX] !== '5') {
            ghost.x = newX;
            ghost.y = newY;
        }
    });
    checkCollision();
    generateTable(grid.length, grid[0].length, grid);
}

function checkCollision() {
    ghosts.forEach(ghost => {
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            alert('Game Over!');
            pacman = new Cell(1, 1);
            ghosts = [new Cell(17, 17), new Cell(1, 17), new Cell(17, 1)];
        }
    });
}

document.addEventListener('keydown', movePacman);
setInterval(moveGhosts, 1000);
generateTable(grid.length, grid[0].length, grid);