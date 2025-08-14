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
    return collection
  })

  config.addCollection("dateSorted", function(collectionApi) {
    return collectionApi.getAll().sort(function (a, b) {
      return a.date - b.date; // sort by date - ascending
      // return b.date - a.date; // sort by date - descending
    })
  });
  return {
    templateFormats: [
  	  "md",
      "css"
    ]
  }
}
