//Start button
const startButton = document.querySelector('.start');
let startButtonClicked = false;

function startGame() {
    startButton.style.display = 'none';
    startButtonClicked = true;
}
startButton.addEventListener('click', startGame);

// stopping player movement after game over
let gameOver = false;

//Maze game variables
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const main = document.querySelector('main');

//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//Randomise enemy positions
function randomiseEnemies() {
    const row = Math.floor(Math.random() * maze.length);
    const column = Math.floor(Math.random() * maze[row].length);

    if (maze[row][column] == 0) {
        maze[row][column] = 3;
    }
    else {
        randomiseEnemies();
    }
}
randomiseEnemies();
randomiseEnemies();
randomiseEnemies();


//Populates the maze in the HTML
for (let y of maze) {
    for (let x of y) {
        let block = document.createElement('div');
        block.classList.add('block');

        switch (x) {
            case 1:
                block.classList.add('wall');
                break;
            case 2:
                block.id = 'player';
                let mouth = document.createElement('div');
                mouth.classList.add('mouth');
                block.appendChild(mouth);
                break;
            case 3:
                block.classList.add('enemy');
                break;
            default:
                block.classList.add('point');
                block.style.height = '1vh';
                block.style.width = '1vh';
        }

        main.appendChild(block);
    }
}

//Random movement of the enemies
const enemies = document.querySelectorAll('.enemy');
enemies.forEach(moveEnemy);

function moveEnemy(enemy) {
    let enemyTop = 0;
    let enemyLeft = 0;
    let enemyDirection = Math.ceil(Math.random() * 4);

    // collision detection for enemy
    setInterval(function () {
        if (!startButtonClicked || gameOver) return;

        let canMove = false;
        let enemyPosition = enemy.getBoundingClientRect();

        // always checking for collision
        const position = player.getBoundingClientRect();
        const enemies = document.querySelectorAll('.enemy');
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i].getBoundingClientRect();

            if (
                position.right > enemy.left &&
                position.left < enemy.right &&
                position.bottom > enemy.top &&
                position.top < enemy.bottom
            ) {
                //dead animation and game over message
                player.classList.add('dead');
                gameOverMessage.style.display = 'flex';
                gameOver = true;
            }
        }

        switch (enemyDirection) {
            case 1: //down
                let newBottom = enemyPosition.bottom + 1;
                let btmLeft = document.elementFromPoint(enemyPosition.left, newBottom);
                let btmRight = document.elementFromPoint(enemyPosition.right, newBottom);

                if (btmLeft.classList.contains('wall') == false && btmRight.classList.contains('wall') == false) {
                    enemyTop++;
                    canMove = true;
                }
                break;

            case 2: //up
                let newTop = enemyPosition.top - 1;
                let topLeft = document.elementFromPoint(enemyPosition.left, newTop);
                let topRight = document.elementFromPoint(enemyPosition.right, newTop);

                if (topLeft.classList.contains('wall') == false && topRight.classList.contains('wall') == false) {
                    enemyTop--;
                    canMove = true;
                }
                break;

            case 3: //left
                let newLeft = enemyPosition.left - 1;
                let leftTop = document.elementFromPoint(newLeft, enemyPosition.top);
                let leftBottom = document.elementFromPoint(newLeft, enemyPosition.bottom);

                if (leftTop.classList.contains('wall') == false && leftBottom.classList.contains('wall') == false) {
                    enemyLeft--;
                    canMove = true;
                }
                break;

            case 4: //right
                let newRight = enemyPosition.right + 1;
                let rightTop = document.elementFromPoint(newRight, enemyPosition.top);
                let rightBottom = document.elementFromPoint(newRight, enemyPosition.bottom);

                if (rightTop.classList.contains('wall') == false && rightBottom.classList.contains('wall') == false) {
                    enemyLeft++;
                    canMove = true;
                }
                break;
        }

        // updating enemy position
        if (canMove) {
            enemy.style.top = enemyTop + 'px';
            enemy.style.left = enemyLeft + 'px';
        } else {
            // Change direction if stuck
            enemyDirection = Math.ceil(Math.random() * 4);
        }
    }, 10);
}

//Player movement
function keyUp(event) {
    if (event.key === 'ArrowUp') {
        upPressed = false;
    } else if (event.key === 'ArrowDown') {
        downPressed = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function keyDown(event) {
    if (event.key === 'ArrowUp') {
        upPressed = true;
    } else if (event.key === 'ArrowDown') {
        downPressed = true;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
}

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;

let score = 0;
const scoreDisplay = document.querySelector('.score p');
const gameOverMessage = document.getElementById('gameOverMessage'); //game over message 

setInterval(function () {
    // Stop player movement before and after the game
    if (!startButtonClicked || gameOver) return;  // (Open AI ChatGPT, 2023)
    let playerMoved = false;


    // Check if all points are collected
    if (document.querySelectorAll('.point').length === 0) {
        gameOverMessage.style.display = 'flex';
        gameOver = true;
    }

    //Player movement with collision detection
    if (downPressed) {
        let position = player.getBoundingClientRect();
        let newBottom = position.bottom + 1;

        let btmleft = document.elementFromPoint(position.left, newBottom);
        let btmright = document.elementFromPoint(position.right, newBottom);

        if (btmleft.classList.contains('wall') == false && btmright.classList.contains('wall') == false) {
            playerTop++;

            player.style.top = playerTop + 'px';
            playerMoved = true;
        }
        playerMouth.classList = 'down';
    }
    else if (upPressed) {
        let position = player.getBoundingClientRect();
        let newTop = position.top - 1;

        let tpleft = document.elementFromPoint(position.left, newTop);
        let tpright = document.elementFromPoint(position.right, newTop);

        if (tpleft.classList.contains('wall') == false && tpright.classList.contains('wall') == false) {
            playerTop--;
            player.style.top = playerTop + 'px';
            playerMoved = true;
        }
        playerMouth.classList = 'up';
    }
    else if (leftPressed) {
        let position = player.getBoundingClientRect();
        let newLeft = position.left - 1;

        let lefttop = document.elementFromPoint(newLeft, position.top);
        let leftbottom = document.elementFromPoint(newLeft, position.bottom);


        if (lefttop.classList.contains('wall') == false && leftbottom.classList.contains('wall') == false) {
            playerLeft--;
            player.style.left = playerLeft + 'px';
            playerMoved = true;
        }
        playerMouth.classList = 'left';
    }
    else if (rightPressed) {
        let position = player.getBoundingClientRect();
        let newRight = position.right + 1;

        let righttop = document.elementFromPoint(newRight, position.top);
        let rightbottom = document.elementFromPoint(newRight, position.bottom);


        if (righttop.classList.contains('wall') == false && rightbottom.classList.contains('wall') == false) {
            playerLeft++;
            player.style.left = playerLeft + 'px';
            playerMoved = true;
        }
        playerMouth.classList = 'right';

    }

    //check for collision with points
    if (playerMoved) {
        const position = player.getBoundingClientRect();
        const points = document.querySelectorAll('.point');

        for (let i = 0; i < points.length; i++) {
            let point = points[i].getBoundingClientRect();

            if (
                position.right > point.left &&
                position.left < point.right &&
                position.bottom > point.top &&
                position.top < point.bottom
            ) {
                points[i].classList.remove('point');
                score += 1;
                scoreDisplay.textContent = score;
                console.log(document.querySelectorAll('.point').length);
            }
        }
    }
}, 10);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//Restarting game
document.getElementById('restart').addEventListener('click', restartGame);

function restartGame() {
    main.innerHTML = '';
    createMaze();
}


// Implementation of button controls
//left button
const leftBtn = document.getElementById('lbttn');
leftBtn.addEventListener('click', function () { // (w3schools, n.d.)
    leftPressed = true;
    rightPressed = false;
    upPressed = false;
    downPressed = false;
});

//up button
const upBtn = document.getElementById('ubttn');
upBtn.addEventListener('click', function () {
    upPressed = true;
    leftPressed = false;
    rightPressed = false;
    downPressed = false;
});

//right button
const rightBtn = document.getElementById('rbttn');
rightBtn.addEventListener('click', function () {
    rightPressed = true;
    leftPressed = false;
    upPressed = false;
    downPressed = false;
});

//down button
const downBtn = document.getElementById('dbttn');
downBtn.addEventListener('click', function () {
    downPressed = true;
    leftPressed = false;
    upPressed = false;
    rightPressed = false;
});
