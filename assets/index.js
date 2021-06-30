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

if (searchInput) {
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
}

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

let canvas, context, canvasImage, color, prevScroll
let pageCanvas, pageContext
const lineWidth = 30
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
console.log('🌸 drawing ready')

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
  const body = document.body
  const html = document.documentElement
  const pageWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
  const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  pageCanvas = document.getElementById('page-background')
  pageCanvas.width = pageWidth
  pageCanvas.height = pageHeight
  pageContext = pageCanvas.getContext('2d')
  pageContext.scale(2,2)
  pageContext.strokeStyle = color
  pageContext.lineWidth = lineWidth
  pageContext.lineCap = pageContext.lineJoin = 'round'
}

function randomColor () {
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

function startStroke () {
  currentStroke = []
  isDrawing = true
}

function endStroke () {
  allStrokes.push(currentStroke)
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
    scrollY: prevScroll.y / 2
  })
  drawCurrentStroke()
}

// start
window.onmousedown = function (event) { startStroke() }
window.ontouchstart = function (event) {
  isTouch = true
  startStroke()
}

// stop
window.onmouseup = function (event) { endStroke() }
window.ontouchend = function (event) { endStroke() }

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
  if (isTouch) { return }
  initCanvas()
  initPageCanvas()
  redrawAllStrokes()
})

// scroll
window.onscroll = function (event) {
  prevScroll = {
    x: window.scrollX,
    y: window.scrollY
  }
}
