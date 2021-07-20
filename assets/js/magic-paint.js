// code adapted from https://k-komma.de/assets/js/main.js

const isRecording = true // false in prod
let lineWidth = 22
if (isRecording) {
  lineWidth = 10
}

let canvas, context, canvasImage, color, prevScroll
let pageCanvas, pageContext
let currentPaintStroke = []
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
}

function randomColor () {
  let colors = [
    '#FFD0C1', // salmon
    '#fbbfff', // pink
    '#99f6c6', // green
    '#fff0b2', // yellow
    '#CCBAFF', // purple
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
  if (currentPaintStroke.length === 0) { return }
  context.beginPath()
  context.moveTo(currentPaintStroke[0].x, currentPaintStroke[0].y)
  currentPaintStroke.forEach((point) => {
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
  currentPaintStroke = []
  isDrawing = true
  if (!recordStartTime) {
    recordStartTime = Date.now()
  }
}

function endStroke () {
  allStrokes.push(currentPaintStroke)
  if (isRecording) {
    const recordedStrokes = allStrokes.map(stroke => {
      return stroke.map(point => {
        delete point.scrollX
        delete point.scrollY
        return point
      })
    })
    console.log('⏺', allStrokes)
  }
  pageCanvas.getContext('2d').drawImage(canvas, prevScroll.x / 2, prevScroll.y / 2, canvas.width / 2, canvas.height / 2)
  currentPaintStroke = []
  isDrawing = false
  context.clearRect(0,0, canvas.width, canvas.height)
}

function addPointToStroke ({ x, y }) {
  if (!isDrawing) { return }
  currentPaintStroke.push({
    x,
    y,
    scrollX: prevScroll.x / 2,
    scrollY: prevScroll.y / 2,
    elapsedTime: Date.now() - recordStartTime,
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
