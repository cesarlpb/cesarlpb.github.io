let tileSize = 32; // Ancho de una casilla
let columns = 16;
let rows = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * (columns / 2) - tileSize;
let shipY = tileSize * rows - tileSize * 2;
let shipImg;
let shipVelocityX = tileSize; // Velocidad movimiento de la nave

let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienVelocityX = 1; // Velocidad movimiento aliens

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;

let bulletArray = [];
let bulletVelocityY = -10;

let score = 0;

let gameOver = false;
let youWin = false;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
}


window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Estas lineas son para crear un rectangulo que ocupe la posición de la nave para ver la posición
    //context.fillStyle = "pink";
    //context.fillRect(ship.x, ship.y, ship.width, ship.height);

    // Cargamos imagen de la nave
    shipImg = new Image();
    shipImg.src = "ship.png";
    shipImg.onload = function () {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    // Cargamos imagenes de aliens
    alienImg = new Image();
    alienImg.src = "alien.png";
    createAliens();

    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
    requestAnimationFrame(update);
}

function update() {

    // Verificamos mensaje de game over
    if (gameOver) {
        context.fillStyle = "red";
        context.font = "40px monospace";
        context.fillText("Game Over", boardWidth / 2 - 100, boardHeight / 2);
        return; // Detiene el juego
    }

    if (youWin) {
        context.fillStyle = "green";
        context.font = "40px monospace";
        context.fillText("You win!", boardWidth / 2 - 100, boardHeight / 2);
        return; // Detiene el juego
    }


    requestAnimationFrame(update);

    context.clearRect(0, 0, boardWidth, boardHeight); // Esta linea es para hacer que se limpie la imagen y no se generen muchas en linea

    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    context.fillStyle = "white";
    context.font = "20px monospace";
    context.fillText("Score: " + score, 10, 20);

    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;
            // Evitamos que los aliens se vayan por los bordes del tablero
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2; // Esta linea hace que los aliens no se desajusten cuando rebotan en los lados del tablero (no la entiendo muy bien)
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alien.height; // Aumentamos una fila cuando llegan los aliens al borde
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
        }
    }

    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        // Colision de las balas con los aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }

    }

    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift();  // Esta linea borra el primer elemento del array cuando ha desaparecido de la pantalla
    }

    // Verificamos si algún alien llega abajo.
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive && alien.y + alien.height >= board.height - tileSize * 2) {
            gameOver = true;
            break;
        }
    }
    // Verificamos si hemos matado todos los aliens
    if (alienCount === 0) {
        youWin = true;
        return;
    }

}


// Utilizamos funciones que esperan un evento del usuario, en este caso las flechas para mover la nave.
function moveShip(e) {
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX;
    } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + shipWidth <= board.width) {
        ship.x += shipVelocityX;
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

// Para el disparo, el evento que se espera es pulsar la tecla espacio.
function shoot(e) {
    if (e.code == "Space") {
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        }
        bulletArray.push(bullet);
    }
}

// Verifica si el objeto 'a' (bala) ocupa el mismo espacio que el objeto 'b' (alien)
function detectCollision(a, b) {
    return a.x < b.x + b.width && // Verifica que la esquina superior izquierda de a no alcanza la equina superior derecha de b
        a.x + a.width > b.x && // Verifica que la esquina superior derecha de a ha sobrepasado la esquina superior izquierda de b (es decir, que a se encuentra dentro de los limites del espacio que ocupa b en el eje X)
        a.y < b.y + b.height && // Verifica que la esquina inferior izquierda de a no alcanza la esquina superior izquierda de b
        a.y + a.height > b.y; // Verifica que la esquina superior izquierda de a ha sobrepasado el límite inferior de b (es decir, que a se encuentra dentro de los límites del espacio que ocupa b en el eje Y)
}

