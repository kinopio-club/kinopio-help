let autoPaintCanvas, autoPaintContext, autoPaintColor

initPlaybackCanvas()

function initPlaybackCanvas () {
  autoPaintCanvas = document.getElementById('auto-paint-background')
  autoPaintCanvas.classList.add('hidden')
  const body = document.body
  const html = document.documentElement
  const pageWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
  const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  autoPaintCanvas.width = pageWidth
  autoPaintCanvas.height = pageHeight
  autoPaintContext = autoPaintCanvas.getContext('2d')
  autoPaintContext.scale(2,2)
  autoPaintContext.strokeStyle = '#FFD0C1' // salmon
  autoPaintContext.lineWidth = 10
  autoPaintContext.lineCap = autoPaintContext.lineJoin = 'round'
  autoPaintCanvas.classList.remove('hidden')
  console.log('💐 auto paint ready')
}

let autoPaintIntroStrokesRequestId
let autoPaintStroke = []


function drawPlaybackStroke() {
  if (autoPaintStroke.length < 2) { return }
  autoPaintContext.beginPath()
  autoPaintContext.moveTo(autoPaintStroke[0].x + autoPaintStroke[0].scrollX, autoPaintStroke[0].y + autoPaintStroke[0].scrollY)
  autoPaintStroke.forEach((point) => {
    autoPaintContext.lineTo(point.x + point.scrollX, point.y + point.scrollY)
  })
  autoPaintContext.stroke()
}

function checkIfShouldStartNewStroke() {
  const prevStrokesLength = introStrokes.length
  introStrokes = introStrokes.filter(stroke => Boolean(stroke.length))
  const newStrokesLength = introStrokes.length
  if (prevStrokesLength > newStrokesLength) {
    autoPaintStroke = []
  }
}

function autoPaintIntroStrokes(timestamp) {
  let stroke = introStrokes[0]
  stroke = stroke.filter(point => {
    if (point.elapsedTime <= timestamp) {
      autoPaintStroke.push(point)
      return false
    } else {
      return true
    }
  })
  introStrokes[0] = stroke
  checkIfShouldStartNewStroke()
  drawPlaybackStroke()
  if (introStrokes.length) {
    autoPaintIntroStrokesRequestId = window.requestAnimationFrame(autoPaintIntroStrokes)
  } else {
    window.cancelAnimationFrame(autoPaintIntroStrokesRequestId)
  }
}

function delayIntroStrokes(delayStart) {
  const autoPaintDelay = 500
  const delay = Date.now() - delayStart + autoPaintDelay
  introStrokes = introStrokes.map(stroke => {
    return stroke.map(point => {
      point.elapsedTime = point.elapsedTime + delay
      return point
    })
  })
}

function normalizeElapsedTimeIntroStrokes() {
  let lastTime
  let delta = 0
  introStrokes = introStrokes.map(stroke => {
    return stroke.map((point, index) => {
      point.elapsedTime = point.elapsedTime + delta
      if (point.elapsedTime < lastTime) {
        delta = lastTime - point.elapsedTime
        point.elapsedTime = point.elapsedTime + delta
      }
      lastTime = point.elapsedTime
      return point
    })
  })

}

function positionIntroStrokes() {
  const element = document.getElementById('about-page-video')
  const rect = element.getBoundingClientRect()
  let strokesWidth = 0
  let strokesHeight = 0
  introStrokes.forEach(stroke => {
    stroke.forEach(point => {
      const x = point.x + autoPaintContext.lineWidth
      if (x > strokesWidth && point.side === 'left') {
        strokesWidth = x
      }
      const y = point.y + autoPaintContext.lineWidth
      if (y > strokesHeight && point.side === 'top') {
        strokesHeight = y
      }
    })
  })
  const rectSide = {
    right: {
      x: Math.round(rect.x + rect.width) / 2,
      y: Math.round(rect.y) / 2
    },
    left: {
      x: rect.x / 2 - strokesWidth,
      y: rect.y / 2
    },
    top: {
      x: rect.x / 2,
      y: rect.y / 2 - strokesHeight
    },
  }
  introStrokes = introStrokes.map(stroke => {
    return stroke.map(point => {
      const side = point.side
      point.x = point.x + rectSide[side].x
      point.y = point.y + rectSide[side].y
      return point
    })
  })
}

const delayStart = Date.now()
const aboutPageVideo = document.getElementById('about-page-video')
aboutPageVideo.oncanplay = function() {
  delayIntroStrokes(delayStart)
  normalizeElapsedTimeIntroStrokes()
  positionIntroStrokes()
  console.log('▶️', introStrokes)
  autoPaintIntroStrokesRequestId = window.requestAnimationFrame(autoPaintIntroStrokes)
}
