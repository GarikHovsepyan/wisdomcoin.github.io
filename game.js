// Define keys object to track pressed keys
const keys = {};

// Array to store player shots
const playerShoots = [];

// Event listeners for keydown and keyup events to update keys object
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
const triangleSpeed = 2;
const triangleSize = 20;
const playerSize = 10;
const playerSpeed = 5;
const playerShootSpeed = 8;
const playerShootSize = 4;

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: playerSize,
    color: 'white',
    draw: function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};

// Triangle object
function Triangle(x, y) {
    this.x = x;
    this.y = y;
    this.radius = triangleSize;
    this.color = 'red';
    this.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.x + this.radius, this.y);
        ctx.lineTo(this.x - this.radius, this.y + this.radius);
        ctx.lineTo(this.x - this.radius, this.y - this.radius);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };
    this.move = function () {
        this.x -= triangleSpeed;
    };
}

// Array to store triangles
const triangles = [];

// Event listener for mouse click
canvas.addEventListener('click', shoot);

// Shoot function
function shoot(event) {
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    const dx = Math.cos(angle) * playerShootSpeed;
    const dy = Math.sin(angle) * playerShootSpeed;
    const x = player.x + (player.radius * dx) / Math.sqrt(dx ** 2 + dy ** 2);
    const y = player.y + (player.radius * dy) / Math.sqrt(dx ** 2 + dy ** 2);
    playerShoots.push({ x, y, dx, dy });
}

// Function to update game objects
function update() {
    // Move player
    if (keys.ArrowUp && player.y - player.radius > 0) {
        player.y -= playerSpeed;
    }
    if (keys.ArrowDown && player.y + player.radius < canvas.height) {
        player.y += playerSpeed;
    }
    if (keys.ArrowLeft && player.x - player.radius > 0) {
        player.x -= playerSpeed;
    }
    if (keys.ArrowRight && player.x + player.radius < canvas.width) {
        player.x += playerSpeed;
    }

    // Move triangles
    for (let i = 0; i < triangles.length; i++) {
        triangles[i].move();
        if (triangles[i].x + triangles[i].radius < 0) {
            triangles.splice(i, 1);
            score++;
            document.getElementById('score').innerText = 'Score: ' + score;
        }
    }

    // Collision detection
    for (let i = 0; i < playerShoots.length; i++) {
        for (let j = 0; j < triangles.length; j++) {
            const dx = playerShoots[i].x - triangles[j].x;
            const dy = playerShoots[i].y - triangles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < playerShootSize + triangles[j].radius) {
                triangles.splice(j, 1);
                playerShoots.splice(i, 1);
                score++;
                document.getElementById('score').innerText = 'Score: ' + score;
                break;
            }
        }
    }
}

// Function to draw game objects
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    player.draw();

    // Draw triangles
    for (let i = 0; i < triangles.length; i++) {
        triangles[i].draw();
    }

    // Draw player shots
    for (let i = 0; i < playerShoots.length; i++) {
        ctx.beginPath();
        ctx.arc(playerShoots[i].x, playerShoots[i].y, playerShootSize, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

// Update and draw game objects
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Game initialization
gameLoop();
