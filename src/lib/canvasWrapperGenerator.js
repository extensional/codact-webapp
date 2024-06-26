/**
 * @param {string} js
 */
export function canvasWrapperGenerator(js) {
  js = ` window.frameElement.addEventListener("load",() => { ${js} });`;
  return `<html><head><script>${js}</script><style>html{height:100%; width:100%;} body{height:100%; width:100%; margin: 0;} canvas{height:100%; width:100%; background-color: white;}</style></head><body><canvas id="myCanvas"></canvas></body></html>`;
}
