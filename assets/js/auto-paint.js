const autoPaintStrokeColor = '#FFD0C1' // salmon

let autoPaintCanvas, autoPaintContext
let autoPaintContexts = {}


let currentAutoStroke = {
  intro: []
}

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
}


function shouldStartNewStroke(strokes, currentStroke) {
  // new stroke if current stroke is empty
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
  const newStrokes = shouldStartNewStroke(introStrokes, currentAutoStroke.intro)
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
let autoPaintCollaborationRequestId, autoPaintImagesRequestId, autoPaintTagsRequestId, autoPaintCommentsRequestId, autoPaintMobileRequestId, autoPaintCtaRequestId
let currentCollaborationStroke = []

function updateElapsedTime(strokes) {
  let time = Date.now() // total time from epoch, not ms from page load
  console.log(time)
  return strokes.map(stroke => {
    return stroke.map(point => {
      point.elapsedTime = point.elapsedTime + time
      return point
    })
  })
}


// temp? globalize
function paintCollaborationStroke() {
  if (currentCollaborationStroke.length < 2) { return }
            console.log('👋')

  autoPaintContext.beginPath()
  autoPaintContext.moveTo(currentCollaborationStroke[0].x, currentCollaborationStroke[0].y)
  currentCollaborationStroke.forEach((point) => {
    autoPaintContext.lineTo(point.x + point.scrollX, point.y + point.scrollY)
  })
  autoPaintContext.stroke()
}


function autoPaintCollaboration(timestamp) {
  let stroke = collaborationStrokes[0]
  stroke = stroke.filter(point => {
    if (point.elapsedTime <= timestamp) {
      currentCollaborationStroke.push(point)
      return false
    } else {
      return true
    }
  })
  collaborationStrokes[0] = stroke
  const newStrokes = shouldStartNewStroke(collaborationStrokes, currentCollaborationStroke)
  collaborationStrokes = newStrokes.strokes
  currentCollaborationStroke = newStrokes.currentStroke
  paintCollaborationStroke()
  if (collaborationStrokes.length) {
    autoPaintCollaborationRequestId = window.requestAnimationFrame(autoPaintCollaboration)
  } else {
    window.cancelAnimationFrame(autoPaintCollaborationRequestId)
  }

  // collaborationStrokes[0] = stroke
  // shouldStartNewStroke(collaborationStrokes, currentCollaborationStroke)
  // paintIntroStroke()
  // if (collaborationStrokes.length) {
  //   autoPaintCollaborationRequestId = window.requestAnimationFrame(autoPaintCollaboration)
  // } else {
  //   window.cancelAnimationFrame(autoPaintCollaborationRequestId)
  // }
}

let handleIntersect = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const section = entry.target.dataset.section
      if (!isAutoPaintingSections[section]) {
        console.log('🚁', section)
        isAutoPaintingSections[section] = true
        if (section === 'collaboration') {
          // collaborationStrokes = updateElapsedTime(collaborationStrokes)
          console.log('▶️ collaboration', collaborationStrokes)
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


