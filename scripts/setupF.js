/*
function preload() {
    text("loading...", side/2, side/2)
} */


function setup() {

    boxCount = level+5
    side = Math.min(window.innerHeight, window.innerWidth),
    size = (side-mainSize) / boxCount
    // Creating sketch
    createCanvas(side, side-mainSize)
    background(colorBox)
    //call a big function
    moveGenerate()
    //big function which create a map
    function moveGenerate(minLength/*of path*/ = floor(((boxCount-2)**2)/3), maxLength = floor(((boxCount-2)**2)/1.2)) {

        do { // 1st cycle, if path is so small create new path
            stop = 0
            stepIndex = 0
            px = floor(random(1, boxCount-1))
            py = floor(random(1, boxCount-1))
            map = []
            lastDir = []
            lines = []
            totalPainted = 0
            waySolutions = []
            colorPlayer = colorBox

            for (let i = 0; i < boxCount; i++) {
                let k = []
                let t, d
                for (let j = 0; j < boxCount; j++) {
                    if (j == 0 || j == boxCount-1) {
                        t = 'colorBox'
                        d = 1
                    } else {
                        t = 'colorBlocks'
                        d = 0
                    }
                    k.push(new ceilN(d, t, 1))
                }
                map.push(k)
            }
            map[0].fill(new ceilN(1, 'colorBox', 1))
            map[boxCount-1].fill(new ceilN(1, 'colorBox', 1))

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

                } while (map[y][x].active == 1)

                px = x
                py = y

                waySolutions.push(new waySolution(px, py))

                // just check
                if (map[y][x+1].active != 0 && map[y][x-1].active != 0 && map[y+1][x].active != 0 && map[y-1][x].active != 0) stop = 1
                // for colors
                if (stepIndex == 0) {
                    map[py][px] = new ceilN(1, 'colorStart')
                    lines[0] = new oneLine(px, py)
                } else if (stop == 1) map[py][px] = new ceilN(1, 'colorFinish')
                  else map[py][px] = new ceilN(1, 'colorPath')
                // count total steps
                stepIndex++

            } while (stop != 1)
        } while (stepIndex < minLength || stepIndex > maxLength)
    }

    for (let i = 0; i < boxCount; i++) {
        for (let j = 0; j < boxCount; j++) {
            if (map[j][i].color == 'colorStart') { // set start
                px = i
                py = j
                map[j][i].paintedOver = 1
                map[j][i].isBorder = 1
            }
        }
    }
    setMode()
}
