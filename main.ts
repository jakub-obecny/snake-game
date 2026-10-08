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
    music.play(music.stringPlayable("A C5 A C5 A C5 A C5 ", 450), music.PlaybackMode.InBackground)
    score = 0
    direction = 0
    px = 0
    py = 0
    delay = 1000 - level * 80
    step = 5 + level * 5
    basic.clearScreen()
    led.plot(px, py)
    placeNextApple()
    mode = 1
}
input.onButtonPressed(Button.A, function () {
    if (mode == 0) {
        level = (level + 6) % 8 + 1
        showLevel()
    } else if (mode == 1) {
        turnLeft()
    }
})
function gameOver () {
    basic.clearScreen()
    mode = 2
    music.play(music.tonePlayable(988, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
    basic.pause(1000)
    basic.showString("GAME OVER")
    basic.showNumber(score)
    if (score < 10) {
        basic.pause(1500)
    }
    arrowMenu = true
    showArrow()
    mode = 0
}
function turnRight () {
    direction = (direction + 1) % 4
}
/**
 * ===== SNAKE pro micro:bit =====
 * 
 * Menu (po zapnutí): A = obtížnost níž, B = obtížnost výš, na krajích se zalamuje (1 a níž = 8, 8 a výš = 1)
 * 
 * A+B = potvrdit a spustit hru
 * 
 * Ve hře: A = zatočit doleva, B = zatočit doprava (A+B ve hře nic nedělá)
 * 
 * Po konci hry: skóre a pak svítí šipka ◄► až do nové hry; A/B změní úroveň (číslo se ukáže na chvíli), A+B = hrát znovu
 * 
 * Tempo: start = 1000 - úroveň * 80 ms, zrychlení za jablko = 5 + úroveň * 5 ms, minimum 100 ms
 * 
 * Jablko se losuje z 24 volných políček (hlava hada je vynechaná), bez opakovaného losování
 * 
 * Hra kreslí přímo LEDkami (led.plot), ne přes sprity: sprity spouští na pozadí vlastní překreslování, které mazalo šipku
 */
function showLevel () {
    basic.showNumber(level)
    if (arrowMenu) {
        t = input.runningTime()
        lastPress = t
        basic.pause(1000)
        if (mode == 0 && lastPress == t) {
            showArrow()
        }
    }
}
input.onButtonPressed(Button.AB, function () {
    if (mode == 0) {
        resetGame()
    }
})
input.onButtonPressed(Button.B, function () {
    if (mode == 0) {
        level = level % 8 + 1
        showLevel()
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
    ax = cell % 5
    ay = Math.idiv(cell, 5)
    led.plotBrightness(ax, ay, 100)
}
function showMenu () {
    mode = 0
    basic.showNumber(level)
}
function validPixelCoordinate (nx: number, ny: number) {
    return nx >= 0 && nx <= 4 && ny >= 0 && ny <= 4
}
function showArrow () {
    basic.showLeds(`
        . . . . .
        . # . # .
        # # # # #
        . # . # .
        . . . . .
        `, 0)
}
let oy = 0
let ox = 0
let ay = 0
let ax = 0
let cell = 0
let lastPress = 0
let t = 0
let arrowMenu = false
let step = 0
let delay = 0
let score = 0
let py = 0
let px = 0
let direction = 0
let level = 0
let mode = 0
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
    ox = px
    oy = py
    moveForward()
    if (mode != 1) {
        return
    }
    led.unplot(ox, oy)
    led.plot(px, py)
    if (px == ax && py == ay) {
        score += 1
        delay = Math.max(MIN_DELAY, delay - step)
        music.play(music.tonePlayable(784, music.beat(BeatFraction.Quarter)), music.PlaybackMode.InBackground)
        placeNextApple()
    }
})
