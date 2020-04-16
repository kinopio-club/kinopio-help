let params = (new URL(document.location)).searchParams
let search = params.get("search")
console.log('🍍', search)
// if (search) {
//   doSearch(search)
// }

// Search

document.querySelector('nav img').addEventListener('click',
  () => {
    document.querySelector('nav input').focus()
  }
)

// just filtering wont work in subpages
// unless submitting the search , sends you to root w a query string
  // onload , look for query string and set up search
document.querySelector('nav input').addEventListener('input',
  (event) => {
    const value = document.querySelector('nav input').value
    console.log('🌸',event, value)
    const helloSection = document.querySelector('#hello')
    // const elementsToHide =
    if (value) {
      console.log('🌹')
      // elementsToHide add class hidden
      // show an X next to search bar to clear search
            // @click = clearSearch()
    } else {
      console.log('🦋 x.i am empty')
      // elementsToHide remove class hidden
      // clearSearch()
    }
  }
)


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
