// code adapted from https://k-komma.de/assets/js/main.js

const isRecording = true // false in prod
let lineWidth = 22
if (isRecording) {
  lineWidth = 10
}

let canvas, context, canvasImage, color, prevScroll
let pageCanvas, pageContext
let playbackCanvas, playbackContext
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
  playbackContext.strokeStyle = color
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
  const colors = [
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
  recordStartTime = Date.now()
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
  recordStartTime = undefined
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


// playback


// ?fixed delay between strokes?
let recordedStrokes = [
  [
    // stroke 1
    {x: 329, y: 177.5, scrollX: 0, scrollY: 0, elapsedTime: 7},
    {x: 329.5, y: 174, scrollX: 0, scrollY: 0, elapsedTime: 25},
    {x: 331, y: 168.5, scrollX: 0, scrollY: 0, elapsedTime: 41},
    {x: 333, y: 163, scrollX: 0, scrollY: 0, elapsedTime: 53},
    {x: 335, y: 156.5, scrollX: 0, scrollY: 0, elapsedTime: 69},
    {x: 338, y: 151.5, scrollX: 0, scrollY: 0, elapsedTime: 85},
    {x: 340, y: 148.5, scrollX: 0, scrollY: 0, elapsedTime: 101},
    {x: 340.5, y: 147, scrollX: 0, scrollY: 0, elapsedTime: 117},
    {x: 341, y: 147, scrollX: 0, scrollY: 0, elapsedTime: 134},
    {x: 341.5, y: 147.5, scrollX: 0, scrollY: 0, elapsedTime: 199},
    {x: 343, y: 149.5, scrollX: 0, scrollY: 0, elapsedTime: 213},
    {x: 345.5, y: 153, scrollX: 0, scrollY: 0, elapsedTime: 230},
    {x: 347.5, y: 156, scrollX: 0, scrollY: 0, elapsedTime: 245},
    {x: 349, y: 158.5, scrollX: 0, scrollY: 0, elapsedTime: 261},
    {x: 350, y: 161.5, scrollX: 0, scrollY: 0, elapsedTime: 277},
    {x: 350.5, y: 163.5, scrollX: 0, scrollY: 0, elapsedTime: 294},
    {x: 351, y: 165, scrollX: 0, scrollY: 0, elapsedTime: 310},
    {x: 351, y: 165, scrollX: 0, scrollY: 0, elapsedTime: 321},
    {x: 351.5, y: 165.5, scrollX: 0, scrollY: 0, elapsedTime: 333},
    {x: 351.5, y: 165.5, scrollX: 0, scrollY: 0, elapsedTime: 398},
    {x: 356, y: 163, scrollX: 0, scrollY: 0, elapsedTime: 414},
    {x: 360.5, y: 158.5, scrollX: 0, scrollY: 0, elapsedTime: 430},
    {x: 366.5, y: 153.5, scrollX: 0, scrollY: 0, elapsedTime: 445},
    {x: 371, y: 149.5, scrollX: 0, scrollY: 0, elapsedTime: 461},
    {x: 373, y: 147, scrollX: 0, scrollY: 0, elapsedTime: 477},
  ]
]

function playbackStrokes(timestamp) {
  console.log('💐',timestamp)
  window.requestAnimationFrame(playbackStrokes)
}

const videoLoadTimeStart = Date.now()
const aboutPageVideo = document.getElementById('about-page-video')

console.log(aboutPageVideo)

aboutPageVideo.oncanplay = function() {
  const playbackDelay = 500
  const videoLoadTime = Date.now() - videoLoadTimeStart
  console.log('🌸')
  recordedStrokes = recordedStrokes.map(stroke => {
    return stroke.map(point => {
      point.elapsedTime = point.elapsedTime + videoLoadTime + playbackDelay
      return point
    })
  })

  console.log('vid can play now', videoLoadTime, recordedStrokes)

  window.requestAnimationFrame(playbackStrokes)
}

