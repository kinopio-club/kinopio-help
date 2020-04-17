console.log('🍍')

// Search

let params = (new URL(document.location)).searchParams
let search = params.get("search")
const searchIcon = document.querySelector('nav #search')
const removeIcon = document.querySelector('nav #remove')
const searchInput = document.querySelector('nav input')
const helloSection = document.querySelector('section#hello')

if (search) {
  filterPage(search)
}

searchIcon.addEventListener('click', () => {
  document.querySelector('nav input').focus()
})

removeIcon.addEventListener('click', () => {
  clearFilter()
})

searchInput.addEventListener('input', (event) => {
  const value = document.querySelector('nav input').value
  // TODO if event is keyup is 'enter' then load new page w search query
  if (value) { // to else if
    filterPage(value)
  } else {
    clearFilter()
  }
})

function filterPage(value) {
  console.log('🌹', value)
  helloSection.classList.add('hidden')
}

function clearFilter() {
  helloSection.classList.remove('hidden')
}


// Drawing
// code adapted from https://k-komma.de/assets/js/main.js

let canvas, context, canvasImage, color
let plots = []
let cursorPosition = {
  x: undefined,
  y: undefined,
}

randomColor()
randomSize()
canvas = document.getElementById('background')
canvas.width = window.innerWidth * 2
canvas.height = window.innerHeight * 2
context = canvas.getContext('2d')
context.strokeStyle = color
context.lineWidth = lineWidth
context.lineCap = context.lineJoin = 'round'

function randomColor() {
  const colors = [
    '#fcd1c4', // light pink
    '#abfcec', // light blue
    '#a3d9e1', // blue
    '#fbbfff', // purple
    '#99f6c6', // green
    '#fff0b2', // yellow
  ]
  color = colors[Math.floor(Math.random() * colors.length)]
}

function randomSize() {
  lineWidth = Math.floor(Math.random() * 100 + 25)
}

function throttle(ms, fn) {
  let lastCallTime
  return function () {
    const now = Date.now()
    if (!lastCallTime || now - lastCallTime > ms) {
      lastCallTime = now
      fn.apply(this, arguments)
    }
  }
}

function drawOnCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  if (plots.length === 0) { return }
  context.strokeStyle = color
  context.lineWidth = lineWidth
  context.lineCap = context.lineJoin = 'round'
  context.beginPath()
  context.moveTo(plots[0].x, plots[0].y)
  plots.forEach((plot) => {
    context.lineTo(plot.x, plot.y)
  })
  context.stroke()
  canvasImage = context.getImageData(0, 0, canvas.width, canvas.height)
}

window.onresize = throttle(100, function () {
  canvas.width = window.innerWidth * 2
  canvas.height = window.innerHeight * 2
  context.clearRect(0,0, canvas.width, canvas.height)
  canvasImage && context.putImageData(canvasImage, 0, 0)
})

window.onmousemove = throttle(10, function (event) {
  cursorPosition = {
    x: event.clientX * 2,
    y: event.clientY * 2,
  }
  plots.push({x: cursorPosition.x, y: cursorPosition.y})
  drawOnCanvas()
})

window.ontouchmove = throttle(10, function (event) {
  cursorPosition = {
    x: event.touches[0].clientX * 2,
    y: event.touches[0].clientY * 2,
  }
  plots.push({x: cursorPosition.x, y: cursorPosition.y})
  drawOnCanvas()
})
