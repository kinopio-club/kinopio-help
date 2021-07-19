const autoPaintStrokeColor = '#FFD0C1' // salmon

let autoPaintCanvas, autoPaintContext
let autoPaintContexts = {}


let currentAutoStroke = {}

initAutoPaintCanvas()

function initAutoPaintCanvas () {
  autoPaintCanvas = document.getElementById('auto-paint-background')
  autoPaintCanvas.classList.add('hidden')
  const body = document.body
  const html = document.documentElement
  const pageWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
  const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  autoPaintCanvas.width = pageWidth
  autoPaintCanvas.height = pageHeight
  autoPaintCanvas.classList.remove('hidden')
  console.log('💐 auto paint ready')
}

function initContext (contextName) {
  autoPaintContexts[contextName] = autoPaintCanvas.getContext('2d')
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


// Intro

let autoPaintIntroRequestId


function autoPaintIntro(timestamp) {
  let stroke = introStrokes[0]
  stroke = stroke.filter(point => {
    if (point.elapsedTime <= timestamp) {
      currentAutoStroke.intro.push(point)
      return false
    } else {
      return true
    }
  })
  introStrokes[0] = stroke
  const newStrokes = shouldStartNewStrokeIfCurrentStrokeIsEmpty(introStrokes, currentAutoStroke.intro)
  introStrokes = newStrokes.strokes
  currentAutoStroke.intro = newStrokes.currentStroke
  paintStroke('intro', currentAutoStroke.intro)
  if (introStrokes.length) {
    autoPaintIntroRequestId = window.requestAnimationFrame(autoPaintIntro)
  } else {
    window.cancelAnimationFrame(autoPaintIntroRequestId)
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
      const x = point.x + autoPaintContexts.intro.lineWidth
      if (x > strokesWidth && point.side === 'left') {
        strokesWidth = x
      }
      const y = point.y + autoPaintContexts.intro.lineWidth
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
  initContext('intro')
  delayIntroStrokes(delayStart)
  normalizeElapsedTimeIntroStrokes()
  positionIntroStrokes()
  console.log('▶️ intro', introStrokes)
  autoPaintIntroRequestId = window.requestAnimationFrame(autoPaintIntro)
}

















// Features

let isAutoPaintingSections = {}
let isElapsedTimeUpdated = {}
let autoPaintCollaborationRequestId, autoPaintImagesRequestId, autoPaintTagsRequestId, autoPaintCommentsRequestId, autoPaintMobileRequestId, autoPaintCtaRequestId
let currentCollaborationStroke = []

function updateElapsedTime(strokes, timestamp) {
  return strokes.map(stroke => {
    return stroke.map(point => {
      point.elapsedTime = point.elapsedTime + timestamp
      return point
    })
  })
}



function autoPaintCollaboration(timestamp) {
  if (!isElapsedTimeUpdated.collaboration) {
    collaborationStrokes = updateElapsedTime(collaborationStrokes, timestamp)
    isElapsedTimeUpdated.collaboration = true
    console.log('▶️ collaboration', collaborationStrokes)
  }
  let stroke = collaborationStrokes[0]
  stroke = stroke.filter(point => {
    if (point.elapsedTime <= timestamp) {
      currentAutoStroke.collaboration.push(point)
      return false
    } else {
      return true
    }
  })
  collaborationStrokes[0] = stroke
  const newStrokes = shouldStartNewStrokeIfCurrentStrokeIsEmpty(collaborationStrokes, currentAutoStroke.collaboration)
  collaborationStrokes = newStrokes.strokes
  currentAutoStroke.collaboration = newStrokes.currentStroke
  paintStroke('collaboration', currentAutoStroke.collaboration)
  if (collaborationStrokes.length) {
    autoPaintCollaborationRequestId = window.requestAnimationFrame(autoPaintCollaboration)
  } else {
    window.cancelAnimationFrame(autoPaintCollaborationRequestId)
  }
}

let handleIntersect = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const section = entry.target.dataset.section
      if (!isAutoPaintingSections[section]) {
        console.log('🚁', section)
        isAutoPaintingSections[section] = true
        if (section === 'collaboration') {
          // cannot create more than 1 context per canvas, so have to create a new canvas for each
          initContext('collaboration')
          autoPaintCollaborationRequestId = window.requestAnimationFrame(autoPaintCollaboration)
        } else if (section === 'images') {

        } else if (section === 'tags') {

        } else if (section === 'comments') {

        } else if (section === 'mobile') {

        } else if (section === 'cta') {

        }


        // autoPaintIntroRequestId = window.requestAnimationFrame(autoPaintIntro)

        //   autoPaintIntroRequestId = window.requestAnimationFrame(autoPaintIntro)
        // } else {
        //   window.cancelAnimationFrame(autoPaintIntroRequestId)

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


