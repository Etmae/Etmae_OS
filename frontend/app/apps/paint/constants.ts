// ============================================================================

// TYPES

// ============================================================================

export type ToolType = 'pencil' | 'fill' | 'text' | 'eraser' | 'picker' | 'magnifier';

export type ShapeType = 'line' | 'oval' | 'rect' | 'roundRect' | 'triangle' | 'rightTriangle' | 'diamond' | 'pentagon' | 'hexagon' | 'arrow' | 'star';

export type BrushType = 'brush' | 'calligraphy' | 'airbrush' | 'oil' | 'crayon' | 'marker' | 'natural' | 'watercolor';

export type OutlineType = 'outline' | 'outlineFill' | 'fill';

// ============================================================================

// CONSTANTS

// ============================================================================

export const COLORS = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200',
  '#22b14c', '#00a2e8', '#3f48cc', '#a349a4', '#ffffff', '#c3c3c3',
  '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea',
  '#7092be', '#c8bfe7'
];

export const SHAPES = [
  { id: 'line', name: 'Line' },
  { id: 'oval', name: 'Oval' },
  { id: 'rect', name: 'Rectangle' },
  { id: 'roundRect', name: 'Rounded rectangle' },
  { id: 'triangle', name: 'Triangle' },
  { id: 'rightTriangle', name: 'Right triangle' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'pentagon', name: 'Pentagon' },
  { id: 'hexagon', name: 'Hexagon' },
  { id: 'arrow', name: 'Arrow' },
  { id: 'star', name: 'Star' },
];

export const BRUSHES = [
  { id: 'brush', name: 'Brush' },
  { id: 'calligraphy', name: 'Calligraphy pen' },
  { id: 'airbrush', name: 'Airbrush' },
  { id: 'oil', name: 'Oil brush' },
  { id: 'crayon', name: 'Crayon' },
  { id: 'marker', name: 'Marker' },
  { id: 'natural', name: 'Natural pencil' },
  { id: 'watercolor', name: 'Watercolor' },
];