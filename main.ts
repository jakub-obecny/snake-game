// PO SPUŠTĚNÍ A UVÍTACÍ MELODII SE VÁM ZOBRAZÍ ČÍSLA, TO JSOU ÚROVNĚ OBTÍŽNOSTI 1 AŽ 8
// 
// tlačítko A= úroveň dolů
// 
// tlačítko B= úroveň nahoru
function saveHighScore () {
    flashstorage.put("snake_highscore", "" + highScore)
}
function moveForward () {
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
    // Nová hra už není v menu po Game Over
    arrowMenu = false
    saveMenuState()
    basic.clearScreen()
    led.plot(px, py)
    placeNextApple()
    mode = 1
}
function saveMenuState () {
    flashstorage.put("snake_level", "" + level)
    flashstorage.put("snake_arrow", arrowMenu ? "1" : "0")
}
input.onButtonPressed(Button.A, function () {
    if (mode == 0) {
        level = (level + 6) % 8 + 1
        saveMenuState()
        showLevel()
    } else if (mode == 1) {
        turnLeft()
    }
})
// Dotyk loga na micro:bitu V2
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (mode == 0) {
        showHighScore()
    }
})
function loadMenuState () {
    savedLevel = flashstorage.get("snake_level")
    savedArrow = flashstorage.get("snake_arrow")
    if (savedLevel != "") {
        parsedLevel = parseInt(savedLevel)
        if (parsedLevel >= 1 && parsedLevel <= 8) {
            level = parsedLevel
        }
    }
    arrowMenu = savedArrow == "1"
}
function gameOver () {
    basic.clearScreen()
    mode = 2
    // Ulož rekord pouze při jeho překonání
    if (score > highScore) {
        highScore = score
        saveHighScore()
    }
    music.play(music.builtinPlayableSoundEffect(soundExpression.sad), music.PlaybackMode.InBackground)
    basic.pause(1000)
    basic.showString("GAME OVER")
    basic.showNumber(score)
    if (score < 10) {
        basic.pause(1500)
    }
    arrowMenu = true
    saveMenuState()
    showArrow()
    mode = 0
}
function turnRight () {
    direction = (direction + 1) % 4
}
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
        saveMenuState()
        showLevel()
    } else if (mode == 1) {
        turnRight()
    }
})
function loadHighScore () {
    saved = flashstorage.get("snake_highscore")
    if (saved != "") {
        highScore = parseInt(saved)
    } else {
        highScore = 0
    }
}
function placeNextApple () {
    // Losování ze všech polí kromě pozice hráče
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
    saveMenuState()
    if (arrowMenu) {
        showArrow()
    } else {
        basic.showNumber(level)
    }
}
function validPixelCoordinate (nx: number, ny: number) {
    return nx >= 0 && nx <= 4 && ny >= 0 && ny <= 4
}
function showHighScore () {
    if (mode != 0) {
        return
    }
    // Zapamatuj přesnou obrazovku a obtížnost
    returnLevel = level
    returnArrow = arrowMenu
    flashstorage.put("snake_return_level", "" + returnLevel)
    flashstorage.put("snake_return_arrow", returnArrow ? "1" : "0")
    // Zabraň opakovanému spuštění během zobrazení
    mode = 2
    loadHighScore()
    basic.clearScreen()
    basic.showNumber(highScore)
    basic.clearScreen()
    // Obnov původní obrazovku
    savedLevel2 = flashstorage.get("snake_return_level")
    savedArrow2 = flashstorage.get("snake_return_arrow")
    if (savedLevel2 != "") {
        parsedLevel2 = parseInt(savedLevel2)
        if (parsedLevel2 >= 1 && parsedLevel2 <= 8) {
            level = parsedLevel2
        }
    }
    arrowMenu = savedArrow2 == "1"
    saveMenuState()
    mode = 0
    if (arrowMenu) {
        showArrow()
    } else {
        basic.showNumber(level)
    }
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
/**
 * PO SPUŠTĚNÍ A UVÍTACÍ MELODII SE VÁM ZOBRAZÍ ČÍSLA, TO JSOU ÚROVNĚ OBTÍŽNOSTI 1 AŽ 8
 * 
 * tlačítko A= úroveň dolů
 * 
 * tlačítko B= úroveň nahoru
 */
let oy = 0
let ox = 0
let parsedLevel2 = 0
let savedArrow2 = ""
let savedLevel2 = ""
let returnLevel = 0
let ay = 0
let ax = 0
let cell = 0
let saved = ""
let lastPress = 0
let t = 0
let parsedLevel = 0
let savedArrow = ""
let savedLevel = ""
let step = 0
let delay = 0
let score = 0
let py = 0
let px = 0
let direction = 0
let highScore = 0
let mode = 0
let level = 0
let arrowMenu = false
let returnArrow = false
level = 1
mode = 2
let MIN_DELAY = 100
// Nejdříve načti uložené hodnoty
loadHighScore()
loadMenuState()
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
