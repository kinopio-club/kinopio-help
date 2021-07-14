// code adapted from https://k-komma.de/assets/js/main.js

const isRecording = true // false in prod
let lineWidth = 22
if (isRecording) {
  lineWidth = 10
}

let canvas, context, canvasImage, color, prevScroll
let pageCanvas, pageContext
let playbackCanvas, playbackContext, playbackColor
let currentStroke = []
let allStrokes = []
prevScroll = {
  x: window.scrollX,
  y: window.scrollY
}
let isDrawing = false
let isTouch = false

randomColor()
initCanvas()
initPageCanvas()
console.log('🌸 magic paint ready')

function initCanvas () {
  canvas = document.getElementById('background')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  context = canvas.getContext('2d')
  context.scale(2,2)
  context.strokeStyle = color
  context.lineWidth = lineWidth
  context.lineCap = context.lineJoin = 'round'
}

function initPlaybackCanvas (width, height) {
  playbackCanvas = document.getElementById('playback-background')
  playbackCanvas.classList.add('hidden')
  playbackCanvas.width = width
  playbackCanvas.height = height
  playbackContext = playbackCanvas.getContext('2d')
  playbackContext.scale(2,2)
  playbackContext.strokeStyle = playbackColor
  playbackContext.lineWidth = lineWidth
  playbackContext.lineCap = playbackContext.lineJoin = 'round'
  playbackCanvas.classList.remove('hidden')
}

function initPageCanvas () {
  pageCanvas = document.getElementById('page-background')
  pageCanvas.classList.add('hidden')
  const body = document.body
  const html = document.documentElement
  const pageWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
  const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  pageCanvas.width = pageWidth
  pageCanvas.height = pageHeight
  pageContext = pageCanvas.getContext('2d')
  pageContext.scale(2,2)
  pageContext.strokeStyle = color
  pageContext.lineWidth = lineWidth
  pageContext.lineCap = pageContext.lineJoin = 'round'
  pageCanvas.classList.remove('hidden')
  initPlaybackCanvas(pageWidth, pageHeight)
}

function randomColor () {
  let colors = [
    '#fcd1c4', // light pink
    '#abfcec', // light blue
    // '#c7f0e8', // light teal
    // '#a3d9e1', // blue
    '#fbbfff', // purple
    // '#f1d0f4', // purple
    '#99f6c6', // green
    // '#c4ecd7', // green
    '#fff0b2', // yellow
  ]
  color = colors[Math.floor(Math.random() * colors.length)]
  colors = colors.filter(item => color !== item)
  playbackColor = colors[Math.floor(Math.random() * colors.length)]
}

function throttle (ms, fn) {
  let lastCallTime
  return function () {
    const now = Date.now()
    if (!lastCallTime || now - lastCallTime > ms) {
      lastCallTime = now
      fn.apply(this, arguments)
    }
  }
}

function drawCurrentStroke () {
  if (currentStroke.length === 0) { return }
  context.beginPath()
  context.moveTo(currentStroke[0].x, currentStroke[0].y)
  currentStroke.forEach((point) => {
    context.lineTo(point.x, point.y)
  })
  context.stroke()
}

function redrawAllStrokes () {
  if (allStrokes.length === 0) { return }
  allStrokes = allStrokes.filter(stroke => {
    return stroke.length
  })
  allStrokes.forEach(stroke => {
    pageContext.beginPath()
    pageContext.moveTo(stroke[0].x + stroke[0].scrollX, stroke[0].y + stroke[0].scrollY)
    stroke.forEach((point) => {
      pageContext.lineTo(point.x + point.scrollX, point.y + point.scrollY)
    })
    pageContext.stroke()
  })
}

let recordStartTime

function startStroke () {
  currentStroke = []
  isDrawing = true
  if (!recordStartTime) {
    recordStartTime = Date.now()
  }
}

function endStroke () {
  allStrokes.push(currentStroke)
  if (isRecording) {
    console.log('⏺', allStrokes)
  }
  pageCanvas.getContext('2d').drawImage(canvas, prevScroll.x / 2, prevScroll.y / 2, canvas.width / 2, canvas.height / 2)
  currentStroke = []
  isDrawing = false
  context.clearRect(0,0, canvas.width, canvas.height)
}

function addPointToStroke ({ x, y }) {
  if (!isDrawing) { return }
  currentStroke.push({
    x,
    y,
    scrollX: prevScroll.x / 2,
    scrollY: prevScroll.y / 2,
    elapsedTime: Date.now() - recordStartTime
  })
  drawCurrentStroke()
}

function updateCanvas() {
  if (isTouch) { return }
  initCanvas()
  initPageCanvas()
  redrawAllStrokes()
}

// start
window.onmousedown = function (event) {
  if (event.button !== 0) { return }
  startStroke()
}
window.ontouchstart = function (event) {
  isTouch = true
  startStroke()
}

// stop
window.onmouseup = function (event) { endStroke() }
window.ontouchend = function (event) { endStroke() }

// draw
window.onmousemove = throttle(10, function (event) {
  addPointToStroke({ x: event.clientX / 2, y: event.clientY / 2 })
})
window.ontouchmove = throttle(10, function (event) {
  addPointToStroke({ x: event.touches[0].clientX / 2, y: event.touches[0].clientY / 2 })
})

// resize
window.onresize = throttle(100, function (event) {
  prevScroll = {
    x: window.scrollX,
    y: window.scrollY
  }
  updateCanvas()
})

// scroll
window.onscroll = function (event) {
  prevScroll = {
    x: window.scrollX,
    y: window.scrollY
  }
}

const resizeObserver = new ResizeObserver(entries => {
  // console.log('Body height changed', entries[0].target.clientHeight)
  console.log('canvas height updated')
  updateCanvas()
})
resizeObserver.observe(document.body)



//
// ▶️ Playback
//


let playbackOverviewStrokesRequestId
let playbackStroke = []
let overviewStrokes = [
  [
    {x: 319.5, y: 163, scrollX: 0, scrollY: 0, elapsedTime: 8}, {x: 323, y: 160, scrollX: 0, scrollY: 0, elapsedTime: 19}, {x: 325.5, y: 157.5, scrollX: 0, scrollY: 0, elapsedTime: 30}, {x: 332, y: 151.5, scrollX: 0, scrollY: 0, elapsedTime: 43}, {x: 337.5, y: 147.5, scrollX: 0, scrollY: 0, elapsedTime: 59}, {x: 341, y: 144.5, scrollX: 0, scrollY: 0, elapsedTime: 81}, {x: 343.5, y: 143, scrollX: 0, scrollY: 0, elapsedTime: 99}, {x: 344, y: 142.5, scrollX: 0, scrollY: 0, elapsedTime: 126}, {x: 344.5, y: 144, scrollX: 0, scrollY: 0, elapsedTime: 140}, {x: 346.5, y: 148, scrollX: 0, scrollY: 0, elapsedTime: 157}, {x: 349, y: 151.5, scrollX: 0, scrollY: 0, elapsedTime: 176}, {x: 353, y: 154.5, scrollX: 0, scrollY: 0, elapsedTime: 190}, {x: 357, y: 156, scrollX: 0, scrollY: 0, elapsedTime: 208}, {x: 361.5, y: 156, scrollX: 0, scrollY: 0, elapsedTime: 219}, {x: 366, y: 154.5, scrollX: 0, scrollY: 0, elapsedTime: 235}, {x: 371.5, y: 151, scrollX: 0, scrollY: 0, elapsedTime: 252}, {x: 376, y: 146.5, scrollX: 0, scrollY: 0, elapsedTime: 267}, {x: 380.5, y: 141.5, scrollX: 0, scrollY: 0, elapsedTime: 283}, {x: 383, y: 137, scrollX: 0, scrollY: 0, elapsedTime: 299}
  ],
  [
    {x: 334.5, y: 200, scrollX: 0, scrollY: 0, elapsedTime: 608}, {x: 339.5, y: 198.5, scrollX: 0, scrollY: 0, elapsedTime: 619}, {x: 345, y: 196, scrollX: 0, scrollY: 0, elapsedTime: 635}, {x: 351.5, y: 194.5, scrollX: 0, scrollY: 0, elapsedTime: 651}, {x: 354, y: 194, scrollX: 0, scrollY: 0, elapsedTime: 667}, {x: 354.5, y: 194, scrollX: 0, scrollY: 0, elapsedTime: 683}, {x: 354.5, y: 194, scrollX: 0, scrollY: 0, elapsedTime: 699}, {x: 355, y: 194.5, scrollX: 0, scrollY: 0, elapsedTime: 710}, {x: 355.5, y: 198.5, scrollX: 0, scrollY: 0, elapsedTime: 723}, {x: 355.5, y: 202.5, scrollX: 0, scrollY: 0, elapsedTime: 740}, {x: 357.5, y: 205.5, scrollX: 0, scrollY: 0, elapsedTime: 759}, {x: 359, y: 208, scrollX: 0, scrollY: 0, elapsedTime: 773}, {x: 361.5, y: 209, scrollX: 0, scrollY: 0, elapsedTime: 792}, {x: 364, y: 209.5, scrollX: 0, scrollY: 0, elapsedTime: 805}, {x: 367, y: 209.5, scrollX: 0, scrollY: 0, elapsedTime: 819}, {x: 368.5, y: 209.5, scrollX: 0, scrollY: 0, elapsedTime: 835}, {x: 369, y: 209.5, scrollX: 0, scrollY: 0, elapsedTime: 852}
  ],
  [
    {x: 342.5, y: 232.5, scrollX: 0, scrollY: 0, elapsedTime: 1107}, {x: 345.5, y: 234.5, scrollX: 0, scrollY: 0, elapsedTime: 1126}, {x: 350.5, y: 238.5, scrollX: 0, scrollY: 0, elapsedTime: 1140}, {x: 358.5, y: 243.5, scrollX: 0, scrollY: 0, elapsedTime: 1157}, {x: 367, y: 249, scrollX: 0, scrollY: 0, elapsedTime: 1176}, {x: 374, y: 253.5, scrollX: 0, scrollY: 0, elapsedTime: 1190}, {x: 377, y: 255.5, scrollX: 0, scrollY: 0, elapsedTime: 1208}
  ]
]

function drawPlaybackStroke() {
  if (playbackStroke.length < 2) { return }
  playbackContext.beginPath()
  playbackContext.moveTo(playbackStroke[0].x + playbackStroke[0].scrollX, playbackStroke[0].y + playbackStroke[0].scrollY)
  playbackStroke.forEach((point) => {
    playbackContext.lineTo(point.x + point.scrollX, point.y + point.scrollY)
  })
  playbackContext.stroke()
}

function checkIfShouldStartNewStroke() {
  const prevStrokesLength = overviewStrokes.length
  overviewStrokes = overviewStrokes.filter(stroke => Boolean(stroke.length))
  const newStrokesLength = overviewStrokes.length
  if (prevStrokesLength > newStrokesLength) {
    playbackStroke = []
  }
}

function playbackOverviewStrokes(timestamp) {
  let stroke = overviewStrokes[0]
  stroke = stroke.filter(point => {
    if (point.elapsedTime <= timestamp) {
      playbackStroke.push(point)
      return false
    } else {
      return true
    }
  })
  overviewStrokes[0] = stroke
  checkIfShouldStartNewStroke()
  drawPlaybackStroke()
  if (overviewStrokes.length) {
    playbackOverviewStrokesRequestId = window.requestAnimationFrame(playbackOverviewStrokes)
  } else {
    window.cancelAnimationFrame(playbackOverviewStrokesRequestId)
  }
}

function normalizeOverviewStrokes(delay) {
  let lastStrokeElapsedTime, applyToIndex
  overviewStrokes = overviewStrokes.map(stroke => {
    return stroke.map(point => {
      point.elapsedTime = point.elapsedTime + delay
      return point
    })
  })
  console.log('▶️', overviewStrokes)
}

const loadDelayStart = Date.now()
const aboutPageVideo = document.getElementById('about-page-video')
aboutPageVideo.oncanplay = function() {
  const playbackDelay = 500
  const delay = Date.now() - loadDelayStart + playbackDelay
  normalizeOverviewStrokes(delay)
  playbackOverviewStrokesRequestId = window.requestAnimationFrame(playbackOverviewStrokes)
}

