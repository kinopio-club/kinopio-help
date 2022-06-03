console.log('🍍 search ready')

// Search

let params = (new URL(document.location)).searchParams
let search = params.get("search")
const searchIcon = document.querySelector('.search #search')
const removeIcon = document.querySelector('.search #remove')
const searchForm = document.querySelector('.search form')
const searchInput = document.querySelector('.search input')
const quickStartSection = document.querySelector('section#quickStart')
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
  if (!quickStartSection) { return }
  quickStartSection.classList.add('hidden')
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
  if (!quickStartSection) { return }
  headers.forEach(header => header.classList.remove('hidden'))
  posts.forEach(post => post.classList.remove('hidden'))
  quickStartSection.classList.remove('hidden')
}