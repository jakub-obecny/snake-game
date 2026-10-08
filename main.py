# ===== SNAKE pro micro:bit =====
# 
# Menu (po zapnutí): A = obtížnost níž, B = obtížnost výš, na krajích se zalamuje (1 a níž = 8, 8 a výš = 1)
# 
# Při přepnutí úrovně zazní tón (čím vyšší úroveň, tím vyšší tón)
# 
# A+B = potvrdit a spustit hru
# 
# Ve hře: A = zatočit doleva, B = zatočit doprava, A+B nebo dotyk loga (jen micro:bit V2) = pauza / pokračovat
# 
# Po konci hry: skóre a pak svítí šipka ◄► až do nové hry; A/B změní úroveň (číslo se ukáže na chvíli), A+B = hrát znovu
# 
# Tempo: start = 1000 - úroveň * 80 ms, zrychlení za jablko = 5 + úroveň * 5 ms, minimum 100 ms
# 
# Jablko: políčka se promíchají jako „pytlík" (všech 25 políček v náhodném pořadí) a berou se postupně, takže každé políčko přijde na řadu stejně často a nevznikají série ve stejném rohu; hlava hada se přeskakuje; po vyčerpání pytlíku (a při každé nové hře) se míchá znovu
# 
# Hra kreslí přímo LEDkami (led.plot), ne přes sprity: sprity spouští na pozadí vlastní překreslování, které mazalo šipku
def moveForward():
    global px, py
    # směr: 0 = doprava, 1 = dolů, 2 = doleva, 3 = nahoru
    if direction % 2 == 0:
        px += 1 - direction
    else:
        py += 2 - direction
    if not (validPixelCoordinate(px, py)):
        gameOver()
def turnLeft():
    global direction
    direction = (direction + 3) % 4
def shuffleBag():
    global bag, j, tmp, bagPos
    # Fisher–Yates: promíchá čísla 0..24 (rovnoměrně, bez zkreslení)
    bag = []
    for i in range(25):
        bag.append(i)
    for k in range(24):
        j = randint(k, 24)
        tmp = bag[k]
        bag[k] = bag[j]
        bag[j] = tmp
    bagPos = 0
def resetGame():
    global score, direction, px, py, bagPos, delay, step, mode
    music.play(music.string_playable("A C5 A C5 A C5 A C5 ", 450),
        music.PlaybackMode.IN_BACKGROUND)
    score = 0
    direction = 0
    px = 0
    py = 0
    bagPos = 25
    delay = 1000 - level * 80
    step = 5 + level * 5
    basic.clear_screen()
    led.plot(px, py)
    placeNextApple()
    mode = 1

def on_button_pressed_a():
    global level
    if mode == 0:
        level = (level + 6) % 8 + 1
        showLevel()
    elif mode == 1:
        turnLeft()
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_logo_pressed():
    togglePause()
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_pressed)

def redrawGame():
    basic.clear_screen()
    led.plot(px, py)
    led.plot_brightness(ax, ay, 100)
def gameOver():
    global mode, arrowMenu
    basic.clear_screen()
    mode = 2
    music.play(music.tone_playable(988, music.beat(BeatFraction.HALF)),
        music.PlaybackMode.UNTIL_DONE)
    basic.pause(1000)
    basic.show_string("GAME OVER")
    basic.show_number(score)
    if score < 10:
        basic.pause(1500)
    arrowMenu = True
    showArrow()
    mode = 0
def turnRight():
    global direction
    direction = (direction + 1) % 4
def showLevel():
    global t, lastPress
    music.play(music.tone_playable(220 + level * 55, music.beat(BeatFraction.SIXTEENTH)),
        music.PlaybackMode.IN_BACKGROUND)
    basic.show_number(level)
    if arrowMenu:
        t = input.running_time()
        lastPress = t
        basic.pause(1000)
        if mode == 0 and lastPress == t:
            showArrow()

def on_button_pressed_ab():
    if mode == 0:
        resetGame()
    else:
        togglePause()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global level
    if mode == 0:
        level = level % 8 + 1
        showLevel()
    elif mode == 1:
        turnRight()
input.on_button_pressed(Button.B, on_button_pressed_b)

def togglePause():
    global mode
    if mode == 1:
        mode = 3
        showPause()
    elif mode == 3:
        redrawGame()
        mode = 1
def placeNextApple():
    global cell, bagPos, ax, ay
    # políčka jsou číslovaná 0..24 (řádek * 5 + sloupec); berou se z promíchaného pytlíku, hlava hada se přeskočí
    cell = py * 5 + px
    while cell == py * 5 + px:
        if bagPos >= 25:
            shuffleBag()
        cell = bag[bagPos]
        bagPos += 1
    ax = cell % 5
    ay = Math.idiv(cell, 5)
    led.plot_brightness(ax, ay, 100)
def showMenu():
    global mode
    mode = 0
    basic.show_number(level)
def showPause():
    basic.show_leds("""
            . . . . .
            . # . # .
            . # . # .
            . # . # .
            . . . . .
            """,
        0)
def validPixelCoordinate(nx: number, ny: number):
    return nx >= 0 and nx <= 4 and ny >= 0 and ny <= 4
def showArrow():
    basic.show_leds("""
            . . . . .
            . # . # .
            # # # # #
            . # . # .
            . . . . .
            """,
        0)
oy = 0
ox = 0
cell = 0
lastPress = 0
t = 0
arrowMenu = False
ay = 0
ax = 0
step = 0
delay = 0
score = 0
bagPos = 0
tmp = 0
j = 0
bag: List[number] = []
py = 0
px = 0
direction = 0
level = 0
mode = 0
MIN_DELAY = 100
# 0 = menu, 1 = hra běží, 2 = zaneprázdněno (intro, konec hry), 3 = pauza
mode = 2
level = 1
music.play(music.builtin_playable_sound_effect(soundExpression.hello),
    music.PlaybackMode.IN_BACKGROUND)
basic.show_string("HI!")
basic.show_icon(IconNames.HEART)
basic.pause(500)
showMenu()

def on_forever():
    global ox, oy, score, delay
    if mode != 1:
        return
    basic.pause(delay)
    if mode != 1:
        return
    ox = px
    oy = py
    moveForward()
    if mode != 1:
        return
    led.unplot(ox, oy)
    led.plot(px, py)
    if px == ax and py == ay:
        score += 1
        delay = max(MIN_DELAY, delay - step)
        placeNextApple()
        music.play(music.tone_playable(784, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.IN_BACKGROUND)
basic.forever(on_forever)
