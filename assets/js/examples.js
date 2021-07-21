console.log('🍉 examples ready')

const uses = document.querySelectorAll('.use')
const examples = document.querySelectorAll('.example')

function hideAll () {
  uses.forEach(use => {
    use.classList.remove('active')
  })
  examples.forEach(example => {
    example.classList.add('hidden')
  })
}

function updateTrianglePosition(use, example) {
  const triangleWidth = 16
  const useRect = use.getBoundingClientRect()
  const exampleRect = example.getBoundingClientRect()
  const triangle = example.querySelector('.triangle')
  const positionX = (useRect.x - exampleRect.x) + (useRect.width / 2) - (triangleWidth / 2)
  triangle.style.left = positionX + 'px'
}

function showExample (type) {
  console.log('🍅', type, uses)
  const use = Array.from(uses).find(element => element.dataset.type === type)
  const example = Array.from(examples).find(element => element.dataset.type === type)
  use.classList.add('active')
  example.classList.remove('hidden')
  updateTrianglePosition(use, example)
}


hideAll()
showExample('mind-mapping')
uses.forEach(use => {
  use.addEventListener('click', (event) => {
    hideAll()
    showExample(event.target.dataset.type)
  })
})

