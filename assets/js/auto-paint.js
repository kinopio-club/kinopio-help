let playbackCanvas, playbackContext, playbackColor

initPlaybackCanvas()

function initPlaybackCanvas () {
  playbackCanvas = document.getElementById('playback-background')
  playbackCanvas.classList.add('hidden')
  const body = document.body
  const html = document.documentElement
  const pageWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
  const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  playbackCanvas.width = pageWidth
  playbackCanvas.height = pageHeight
  playbackContext = playbackCanvas.getContext('2d')
  playbackContext.scale(2,2)
  playbackContext.strokeStyle = 'blue' // TODO special color, from moodboard
  playbackContext.lineWidth = 10
  playbackContext.lineCap = playbackContext.lineJoin = 'round'
  playbackCanvas.classList.remove('hidden')
  console.log('💐 auto paint ready')
}


let playbackOverviewStrokesRequestId
let playbackStroke = []
let overviewStrokes = [
  [
    // TODO add direction: right, left, top, bottom
    {x: 8.5, y: 9, scrollX: 0, scrollY: 0, elapsedTime: 126}, {x: 9, y: 9.5, scrollX: 0, scrollY: 0, elapsedTime: 144}, {x: 9, y: 9.5, scrollX: 0, scrollY: 0, elapsedTime: 155}, {x: 9.5, y: 10.5, scrollX: 0, scrollY: 0, elapsedTime: 169}, {x: 10.5, y: 12, scrollX: 0, scrollY: 0, elapsedTime: 180}, {x: 11.5, y: 13.5, scrollX: 0, scrollY: 0, elapsedTime: 196}, {x: 13, y: 14.5, scrollX: 0, scrollY: 0, elapsedTime: 212}, {x: 14, y: 16, scrollX: 0, scrollY: 0, elapsedTime: 228}, {x: 15, y: 17.5, scrollX: 0, scrollY: 0, elapsedTime: 244}, {x: 16, y: 18.5, scrollX: 0, scrollY: 0, elapsedTime: 260}, {x: 17, y: 19.5, scrollX: 0, scrollY: 0, elapsedTime: 277}, {x: 18, y: 20.5, scrollX: 0, scrollY: 0, elapsedTime: 293}, {x: 18.5, y: 21.5, scrollX: 0, scrollY: 0, elapsedTime: 310}, {x: 19, y: 22, scrollX: 0, scrollY: 0, elapsedTime: 327}, {x: 19.5, y: 22, scrollX: 0, scrollY: 0, elapsedTime: 344}, {x: 19.5, y: 22.5, scrollX: 0, scrollY: 0, elapsedTime: 360}, {x: 20, y: 23, scrollX: 0, scrollY: 0, elapsedTime: 376}, {x: 21, y: 23.5, scrollX: 0, scrollY: 0, elapsedTime: 388}, {x: 22, y: 24.5, scrollX: 0, scrollY: 0, elapsedTime: 404}, {x: 24, y: 25.5, scrollX: 0, scrollY: 0, elapsedTime: 420}, {x: 25.5, y: 26.5, scrollX: 0, scrollY: 0, elapsedTime: 436}, {x: 27.5, y: 28, scrollX: 0, scrollY: 0, elapsedTime: 453}, {x: 30.5, y: 29, scrollX: 0, scrollY: 0, elapsedTime: 469}, {x: 33.5, y: 30.5, scrollX: 0, scrollY: 0, elapsedTime: 485}, {x: 36.5, y: 32, scrollX: 0, scrollY: 0, elapsedTime: 501}, {x: 38.5, y: 32.5, scrollX: 0, scrollY: 0, elapsedTime: 517}, {x: 40.5, y: 32.5, scrollX: 0, scrollY: 0, elapsedTime: 533}, {x: 41.5, y: 32.5, scrollX: 0, scrollY: 0, elapsedTime: 549}, {x: 41.5, y: 32.5, scrollX: 0, scrollY: 0, elapsedTime: 560}, {x: 42, y: 32.5, scrollX: 0, scrollY: 0, elapsedTime: 576}, {x: 43, y: 32, scrollX: 0, scrollY: 0, elapsedTime: 588}, {x: 44.5, y: 31.5, scrollX: 0, scrollY: 0, elapsedTime: 604}, {x: 47, y: 29.5, scrollX: 0, scrollY: 0, elapsedTime: 620}, {x: 49.5, y: 28.5, scrollX: 0, scrollY: 0, elapsedTime: 637}, {x: 52, y: 27, scrollX: 0, scrollY: 0, elapsedTime: 653}, {x: 56.5, y: 25, scrollX: 0, scrollY: 0, elapsedTime: 668}, {x: 59.5, y: 24, scrollX: 0, scrollY: 0, elapsedTime: 685}, {x: 61.5, y: 23.5, scrollX: 0, scrollY: 0, elapsedTime: 701}, {x: 63, y: 23, scrollX: 0, scrollY: 0, elapsedTime: 716}, {x: 64.5, y: 23, scrollX: 0, scrollY: 0, elapsedTime: 733}, {x: 65.5, y: 23, scrollX: 0, scrollY: 0, elapsedTime: 746}, {x: 67, y: 23, scrollX: 0, scrollY: 0, elapsedTime: 761}, {x: 68, y: 23.5, scrollX: 0, scrollY: 0, elapsedTime: 776}, {x: 69.5, y: 23.5, scrollX: 0, scrollY: 0, elapsedTime: 788}, {x: 71.5, y: 25, scrollX: 0, scrollY: 0, elapsedTime: 805}, {x: 73.5, y: 26, scrollX: 0, scrollY: 0, elapsedTime: 821}, {x: 76, y: 27, scrollX: 0, scrollY: 0, elapsedTime: 837}, {x: 77, y: 28, scrollX: 0, scrollY: 0, elapsedTime: 853}, {x: 77.5, y: 28.5, scrollX: 0, scrollY: 0, elapsedTime: 869}, {x: 78.5, y: 28.5, scrollX: 0, scrollY: 0, elapsedTime: 893}, {x: 78.5, y: 29, scrollX: 0, scrollY: 0, elapsedTime: 911}
  ],
  [
    {x: 5, y: 56.5, scrollX: 0, scrollY: 0, elapsedTime: 14485}, {x: 6.5, y: 57, scrollX: 0, scrollY: 0, elapsedTime: 14503}, {x: 7.5, y: 57, scrollX: 0, scrollY: 0, elapsedTime: 14519}, {x: 10, y: 57, scrollX: 0, scrollY: 0, elapsedTime: 14535}, {x: 13.5, y: 57.5, scrollX: 0, scrollY: 0, elapsedTime: 14548}, {x: 14.5, y: 57.5, scrollX: 0, scrollY: 0, elapsedTime: 14559}, {x: 18.5, y: 57.5, scrollX: 0, scrollY: 0, elapsedTime: 14575}, {x: 21, y: 58, scrollX: 0, scrollY: 0, elapsedTime: 14588}, {x: 23.5, y: 58.5, scrollX: 0, scrollY: 0, elapsedTime: 14604}, {x: 24.5, y: 59, scrollX: 0, scrollY: 0, elapsedTime: 14621}, {x: 26, y: 59, scrollX: 0, scrollY: 0, elapsedTime: 14637}, {x: 27.5, y: 60, scrollX: 0, scrollY: 0, elapsedTime: 14653}, {x: 28.5, y: 60.5, scrollX: 0, scrollY: 0, elapsedTime: 14669}, {x: 29.5, y: 61, scrollX: 0, scrollY: 0, elapsedTime: 14684}, {x: 30.5, y: 62, scrollX: 0, scrollY: 0, elapsedTime: 14700}, {x: 32, y: 63, scrollX: 0, scrollY: 0, elapsedTime: 14716}, {x: 33, y: 63.5, scrollX: 0, scrollY: 0, elapsedTime: 14733}, {x: 34, y: 64, scrollX: 0, scrollY: 0, elapsedTime: 14745}, {x: 35.5, y: 65, scrollX: 0, scrollY: 0, elapsedTime: 14761}, {x: 37.5, y: 65.5, scrollX: 0, scrollY: 0, elapsedTime: 14776}, {x: 39, y: 66, scrollX: 0, scrollY: 0, elapsedTime: 14788}, {x: 40, y: 66, scrollX: 0, scrollY: 0, elapsedTime: 14805}, {x: 40.5, y: 66.5, scrollX: 0, scrollY: 0, elapsedTime: 14821}, {x: 41.5, y: 66.5, scrollX: 0, scrollY: 0, elapsedTime: 14837}, {x: 42, y: 66.5, scrollX: 0, scrollY: 0, elapsedTime: 14853}, {x: 43.5, y: 66.5, scrollX: 0, scrollY: 0, elapsedTime: 14869}, {x: 45, y: 66.5, scrollX: 0, scrollY: 0, elapsedTime: 14885}, {x: 46.5, y: 66, scrollX: 0, scrollY: 0, elapsedTime: 14901}, {x: 47.5, y: 66, scrollX: 0, scrollY: 0, elapsedTime: 14917}, {x: 48, y: 65.5, scrollX: 0, scrollY: 0, elapsedTime: 14934}, {x: 48.5, y: 65.5, scrollX: 0, scrollY: 0, elapsedTime: 14949}
  ],
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

function delayOverviewStrokes(delayStart) {
  const playbackDelay = 500
  const delay = Date.now() - delayStart + playbackDelay
  overviewStrokes = overviewStrokes.map(stroke => {
    return stroke.map(point => {
      point.elapsedTime = point.elapsedTime + delay
      return point
    })
  })
}

function positionOverlayStrokes() {
  const element = document.getElementById('about-page-video')
  const rect = element.getBoundingClientRect()
  const rectSide = {
    right: {
      x: Math.round(rect.x + rect.width) / 2,
      y: Math.round(rect.y) / 2
    }
  }
  overviewStrokes = overviewStrokes.map(stroke => {
    return stroke.map(point => {
      point.x = point.x + rectSide['right'].x
      point.y = point.y + rectSide['right'].y
      return point
    })
  })
}

const delayStart = Date.now()
const aboutPageVideo = document.getElementById('about-page-video')
aboutPageVideo.oncanplay = function() {
  delayOverviewStrokes(delayStart)
  positionOverlayStrokes()
  console.log('▶️', overviewStrokes)
  playbackOverviewStrokesRequestId = window.requestAnimationFrame(playbackOverviewStrokes)
}
