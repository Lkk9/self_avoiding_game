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
            // next (after) move
            if (t) {
                map[py][px].paintedOver = 1
                map[py][px].isBorder = 1
                totalPainted++
                score += scoreAfterMove
                time += timeAfterMove
                t = 0
                lines.push(new oneLine(px, py))
            }
        }
    }

    //check
    function check() {
        if (score <= 0 || time <= 0) {
            score = 0
            time = 0
            scoreAfterReturnMove = 0
            colorPlayer = '#00000000'
            if (keyIsPressed && keyCode == 32) {
                resetScore()
                time = startTime
                level = startLevel
                setMode()
                setup()
            }
        }
        if (bestScore <= score) {
            bestScore = score
            bestScoreLog = `${bestScore}(${level})`
        }
        // next (after) level
        if (totalPainted == stepIndex-1 && map[py][px].color == 'colorFinish') {
            score += scoreAfterLevel
            level += levelAfterLevel
            time += timeAfterLevel
            setup()
        }
        // modes
        if (keyIsPressed && key == 'm') {
            resetScore()
            changeMode()
            setMode()
            bestScore = 10
            level = startLevel
            time = startTime
            setup()
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
        strokeWeight(1.5)
        textSize(17)
        text(
            `level: ${level}\nscore: ${score}\nbest score: ${bestScoreLog}\nmode: ${modes[mode]}\ntime: ${time}`
            , side-mainSize+size/offsetShadow+mainPadding, size+2*mainPadding
        )
        strokeWeight(.5)
        textSize(11)
        text(`* 'w,a,s,d' & arrows for moving.\n* 'x' for return last move.\n* 'm' for chage game mode.\n* space for restart game\n if you will lose.`
        , side-mainSize+size/offsetShadow+mainPadding, boxCount/1.6*size+2*mainPadding)
    }

    // little function
    function resetScore() {
        score = 10
    }
    function changeMode() {
        if (mode >= modes.length-1) mode = 0
        else mode++
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
