module.exports = function(config) {
  config.addPassthroughCopy('styles')
  return {
    passthroughFileCopy: true,
  }
}
