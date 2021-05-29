const
    boxCount = 10,
    side = Math.min(window.innerHeight, window.innerWidth),
    size = side / boxCount

let
    map = [],
    px,
    py,
    incx,
    incy,
    x,
    y,
    stop = 0,
    stepIndex = 0
/*
function preload() {
    text("loading...", side/2, side/2)
} */

function ceil(active, color) {
    this.active = active
    this.color = color
}

function setup() {
    // Creating sketch
    createCanvas(side, side)
    //call a big function
    moveGenerate(2, 20)
    //big function which create a map
    function moveGenerate(minLength/*of path*/ = floor((boxCount**2)/3), maxLength = boxCount**2) {

        do { // 1st cycle, if path is so small create new path
            stop = 0
            stepIndex = 0
            px = floor(random(1, boxCount-1))
            py = floor(random(1, boxCount-1))
            map = []

            for (let i = 0; i < boxCount; i++) {
                let k = []
                let t
                for (let j = 0; j < boxCount; j++) {
                    if (j == 0 || j == boxCount-1) {
                        t = 1.6
                    } else t = 0
                    k.push(t)
                }
                map.push(k)
            }
            map[0].fill(1.6)
            map[boxCount-1].fill(1.6)

            do { // catch a position where you cant move anymore
                do { // set a dir of moving and create path
                    do { // create a step for moving from -1 to 1
                        incx = Math.round(Math.random() * 2 - 1)
                        incy = Math.round(Math.random() * 2 - 1)
                    } while (((incx == 1 || incx == -1) && (incy == 1 || incy == -1)) || (incx == 0 && incy == 0))

                    x = px + incx
                    y = py + incy
                    // border
                    if (x > boxCount-2) x = boxCount-2
                    if (x < 1) x = 1
                    if (y > boxCount-2) y = boxCount-2
                    if (y < 1) y = 1

                } while (floor(map[y][x]) == 1)

                px = x
                py = y
                // just check
                if (map[y][x+1] != 0 && map[y][x-1] != 0 && map[y+1][x] != 0 && map[y-1][x] != 0) stop = 1
                // for colors
                if (stepIndex == 0) map[py][px] = 1.1
                else if (stop == 1) map[py][px] = 1.2
                else map[py][px] = 1
                // count total steps
                stepIndex++

            } while (stop != 1)
        } while (stepIndex < minLength || stepIndex > maxLength)
    }

    for (let i = 0; i < map.length; i++) {
        if (map[i].indexOf(1.1) != -1) px = map[i].indexOf(1.1)
        if (map[i].includes(1.1)) py = i
    }
    console.log(map);
}
// draw an objects
function draw() {

    moving()
    // set colors of cells
    stroke(0)
    for (let i = 0; i < boxCount; i++) {
        for (let j = 0; j < boxCount; j++) {
            if (map[j][i] == 1.6) fill(111, 81, 150)
            else if (map[j][i] == 1) fill('#cc904d')
            else if (map[j][i] == 1.1) fill('#e5ba89')
            else if (map[j][i] == 1.2) fill('#91693b')
            else if (map[j][i] == 0) fill(181, 229, 204)
            rect(i*size, j*size, size, size)
        }
    }

    fill(100)
    ellipse(size*(px+.5), size*(py+.5), size/1.5, size/1.5)

    function moving() {
        if (keyIsPressed) {
            if ((keyCode == UP_ARROW || key == 'w') && Math.round(map[py-1][px]) == 1) py--
            else if ((keyCode == DOWN_ARROW || key == 's') && Math.round(map[py+1][px]) == 1) py++
            else if ((keyCode == LEFT_ARROW || key == 'a') && Math.round(map[py][px-1]) == 1) px--
            else if ((keyCode == RIGHT_ARROW || key == 'd') && Math.round(map[py][px+1]) == 1) px++
            keyIsPressed = 0
            map[py][px] = 3
            console.log(map);
        }
    }
}
