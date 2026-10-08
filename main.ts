enum RadioMessage {
    message1 = 49434
}
/**
 * made with love https://helloacm.com/microbit-programming-the-development-of-a-snake-eating-apple-game-and-ai-version-1-snake-does-not-grow/
 */
function moveForward () {
    dx = dxOffset[direction]
    px += dx[0]
    py += dx[1]
    if (!(validPixelCoordinate(px, py))) {
        gameOver()
    }
}
function turnLeft () {
    direction = (direction + 3) % 4
}
function resetGame () {
    game.setScore(0)
    score = 0
    direction = 0
    px = 0
    py = 0
    snake.goTo(px, py);
placeNextApple()
    game.resume()
}
input.onButtonPressed(Button.A, function () {
    turnLeft()
})
function gameOver () {
    music.play(music.tonePlayable(988, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
    game.setScore(score)
    game.pause()
    basic.pause(1000)
    game.gameOver()
}
function turnRight () {
    direction = (direction + 1) % 4
}
input.onButtonPressed(Button.AB, function () {
    resetGame()
})
input.onButtonPressed(Button.B, function () {
    turnRight()
})
function placeNextApple () {
    let x, y;
do {
        x = Math.randomRange(0, 4);
        y = Math.randomRange(0, 4);
    } while ((x == snake.x()) && (y == snake.y()))
apple.goTo(x, y);
apple.setBrightness(100);
}
let delay = 0
let score = 0
let direction = 0
let dx: number[] = []
let dxOffset: number[][] = []
basic.showString("HI!")
basic.showIcon(IconNames.Heart)
let py = 0
let px = 0
dxOffset = [
[1, 0],
[0, 1],
[-1, 0],
[0, -1]
]
let snake = game.createSprite(px, py)
let apple = game.createSprite(2, 2)
placeNextApple()
function validPixelCoordinate(nx: Number, ny: Number): boolean {
    return (nx >= 0 && nx <= 4 && ny >= 0 && ny <= 4);
}
basic.forever(function () {
    if (game.isGameOver()) {
        return;
    }
    delay = Math.max(100, 1000 - score * 50)
    basic.pause(delay)
    moveForward()
    snake.goTo(px, py);
if (snake.isTouching(apple)) {
        score += 1
        placeNextApple()
    }
})
