/**
 * @param {string} js
 */
export function canvasWrapperGenerator(js) {
  return `<html><head><script>${js}</script></head><body><canvas></canvas></body></html>`
}
