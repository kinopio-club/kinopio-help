module.exports = function(config) {
  config.addPassthroughCopy("./assets")

  return {
    templateFormats: [
	  "md",
      "css"
    ]
  }
}
