const
    offsetShadow = 7,
    colorPath = '#FFFFFF',
    colorStart = '#AEC168',
    colorFinish = '#D76258',
    colorBlocks = '#508195',
    colorBox = '#132931',
    colorShadow = '#cccccc',
    mainSize = 210

let
    map = [],
    lines = [],
    level = 20,
    boxCount = level+5,
    px,
    py,
    incx,
    incy,
    x,
    y,
    stop = 0,
    stepIndex = 0,
    totalPainted = 0,
    side, size,
    lastDir = [],
    score = 10,
    modes = ['classic', 'blitz', 'timer'],
    mode = 0,
    scoreAfterReturnMove,
    scoreAfterMove,
    scoreAfterLevel,
    levelAfterLevel,
    colorPlayer = colorBox,
    waySolutions = [],
    bestScore = score
    bestScoreLog = `${bestScore}(${level})`

/*
function preload() {
    text("loading...", side/2, side/2)
} */

function ceilN(active, color, isBorder = 0, paintedOver = 0, lastPainted = 0) {
    this.active = active
    this.color = color
    this.paintedOver = paintedOver
    this.lastPainted = lastPainted
    this.isBorder = isBorder
}
function oneLine(x, y) {
    this.x = x
    this.y = y
}
function waySolution(x, y) {
    this.x = x
    this.y = y
}

function setup() {

    boxCount = level+5
    side = Math.min(window.innerHeight, window.innerWidth),
    size = (side-mainSize) / boxCount
    // Creating sketch
    createCanvas(side, side-mainSize)
    background(colorBox)
    setMode()
    //call a big function
//    moveGenerate(floor(boxCount*level/2), boxCount**2)
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
            if (map[j][i].color == 'colorStart') {
                px = i
                py = j
                map[j][i].paintedOver = 1
                map[j][i].isBorder = 1
            }
        }
    }
}
// draw an objects
function draw() {

    noStroke()

    drawMain()
    setColors()
    check()
    moving()

    // player
    noStroke()
    fill(colorPlayer)
    ellipse(size*(px+.5), size*(py+.5), size-size/offsetShadow*2.2, size-size/offsetShadow*2.2)

    // FUNCTIONS, WARNING!!!
    function moving() {
        let t
        if (keyIsPressed) {
            if ((keyCode == UP_ARROW || key == 'w') && (map[py-1][px].isBorder != 1 && map[py-1][px].paintedOver != 1)) {
                py--
                t = 1
                lastDir.unshift('up')
            } else if ((keyCode == DOWN_ARROW || key == 's') && (map[py+1][px].isBorder != 1 && map[py+1][px].paintedOver != 1)) {
                py++
                t = 1
                lastDir.unshift('down')
            } else if ((keyCode == LEFT_ARROW || key == 'a') && (map[py][px-1].isBorder != 1 && map[py][px-1].paintedOver != 1)) {
                px--
                t = 1
                lastDir.unshift('left')
            } else if ((keyCode == RIGHT_ARROW || key == 'd') && (map[py][px+1].isBorder != 1 && map[py][px+1].paintedOver != 1)) {
                px++
                t = 1
                lastDir.unshift('right')
            } else if (key == 'x' && totalPainted != 0) {
                map[py][px].paintedOver = 0
                map[py][px].isBorder = 0
                totalPainted--
                score += scoreAfterReturnMove
                if (lastDir[0] == 'up') py++
                else if (lastDir[0] == 'down') py--
                else if (lastDir[0] == 'right') px--
                else if (lastDir[0] == 'left') px++
                lastDir.shift()
                lines.pop()
            }
            keyIsPressed = 0
            if (t) {
                map[py][px].paintedOver = 1
                map[py][px].isBorder = 1
                totalPainted++
                t = 0
                lines.push(new oneLine(px, py))
            }
        }
    }

    function check() {
        if (score <= 0) {
            score = 0
            scoreAfterReturnMove = 0
            colorPlayer = '#00000000'
            if (keyIsPressed && keyCode == 32) {
                resetScore()
                setup()
            }
        }
        if (bestScore <= score) {
            bestScore = score
            bestScoreLog = `${bestScore}(${level})`
        }
        if (totalPainted == stepIndex-1 && map[py][px].color == 'colorFinish') {
            boxCount += levelAfterLevel
            level = boxCount-5
            score += scoreAfterLevel
            setup()
        }
        if (map[py][px+1].isBorder == 1 && map[py][px-1].isBorder == 1 && map[py+1][px].isBorder == 1 && map[py-1][px].isBorder == 1) {
        //    totalPainted = 0
        //    setup()
        }
        // modes
        if (keyIsPressed && key == 'r') {
            resetScore()
            bestScore = 10
            changeMode()
        }

    }

    // main
    function drawMain(mainPadding = 15) {
        fill(colorBlocks)
        rect(side-mainSize, size, mainSize, (boxCount-2)*size)
        fill(colorShadow)
        rect(side-mainSize, size, (size/offsetShadow), (boxCount-2)*size)
        fill(colorPath)
        stroke(colorShadow)
        strokeWeight(2.5)
        textSize(17)
        text(`level: ${level}\nscore: ${score}\nbest score: ${bestScoreLog}\nmode: ${modes[mode]}`, side-mainSize+size/offsetShadow+mainPadding, size+2*mainPadding)
    }

    // little function
    function resetScore() {
        score = 10
        level = 1
    }
    function changeMode() {
        if (mode >= modes.length-1) mode = 0
        else mode++
        setup()
    }

    function setColors() {
        // set colors of cells
        for (let k = 1; k <= 5; k++) {
            for (let i = 0; i < boxCount; i++) {
                for (let j = 0; j < boxCount; j++) {
                    // sprites
                    if (k == 1) { // all orange
                        stroke(colorShadow + '60')
                        strokeWeight(4)
                        if (map[j][i].color == 'colorPath') {
                            fill(colorPath)
                            rect(i*size, j*size, size, size)
                        } else if (map[j][i].color == 'colorStart') {
                            fill(colorPath)
                            rect(i*size, j*size, size, size)
                            fill(colorStart)
                            let crop = offsetShadow-.3
                            rect(size*(i+1/crop), size*(j+1/crop), size*(1-2/crop), size*(1-2/crop), 10)
                        } else if (map[j][i].color == 'colorFinish') {
                            fill(colorPath)
                            rect(i*size, j*size, size, size)
                            fill(colorFinish)
                            let crop = offsetShadow-.2
                            rect(size*(i+1/crop), size*(j+1/crop), size*(1-2/crop), size*(1-2/crop), 2)
                        }
                    } else if (k == 2) { // shadow of green
                        if (map[j][i].color == 'colorBlocks') {
                            /*
                            fill(colorShadow)
                            beginShape()
                            vertex(i*size, j*size)
                            vertex(size*(i-1/offsetShadow), size*(j+1/offsetShadow))
                            vertex(size*(i-1/offsetShadow),size*(j+1+1/offsetShadow))
                            vertex(size*(i-1/offsetShadow+1), size*(j+1+1/offsetShadow))
                            vertex(size*(i+1), size*(j+1))
                            endShape(CLOSE)
                            */
                        }
                    } else if (k == 3) { // shadow of puple
                        if (map[j][i].color == 'colorBox') {
                            /*
                            fill(colorShadow)
                            beginShape()
                            vertex(i*size, j*size)
                            vertex(size*(i-1/offsetShadow), size*(j+1/offsetShadow))
                            vertex(size*(i-1/offsetShadow),size*(j+1+1/offsetShadow))
                            vertex(size*(i-1/offsetShadow+1), size*(j+1+1/offsetShadow))
                            vertex(size*(i+1), size*(j+1))
                            endShape(CLOSE)
                            */
                        }
                    } else if (k == 4) { // green
                        if (map[j][i].color == 'colorBlocks') {
                            fill(colorBlocks)
                            rect(i*size, j*size, size, size)
                        }
                    } else if (k == 5) { // purple
                        if (map[j][i].color == 'colorBox') {
                            fill(colorBox)
                            rect(i*size, j*size, size, size)
                        }
                    }

                    noStroke()
                    if (map[j][i].paintedOver == 1) {
                        fill(0, 0, 0, 2)
                        ellipse(size*(i+.5), size*(j+.5), size-size/offsetShadow*4, size-size/offsetShadow*4)
                    }
                }
            }
        }

        // LINES
        stroke('#00000022')
        strokeWeight(6)
        if (score <= 0) {
            //line path way solution
            showWay(waySolutions)
        } else {
            //line path
            showWay(lines)
        }
        function showWay(arr) {
            for (let i = 1; i < arr.length; i++) {
                line(arr[i-1].x*size+size/2, arr[i-1].y*size+size/2, arr[i].x*size+size/2, arr[i].y*size+size/2)
            }
        }

    }

}
function setRules(a, b, c, d) {
    scoreAfterReturnMove = a
    scoreAfterMove = b
    scoreAfterLevel = c
    levelAfterLevel = d
    // startTime =
    // timeAfterLevel =
    // timeAfterMove =
}
function setMode() {
    if (modes[mode] == modes[0]) {
        setRules(-Math.floor(boxCount/1.5), 0, stepIndex, 1)
    } else if (modes[mode] == modes[1]) {

    } else if (modes[mode] == modes[2]) {

    }else {
        console.log('u just kill my game, dumb monke\nERROR!!!ERROR!!!ERROR!!!ERROR!!!')
        setRules(0, 0, 0, 0)
    }
}
