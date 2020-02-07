const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")

module.exports = function(config) {
  config.addPassthroughCopy("./assets")
  config.addPlugin(eleventyNavigationPlugin)

  return {
    templateFormats: [
	  "md",
      "css"
    ]
  }
}
