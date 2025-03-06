const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Create Restart Button
const restartButton = document.createElement("button");
restartButton.innerText = "Restart";
restartButton.style.position = "absolute";
restartButton.style.top = "50%";
restartButton.style.left = "50%";
restartButton.style.transform = "translate(-50%, -50%)";
restartButton.style.padding = "10px 20px";
restartButton.style.fontSize = "20px";
restartButton.style.display = "none"; // Hidden initially
document.body.appendChild(restartButton);

// Score Display
const scoreDisplay = document.createElement("div");
scoreDisplay.style.position = "absolute";
scoreDisplay.style.top = "20px";
scoreDisplay.style.left = "20px";
scoreDisplay.style.fontSize = "24px";
scoreDisplay.style.color = "white";
document.body.appendChild(scoreDisplay);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Bird (Flappy)
let bird, asteroids, frame, gameOver, score;

function resetGame() {
    bird = {
        x: 100,
        y: canvas.height / 2,
        radius: 20,
        velocity: 0,
        gravity: 0.6,
        lift: -10
    };

    asteroids = [];
    frame = 0;
    gameOver = false;
    score = 0; // Reset Score
    restartButton.style.display = "none"; // Hide restart button
    loop();
}

// Load asteroid image
const asteroidImg = new Image();
asteroidImg.src = "https://img.pikbest.com/origin/09/32/13/85bpIkbEsTCPp.png!w700wp"; 

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.size, asteroid.size);
    });
}

function updateAsteroids() {
    if (frame % 90 === 0) {
        let size = Math.random() * 50 + 30;
        let yPos = Math.random() * (canvas.height - size);
        asteroids.push({ x: canvas.width, y: yPos, size: size });
    }
    asteroids.forEach(asteroid => asteroid.x -= 4);
    asteroids = asteroids.filter(asteroid => asteroid.x + asteroid.size > 0);
}

function checkCollision() {
    if (bird.y + bird.radius >= canvas.height) {
        bird.y = canvas.height - bird.radius;
        bird.velocity = 0;
        gameOver = true;
    }
    if (bird.y - bird.radius <= 0) {
        bird.y = bird.radius;
        bird.velocity = 0;
    }

    asteroids.forEach(asteroid => {
        let distX = bird.x - (asteroid.x + asteroid.size / 2);
        let distY = bird.y - (asteroid.y + asteroid.size / 2);
        let distance = Math.sqrt(distX * distX + distY * distY);
        if (distance < bird.radius + asteroid.size / 2) {
            gameOver = true;
        }
    });

    if (gameOver) {
        restartButton.style.display = "block"; // Show restart button when game over
    }
}

function update() {
    if (gameOver) return;

    bird.velocity += bird.gravity;
    bird.velocity *= 0.98;
    bird.y += bird.velocity;

    updateAsteroids();
    checkCollision();

    score += 0.1; // Score based on distance traveled
    scoreDisplay.innerText = "Score: " + Math.floor(score); // Display score as an integer

    frame++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawAsteroids();
}

function loop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(loop);
}

// Restart game when clicking the restart button
restartButton.addEventListener("click", resetGame);

// Jump controls
window.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "ArrowUp") {
        bird.velocity = bird.lift;
    }
});

window.addEventListener("click", () => {
    bird.velocity = bird.lift;
});

resetGame(); // Start the game