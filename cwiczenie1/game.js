// Ustawienia gry
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Mapa gry: 0 = punkt, 1 = ściana
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Pozycje Pac-Mana i duchów
let pacman = { x: 1, y: 1 };
let ghosts = [
    { x: 10, y: 5 },
    { x: 4, y: 5 }
];
let score = 0;

// Kierunek ruchu Pac-Mana
let direction = { x: 0, y: 0 };       // Bieżący kierunek
let nextDirection = { x: 0, y: 0 };   // Następny kierunek
let keyPressed = { up: false, down: false, left: false, right: false };

// Funkcja rysująca planszę
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            if (map[j][i] === 1) {
                // Rysowanie ścian
                ctx.fillStyle = 'blue';
                ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
            } else if (map[j][i] === 0) {
                // Rysowanie punktów
                ctx.fillStyle = 'white';
                ctx.fillRect(i * gridSize + 6, j * gridSize + 6, gridSize / 4, gridSize / 4);
            }
        }
    }

    // Rysowanie Pac-Mana
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2, gridSize / 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Rysowanie duchów
    ctx.fillStyle = 'red';
    ghosts.forEach(ghost => {
        ctx.fillRect(ghost.x * gridSize, ghost.y * gridSize, gridSize, gridSize);
    });

    // Wyświetlanie wyniku
    ctx.fillStyle = 'white';
    ctx.font = "14px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
}


// Funkcja sprawdzająca kolizję z przeszkodami
function canMove(x, y) {
    return (
        x >= 0 &&
        y >= 0 &&
        x < map[0].length &&
        y < map.length &&
        (map[y][x] === 0 || map[y][x] === 2) // Ruch możliwy na polach z punktami (0) lub już odwiedzonych (2)
    );
}

// Logika ruchu Pac-Mana i duchów
function updateGame() {
    // Sprawdź, czy nowy kierunek jest możliwy
    const newX = pacman.x + nextDirection.x;
    const newY = pacman.y + nextDirection.y;

    if (canMove(newX, newY)) {
        direction = { ...nextDirection }; // Zmieniamy kierunek natychmiast, jeśli nowy ruch jest możliwy
    }

    // Oblicz nową pozycję Pac-Mana w bieżącym kierunku
    const currentX = pacman.x + direction.x;
    const currentY = pacman.y + direction.y;

    // Wykonaj ruch, jeśli jest możliwy
    if (canMove(currentX, currentY)) {
        pacman.x = currentX;
        pacman.y = currentY;

        // Zbieranie punktów
        if (map[pacman.y][pacman.x] === 0) {
            map[pacman.y][pacman.x] = 2; // Zebrany punkt
            score += 10;
        }
    }

    // Logika ruchu duchów (pozostaje bez zmian)
    ghosts.forEach(ghost => {
        if (Math.random() < 0.3) { // Duchy poruszają się losowo z określonym prawdopodobieństwem
            let deltaX = pacman.x - ghost.x;
            let deltaY = pacman.y - ghost.y;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                ghost.x += deltaX > 0 ? 1 : -1;
            } else {
                ghost.y += deltaY > 0 ? 1 : -1;
            }

            // Zabezpieczenie przed duchami przechodzącymi przez ściany
            if (!canMove(ghost.x, ghost.y)) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    ghost.x -= deltaX > 0 ? 1 : -1;
                } else {
                    ghost.y -= deltaY > 0 ? 1 : -1;
                }
            }
        }

        // Sprawdzenie kolizji z Pac-Manem
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            alert('Game Over! Twój wynik: ' + score);
            document.location.reload();
        }
    });
}

let gameRunning = false;
const FPS = 10;
const frameInterval = 1000 / FPS;
let lastFrameTime = 0;

function gameLoop(currentTime) {
    const timeSinceLastFrame = currentTime - lastFrameTime;

    if (timeSinceLastFrame >= frameInterval) {
        updateGame();
        drawGame();
        lastFrameTime = currentTime;
    }

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Obsługa zdarzeń klawiatury (WASD)
document.addEventListener('keydown', event => {
    if (event.key === 'w' || event.key === 'W') {
        keyPressed.up = true;
        if (direction.y === 0) nextDirection = { x: 0, y: -1 };
    }
    if (event.key === 's' || event.key === 'S') {
        keyPressed.down = true;
        if (direction.y === 0) nextDirection = { x: 0, y: 1 };
    }
    if (event.key === 'a' || event.key === 'A') {
        keyPressed.left = true;
        if (direction.x === 0) nextDirection = { x: -1, y: 0 };
    }
    if (event.key === 'd' || event.key === 'D') {
        keyPressed.right = true;
        if (direction.x === 0) nextDirection = { x: 1, y: 0 };
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 'w' || event.key === 'W') keyPressed.up = false;
    if (event.key === 's' || event.key === 'S') keyPressed.down = false;
    if (event.key === 'a' || event.key === 'A') keyPressed.left = false;
    if (event.key === 'd' || event.key === 'D') keyPressed.right = false;
});

// Rozpoczęcie gry po kliknięciu przycisku Start
startButton.addEventListener('click', () => {
    startButton.style.display = 'none'; // Ukryj przycisk startu
    canvas.style.display = 'block';    // Pokaż planszę
    gameRunning = true;                // Uruchom pętlę gry
    requestAnimationFrame(gameLoop);   // Rozpocznij pętlę gry
});
