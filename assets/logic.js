// window.onload = function () {

console.log('🍍')

// search

document.querySelector('nav img').addEventListener('click',
  () => {
    document.querySelector('nav input').focus()
  }
)

// drawing
// adapted from https://k-komma.de/assets/js/main.js

let canvas, context, canvasImage
let plots = []

let cursorPosition = {
  x: undefined,
  y: undefined,
};
let color = '#e5e5e5';
// let lineWidth = 30;

function randomColor() {
  const colors = [
    '#fcd1c4',
    '#abfcec',
    '#a3d9e1',
    '#fbbfff',
    '#a9ef8f',
    '#fff0b2',
    '#fff0b2',
  ]
  color = colors[Math.floor(Math.random() * colors.length)];
}

function randomSize() {
  // const sizes = [10, 15, 20, 25, 30, 35]
  // size = sizes[Math.floor(Math.random() * sizes.length)];
  lineWidth = Math.floor(Math.random() * 100 + 25)
}

function throttle(ms, fn) {
  var lastCallTime;
  return function () {
    var now = Date.now();
    if (!lastCallTime || now - lastCallTime > ms) {
      lastCallTime = now;
      fn.apply(this, arguments);
    }
  }
}

// function drawCircle(event) {
//   context.beginPath();
//   context.arc(cursorPosition.x, cursorPosition.y, size, 0, 2 * Math.PI);
//   context.closePath();
//   context.fillStyle = color;
//   context.fill();
//   canvasImage = context.getImageData(0, 0, window.innerWidth, window.innerHeight);
// }

// function drawOnCanvas() {
//     // context.clearRect(0,0, window.innerWidth, window.innerHeight);
//                 context.strokeStyle = color;
//                 context.lineWidth = lineWidth;
//                 context.beginPath();

//                 context.moveTo(plots[0].x, plots[0].y);
//                 for(var i=1; i<plots.length; i++) {
//                   context.lineTo(plots[i].x, plots[i].y);
//                 }

//                 // context.moveTo(cursorPosition.x, cursorPosition.y);
//                     // console.log('draw', cursorPosition, context)

//                 context.stroke()
// }

function drawOnCanvas() {
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  // console.log(lineWidth)

    if (plots.length !== 0) {

      context.strokeStyle = color;
        context.lineWidth = lineWidth;
              context.lineCap = context.lineJoin = 'round'

    context.beginPath();
    context.moveTo(plots[0].x, plots[0].y);

      for(var i=1; i<plots.length; i++) {
        context.lineTo(plots[i].x, plots[i].y);
      }
      context.stroke();
      canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);

    }
}

// function cycleUserDraw () {



// }

// window.onload = function () {
randomColor();
randomSize()
canvas = document.getElementById('background');
canvas.width = window.innerWidth * 2
canvas.height = window.innerHeight * 2
context = canvas.getContext('2d')
    context.strokeStyle = color;
    context.lineWidth = lineWidth; // to linewidth
    context.lineCap = context.lineJoin = 'round'



window.onresize = throttle(100, function () {
  canvas.width = window.innerWidth * 2
  canvas.height = window.innerHeight * 2
  context.clearRect(0,0, canvas.width, canvas.height);
  canvasImage && context.putImageData(canvasImage, 0, 0);
});

window.onmousemove = throttle(10, function (event) {
  cursorPosition = {
    x: event.clientX * 2,
    y: event.clientY * 2,
  };
  // drawCircle(event);
  plots.push({x: cursorPosition.x, y: cursorPosition.y})
  drawOnCanvas()
});

window.ontouchmove = throttle(10, function (event) {
  // round nums for touch screen
  cursorPosition = {
    x: event.touches[0].clientX * 2,
    y: event.touches[0].clientY * 2,
  };
  // drawCircle(event);
  plots.push({x: cursorPosition.x, y: cursorPosition.y})
  drawOnCanvas()
});
// }
// }