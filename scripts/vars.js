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
    level = 1,
    boxCount = level+5,
    px,
    py,
    incx,
    incy,
    x,
    y,
    stop = 0,
    stepIndex,
    totalPainted = 0,
    side, size,
    lastDir = [],
    score = 10,
    modes = ['classic', 'blitz', 'timer'],
    mode = 0,
    scoreAfterReturnMove = -Math.floor(boxCount/1.5),
    scoreAfterMove = 0,
    scoreAfterLevel,
    levelAfterLevel = 1,
    startLevel = level,
    timeAfterLevel = 0,
    timeAfterMove = 0,
    time = Infinity,
    startTime = time,
    colorPlayer = colorBox,
    waySolutions = [],
    bestScore = score,
    bestScoreLog = `${bestScore}(${level})`,
    interval = null

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
