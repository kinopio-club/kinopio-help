console.log('🍍', fuzzy)

// Search

let params = (new URL(document.location)).searchParams
let search = params.get("search")
const searchIcon = document.querySelector('.search #search')
const removeIcon = document.querySelector('.search #remove')
const searchForm = document.querySelector('.search form')
const searchInput = document.querySelector('.search input')
const helloSection = document.querySelector('section#hello')
const headers = document.querySelectorAll('section#index h2')
const posts = document.querySelectorAll('section#index li')

if (search) {
  searchInput.value = search
  filterPage(search)
}

searchIcon.addEventListener ('click', () => {
  searchInput.focus()
})

removeIcon.addEventListener ('click', () => {
  clearFilter()
})

searchInput.addEventListener ('input', (event) => {
  const value = searchInput.value
  if (value) {
    filterPage(value)
  } else {
    clearFilter()
  }
})

searchForm.addEventListener ('submit', (event) => {
  event.preventDefault()
  const value = searchInput.value
  const searchUrl = `${window.location.origin}?search=${value}`
  window.location.href = searchUrl
})

function filterPage (value) {
  if (!helloSection) { return }
  helloSection.classList.add('hidden')
  filterHeaders(value)
  filterPosts(value)
}

function filterHeaders (value) {
  headers.forEach(header => {
    let postsList = header.dataset.posts
    postsList = postsList.split(',').filter(Boolean)
    const results = fuzzy.filter(value, postsList)
    if (results.length === 0) {
      header.classList.add('hidden')
    } else {
      header.classList.remove('hidden')
    }
  })
}

function filterPosts (value) {
  posts.forEach(post => {
    let postTitle = post.dataset.title
    const results = fuzzy.filter(value, [postTitle])
    if (results.length === 0) {
      post.classList.add('hidden')
    } else {
      post.classList.remove('hidden')
    }
  })
}

function clearFilter () {
  searchInput.value = ""
  if (!helloSection) { return }
  headers.forEach(header => header.classList.remove('hidden'))
  posts.forEach(post => post.classList.remove('hidden'))
  helloSection.classList.remove('hidden')
}


// Drawing
// code adapted from https://k-komma.de/assets/js/main.js

let canvas, context, canvasImage, color
let currentStroke = []
let allStrokes = []
let cursorPosition = {
  x: undefined,
  y: undefined,
}

randomColor()
lineWidth = 125
canvas = document.getElementById('background')
canvas.width = window.innerWidth * 2
canvas.height = window.innerHeight * 2
context = canvas.getContext('2d')
context.strokeStyle = color
context.lineWidth = lineWidth
context.lineCap = context.lineJoin = 'round'
let isDrawing = false

function randomColor() {
  const colors = [
    '#fcd1c4', // light pink
    '#abfcec', // light blue
    // '#c7f0e8', // light teal
    '#a3d9e1', // blue
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

function drawStroke (stroke) {
  const points = stroke || currentStroke
  if (points.length === 0) { return }
  context.strokeStyle = color
  context.lineWidth = lineWidth
  context.lineCap = context.lineJoin = 'round'
  context.beginPath()
  context.moveTo(points[0].x, points[0].y)
  points.forEach((point) => {
    context.lineTo(point.x, point.y)
  })
  context.stroke()
  canvasImage = context.getImageData(0, 0, canvas.width, canvas.height)
}

function redrawAllStrokes () {
  if (allStrokes.length === 0) { return }
  context.clearRect(0, 0, canvas.width, canvas.height)
  allStrokes.forEach(stroke => {
    drawStroke(stroke)
  })
}

function startStroke () {
  currentStroke = []
  isDrawing = true
}

function endStroke () {
  allStrokes.push(currentStroke)
  currentStroke = []
  isDrawing = false
}

function addPointToStroke ({ x, y }) {
  if (!isDrawing) { return }
  currentStroke.push({ x, y })
  drawStroke ()
}

// start
window.onmousedown = function (event) { startStroke() }
window.ontouchstart = function (event) { startStroke() }

// stop
window.onmouseup = function (event) { endStroke() }
window.ontouchend = function (event) { endStroke() }

// draw
window.onmousemove = throttle(10, function (event) {
  addPointToStroke({ x: event.clientX * 2, y: event.clientY * 2 })
})
window.ontouchmove = throttle(10, function (event) {
  addPointToStroke({ x: event.touches[0].clientX * 2, y: event.touches[0].clientY * 2 })
})

// resize
window.onresize = throttle(100, function () {
  canvas.width = window.innerWidth * 2
  canvas.height = window.innerHeight * 2
  context.clearRect(0,0, canvas.width, canvas.height)
  canvasImage && context.putImageData(canvasImage, 0, 0)
})

// scroll
let currentScrollPosition = {
  x: window.scrollX,
  y: window.scrollY
}
window.onscroll = function (event) {
  const scrollDelta = {
    x: currentScrollPosition.x - window.scrollX,
    y: currentScrollPosition.y - window.scrollY
  }
  allStrokes = allStrokes.map(strokes => {
    return strokes.map(point => {
      return {
        x: point.x + (scrollDelta.x * 2),
        y: point.y + (scrollDelta.y * 2)
      }
    })
  })
  currentScrollPosition = {
    x: window.scrollX,
    y: window.scrollY
  }
  redrawAllStrokes()
}
