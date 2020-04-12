const screen = window.screen;
const CANVAS_WIDTH = screen.width;
const CANVAS_HEIGHT = screen.height;

const TOPIC_FONT_SIZE = 16;
const TOPIC_PADDING = 8;
const TOPIC_RADIUS = 8;
const MAX_TOPIC_WIDTH = 150;
const MIN_TOPIC_HEIGHT = 15;
const canvasContext = document
  .createElement('canvas')
  .getContext('2d') as CanvasRenderingContext2D;

export {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  TOPIC_FONT_SIZE,
  TOPIC_PADDING,
  MAX_TOPIC_WIDTH,
  TOPIC_RADIUS,
  canvasContext,
  MIN_TOPIC_HEIGHT,
};
