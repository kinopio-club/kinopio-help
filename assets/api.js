console.log('🌹 api script ready')

const elements = document.querySelectorAll('code')
elements.forEach(element => {
  console.log(element, element.innerText)
  if (element.innerText === 'GET') { element.className = 'get-label' }
  if (element.innerText === 'POST') { element.className = 'post-label' }
  if (element.innerText === 'PATCH') { element.className = 'patch-label' }
  if (element.innerText === 'DELETE') { element.className = 'delete-label' }
})

// parse methods in td, add appropriate class
// parse auth schemes in td , add appropriate class