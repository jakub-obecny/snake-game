// ===== SNAKE pro micro:bit =====
// 
// Menu (po zapnutí): A = obtížnost níž, B = obtížnost výš, na krajích se zalamuje (1 a níž = 8, 8 a výš = 1)
// 
// Při přepnutí úrovně zazní tón (čím vyšší úroveň, tím vyšší tón)
// 
// A+B = potvrdit a spustit hru
// 
// Ve hře: A = zatočit doleva, B = zatočit doprava, A+B nebo dotyk loga (jen micro:bit V2) = pauza / pokračovat
// 
// Po konci hry: skóre a pak svítí šipka ◄► až do nové hry; A/B změní úroveň (číslo se ukáže na chvíli), A+B = hrát znovu
// 
// Tempo: start = 1000 - úroveň * 80 ms, zrychlení za jablko = 5 + úroveň * 5 ms, minimum 100 ms
// 
// Jablko: políčka se promíchají jako „pytlík" (všech 25 políček v náhodném pořadí) a berou se postupně, takže každé políčko přijde na řadu stejně často a nevznikají série ve stejném rohu; hlava hada se přeskakuje; po vyčerpání pytlíku (a při každé nové hře) se míchá znovu
// 
// Hra kreslí přímo LEDkami (led.plot), ne přes sprity: sprity spouští na pozadí vlastní překreslování, které mazalo šipku
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
function shuffleBag () {
    // Fisher–Yates: promíchá čísla 0..24 (rovnoměrně, bez zkreslení)
    bag = []
    for (let i = 0; i <= 24; i++) {
        bag.push(i)
    }
    for (let k = 0; k <= 23; k++) {
        j = randint(k, 24)
        tmp = bag[k]
        bag[k] = bag[j]
        bag[j] = tmp
    }
    bagPos = 0
}
function resetGame () {
    music.play(music.stringPlayable("A C5 A C5 A C5 A C5 ", 450), music.PlaybackMode.InBackground)
    score = 0
    direction = 0
    px = 0
    py = 0
    bagPos = 25
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
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    togglePause()
})
function redrawGame () {
    basic.clearScreen()
    led.plot(px, py)
    led.plotBrightness(ax, ay, 100)
}
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
function showLevel () {
    music.play(music.tonePlayable(220 + level * 55, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
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
    } else {
        togglePause()
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
function togglePause () {
    if (mode == 1) {
        mode = 3
        showPause()
    } else if (mode == 3) {
        redrawGame()
        mode = 1
    }
}
function placeNextApple () {
    // políčka jsou číslovaná 0..24 (řádek * 5 + sloupec); berou se z promíchaného pytlíku, hlava hada se přeskočí
    cell = py * 5 + px
    while (cell == py * 5 + px) {
        if (bagPos >= 25) {
            shuffleBag()
        }
        cell = bag[bagPos]
        bagPos += 1
    }
    ax = cell % 5
    ay = Math.idiv(cell, 5)
    led.plotBrightness(ax, ay, 100)
}
function showMenu () {
    mode = 0
    basic.showNumber(level)
}
function showPause () {
    basic.showLeds(`
        . . . . .
        . # . # .
        . # . # .
        . # . # .
        . . . . .
        `, 0)
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
let cell = 0
let lastPress = 0
let t = 0
let arrowMenu = false
let ay = 0
let ax = 0
let step = 0
let delay = 0
let score = 0
let bagPos = 0
let tmp = 0
let j = 0
let bag: number[] = []
let py = 0
let px = 0
let direction = 0
let level = 0
let mode = 0
let MIN_DELAY = 100
// 0 = menu, 1 = hra běží, 2 = zaneprázdněno (intro, konec hry), 3 = pauza
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
    if (mode != 1) {
        return
    }
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
        placeNextApple()
        music.play(music.tonePlayable(784, music.beat(BeatFraction.Quarter)), music.PlaybackMode.InBackground)
    }
})
