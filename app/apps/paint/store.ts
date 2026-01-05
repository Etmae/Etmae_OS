import { create } from 'zustand';
import type { ToolType, ShapeType, BrushType, OutlineType } from './constants';

interface PaintState {
  tool: ToolType | null;
  shape: ShapeType | null;
  brush: BrushType;
  color1: string;
  color2: string;
  brushSize: number;
  outlineType: OutlineType;
  zoom: number;
  setTool: (t: ToolType | null) => void;
  setShape: (s: ShapeType | null) => void;
  setBrush: (b: BrushType) => void;
  setColor1: (c: string) => void;
  setColor2: (c: string) => void;
  setBrushSize: (s: number) => void;
  setOutlineType: (o: OutlineType) => void;
  setZoom: (z: number) => void;
}

const usePaintStore = create<PaintState>((set) => ({
  tool: 'pencil',
  shape: null,
  brush: 'brush',
  color1: '#000000',
  color2: '#ffffff',
  brushSize: 3,
  outlineType: 'outline',
  zoom: 100,
  setTool: (tool) => set({ tool, shape: null }),
  setShape: (shape) => set({ shape, tool: null }),
  setBrush: (brush) => set({ brush }),
  setColor1: (color1) => set({ color1 }),
  setColor2: (color2) => set({ color2 }),
  setBrushSize: (brushSize) => set({ brushSize }),
  setOutlineType: (outlineType) => set({ outlineType }),
  setZoom: (zoom) => set({ zoom }),
}));

export { usePaintStore };