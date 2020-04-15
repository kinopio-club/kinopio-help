module.exports = function(config) {
  config.addPassthroughCopy("./assets")
  config.setQuietMode(true)

  return {
    templateFormats: [
	  "md",
      "css"
    ]
  }
}
