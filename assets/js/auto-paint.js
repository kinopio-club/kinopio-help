const autoPaintStrokeColor = '#FFD0C1' // salmon
let autoPaintCanvases = {}
let autoPaintContexts = {}
let currentAutoStroke = {}
let isAutoPaintingSections = {}
let isElapsedTimeUpdated = {}
let sectionRequestIds = {}


// utils

function initAutoPaintCanvas (canvasName) {
  autoPaintCanvases[canvasName] = document.getElementById(`canvas-${canvasName}`)
  autoPaintCanvases[canvasName].classList.add('hidden')
  const body = document.body
  const html = document.documentElement
  const pageWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
  const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  autoPaintCanvases[canvasName].width = pageWidth
  autoPaintCanvases[canvasName].height = pageHeight
  autoPaintCanvases[canvasName].classList.remove('hidden')
  console.log('💐 auto paint ready', canvasName)
}

function initContext (contextName) {
  autoPaintContexts[contextName] = autoPaintCanvases[contextName].getContext('2d')
  autoPaintContexts[contextName].scale(2,2)
  autoPaintContexts[contextName].strokeStyle = autoPaintStrokeColor
  autoPaintContexts[contextName].lineWidth = 10
  autoPaintContexts[contextName].lineCap = autoPaintContexts[contextName].lineJoin = 'round'
  currentAutoStroke[contextName] = []
}

function shouldStartNewStrokeIfCurrentStrokeIsEmpty(strokes, currentStroke) {
  const prevStrokesLength = strokes.length
  strokes = strokes.filter(stroke => Boolean(stroke.length))
  const newStrokesLength = strokes.length
  if (prevStrokesLength > newStrokesLength) {
    currentStroke = []
  }
  return { strokes, currentStroke }
}

function paintStroke(contextName) {
  if (currentAutoStroke[contextName].length < 2) { return }
  autoPaintContexts[contextName].beginPath()
  autoPaintContexts[contextName].moveTo(currentAutoStroke[contextName][0].x, currentAutoStroke[contextName][0].y)
  currentAutoStroke[contextName].forEach((point) => {
    autoPaintContexts[contextName].lineTo(point.x, point.y)
  })
  autoPaintContexts[contextName].stroke()
}

function positionStrokes({ element, side, sectionName }) {
  const rect = element.getBoundingClientRect()
  let strokesWidth = 0
  let strokesHeight = 0
  recordedStrokes[sectionName].forEach(stroke => {
    stroke.forEach(point => {
      const pointSide = point.side || side
      const x = point.x + autoPaintContexts[sectionName].lineWidth
      if (x > strokesWidth && pointSide === 'left') {
        strokesWidth = x
      }
      const y = point.y + autoPaintContexts[sectionName].lineWidth
      if (y > strokesHeight && pointSide === 'top') {
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
  recordedStrokes[sectionName] = recordedStrokes[sectionName].map(stroke => {
    return stroke.map(point => {
      const pointSide = point.side || side
      point.x = point.x + rectSide[pointSide].x
      point.y = point.y + rectSide[pointSide].y + (window.scrollY / 2)
      return point
    })
  })
}


function autoPaint(timestamp, sectionName, skipDelay) {
  if (!isElapsedTimeUpdated[sectionName] || skipDelay) {
    recordedStrokes[sectionName] = updateElapsedTime(recordedStrokes[sectionName], timestamp)
    isElapsedTimeUpdated[sectionName] = true
    console.log('▶️', sectionName, recordedStrokes[sectionName])
  }
  let stroke = recordedStrokes[sectionName][0]
  stroke = stroke.filter(point => {
    if (point.elapsedTime <= timestamp) {
      currentAutoStroke[sectionName].push(point)
      return false
    } else {
      return true
    }
  })
  recordedStrokes[sectionName][0] = stroke
  const newStrokes = shouldStartNewStrokeIfCurrentStrokeIsEmpty(recordedStrokes[sectionName], currentAutoStroke[sectionName])
  recordedStrokes[sectionName] = newStrokes.strokes
  currentAutoStroke[sectionName] = newStrokes.currentStroke
  paintStroke(sectionName, currentAutoStroke[sectionName])
  if (recordedStrokes[sectionName].length) {
    sectionRequestIds[sectionName] = window.requestAnimationFrame(function(timestamp) { autoPaint(timestamp, sectionName) })
  } else {
    window.cancelAnimationFrame(sectionRequestIds[sectionName])
  }
}


// Intro

function delayIntroStrokes(delayStart) {
  const autoPaintDelay = 500
  const delay = Date.now() - delayStart + autoPaintDelay
  recordedStrokes.intro = recordedStrokes.intro.map(stroke => {
    return stroke.map(point => {
      point.elapsedTime = point.elapsedTime + delay
      return point
    })
  })
}

function normalizeElapsedTimeIntroStrokes() {
  let lastTime
  let delta = 0
  recordedStrokes.intro = recordedStrokes.intro.map(stroke => {
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

const delayStart = Date.now()
const aboutVideoElement = document.getElementById('about-page-video')
aboutVideoElement.oncanplay = function() {
  delayIntroStrokes(delayStart)
  normalizeElapsedTimeIntroStrokes()
  startPaintingSection({
    sectionName: 'intro',
    side: 'left',
    element: aboutVideoElement,
    skipDelay: true
  })
}


// Trigger Features

function updateElapsedTime(strokes, timestamp) {
  return strokes.map(stroke => {
    return stroke.map(point => {
      point.elapsedTime = point.elapsedTime + timestamp
      return point
    })
  })
}

function startPaintingSection({ sectionName, side, element, skipDelay }) {
  initAutoPaintCanvas(sectionName)
  initContext(sectionName)
  positionStrokes({ element, side, sectionName })
  sectionRequestIds.tags = window.requestAnimationFrame(function(timestamp) { autoPaint(timestamp, sectionName, skipDelay) })
}

let handleIntersect = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const section = entry.target.dataset.section
      if (!isAutoPaintingSections[section]) {
        console.log('🚁', section)
        isAutoPaintingSections[section] = true
        if (section === 'collaboration') {
          startPaintingSection({
            sectionName: 'collaboration',
            side: 'left',
            element: sectionCollaborationElement
          })
        } else if (section === 'images') {
          startPaintingSection({
            sectionName: 'images',
            side: 'right',
            element: sectionImagesElement
          })
        } else if (section === 'tags') {
          startPaintingSection({
            sectionName: 'tags',
            side: 'left',
            element: sectionTagsElement
          })
        } else if (section === 'comments') {

        } else if (section === 'mobile') {

          // 2 parallel sectionnames, and sides, mobile-left, mobile-right

        } else if (section === 'cta') {

        }
      }
    }
  })
}

const sectionCollaborationElement = document.getElementById('feature-collaboration')
const sectionImagesElement = document.getElementById('feature-images')
const sectionTagsElement = document.getElementById('feature-tags')
const sectionCommentsElement = document.getElementById('feature-comments')
const sectionMobileElement = document.getElementById('feature-mobile')
const sectionCtaElement = document.getElementById('bottom-cta')

let observer = new IntersectionObserver(handleIntersect, {
  threshold: 1
})
observer.observe(sectionCollaborationElement)
observer.observe(sectionImagesElement)
observer.observe(sectionTagsElement)
observer.observe(sectionCommentsElement)
observer.observe(sectionMobileElement)
observer.observe(sectionCtaElement)


