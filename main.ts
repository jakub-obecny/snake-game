/**
 * ===== SNAKE pro micro:bit =====
 * 
 * Menu (po zapnutí a po konci hry): A = obtížnost níž, B = obtížnost výš
 * 
 * Na kraji se to zalamuje: 1 a níž = 8, 8 a výš = 1. A+B = potvrdit a spustit hru
 * 
 * Ve hře: A = zatočit doleva, B = zatočit doprava (A+B ve hře nic nedělá)
 * 
 * Tempo: start = 1000 - úroveň * 80 ms, zrychlení za jablko = 5 + úroveň * 5 ms, minimum 100 ms
 * 
 * Jablko se losuje z 24 volných políček (hlava hada je vynechaná), bez opakovaného losování
 */
function moveForward () {
    // směr: 0 = doprava, 1 = dolů, 2 = doleva, 3 = nahoru
    if (direction % 2 == 0) {
        px += 1 - direction
    } else {
        py += 2 - direction
    }
    if (!(validPixelCoordinate(px, py))) {
        gameOver()
    }
}
function turnLeft () {
    direction = (direction + 3) % 4
}
function resetGame () {
    score = 0
    direction = 0
    px = 0
    py = 0
    delay = 1000 - level * 80
    step = 5 + level * 5
    basic.clearScreen()
    snake = game.createSprite(px, py)
    apple = game.createSprite(2, 2)
    placeNextApple()
    mode = 1
}
input.onButtonPressed(Button.A, function () {
    if (mode == 0) {
        level = (level + 6) % 8 + 1
        basic.showNumber(level)
    } else if (mode == 1) {
        turnLeft()
    }
})
function gameOver () {
    mode = 2
    music.play(music.tonePlayable(988, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
    basic.pause(1000)
    snake.delete()
    apple.delete()
    basic.showString("GAME OVER")
    basic.showNumber(score)
    basic.pause(1000)
    showMenu()
}
function turnRight () {
    direction = (direction + 1) % 4
}
input.onButtonPressed(Button.AB, function () {
    if (mode == 0) {
        resetGame()
    }
})
input.onButtonPressed(Button.B, function () {
    if (mode == 0) {
        level = level % 8 + 1
        basic.showNumber(level)
    } else if (mode == 1) {
        turnRight()
    }
})
function placeNextApple () {
    // políčka jsou číslovaná 0..24 (řádek * 5 + sloupec); hlava zabírá jedno z nich
    cell = randint(0, 23)
    if (cell >= py * 5 + px) {
        cell += 1
    }
    apple.goTo(cell % 5, Math.idiv(cell, 5))
apple.setBrightness(100)
}
function showMenu () {
    mode = 0
    basic.showNumber(level)
}
function validPixelCoordinate (nx: number, ny: number) {
    return nx >= 0 && nx <= 4 && ny >= 0 && ny <= 4
}
let cell = 0
let step = 0
let delay = 0
let score = 0
let direction = 0
let level = 0
let mode = 0
let apple: game.LedSprite = null
let snake: game.LedSprite = null
let py = 0
let px = 0
let MIN_DELAY = 100
// 0 = menu, 1 = hra běží, 2 = zaneprázdněno (intro, konec hry)
mode = 2
level = 1
music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground)
basic.showString("HI!")
basic.showIcon(IconNames.Heart)
basic.pause(500)
showMenu()
basic.forever(function () {
    if (mode != 1) {
        return
    }
    basic.pause(delay)
    moveForward()
    if (mode != 1) {
        return
    }
    snake.goTo(px, py);
if (snake.isTouching(apple)) {
        score += 1
        delay = Math.max(MIN_DELAY, delay - step)
        placeNextApple()
    }
})
