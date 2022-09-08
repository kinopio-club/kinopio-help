module.exports = function(config) {
  config.addPassthroughCopy("./assets")
  config.setQuietMode(true)

  // https://www.11ty.dev/docs/collections/#collection-api-methods
  config.addCollection("alphabeticallySorted", collectionApi => {
    const posts = collectionApi.getAll()
    let titles = posts.map(post => {
      return post.data.title
    })
    titles = titles.sort()
    const collection = titles.map(title => {
      return posts.find(post => post.data.title === title)
    })
    console.log(titles, collection[0].data.tags)
    return collection
  })

  return {
    templateFormats: [
  	  "md",
      "css"
    ]
  }
}
