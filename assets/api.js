console.log('🌹 api script ready')

const elements = document.querySelectorAll('code')
elements.forEach(element => {
  if (element.innerText === 'GET') { element.className = 'get-label' }
  if (element.innerText === 'POST') { element.className = 'post-label' }
  if (element.innerText === 'PATCH') { element.className = 'patch-label' }
  if (element.innerText === 'DELETE') { element.className = 'delete-label' }
})

const tables = document.querySelectorAll('table')
tables.forEach(element => {
  element.outerHTML = `<div class="table-wrap">${element.outerHTML}</div>`
})