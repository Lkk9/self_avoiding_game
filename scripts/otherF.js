
function setRules(aSR, bSR, cSR, dSR, eSR, fSR, gSR, hSR) {
    scoreAfterReturnMove = aSR
    scoreAfterMove = bSR
    scoreAfterLevel = cSR

    startLevel = dSR
    levelAfterLevel = eSR

     startTime = fSR
     timeAfterLevel = gSR
     timeAfterMove = hSR
}

function setMode() {
    if (modes[mode] == modes[0]) {
        setRules(-Math.floor(boxCount/1.5), 0, stepIndex, 1, 1, Infinity, 0, 0)
        timer('off')
    } else if (modes[mode] == modes[1]) {
        timer('off')
        setRules(0, 0, stepIndex,  4, 0,  15, 5, 0)
        if (time > 25) time = 25
        timer('on')
    } else if (modes[mode] == modes[2]) {
        timer('off')
        setRules(-10, 1, level,  1, 1,  1000, 0, 0)
        timer('on')
    }else {
        console.log('u just kill my game, dumb monke\nERROR!!!ERROR!!!ERROR!!!ERROR!!!')
        setRules(0, 0, 0, 0, 0, 0, 0, 0)
    }
}

function timer(turn) {
    if (turn == 'on') {
        interval = setInterval(function() {
            time--
        }, 1000)
    } else if (turn == 'off') {
        clearInterval(interval)
    }

}

function randomIntVal(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand)
}
