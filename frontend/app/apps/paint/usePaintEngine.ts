import { useRef, useEffect, useState } from 'react';
import { drawManifesto } from './manifesto';
import { usePaintStore } from './store';
import type { ShapeType, OutlineType } from './constants';

const usePaintEngine = (onReset: () => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const snapshot = useRef<ImageData | null>(null);

  const { tool, shape, color1, color2, brushSize, outlineType } = usePaintStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 1152;
    canvas.height = 648;
    const ctx = canvas.getContext('2d');
    if (ctx) drawManifesto(ctx, canvas.width, canvas.height);
  }, []);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const drawShape = (ctx: CanvasRenderingContext2D, type: ShapeType, x1: number, y1: number, x2: number, y2: number) => {
    const w = x2 - x1;
    const h = y2 - y1;
    ctx.beginPath();

    switch (type) {
      case 'line':
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        break;
      case 'rect':
        ctx.rect(x1, y1, w, h);
        break;
      case 'roundRect':
        const r = Math.min(Math.abs(w), Math.abs(h)) / 5;
        ctx.roundRect(x1, y1, w, h, r);
        break;
      case 'oval':
        ctx.ellipse(x1 + w/2, y1 + h/2, Math.abs(w/2), Math.abs(h/2), 0, 0, Math.PI * 2);
        break;
      case 'triangle':
        ctx.moveTo(x1 + w/2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.closePath();
        break;
      case 'rightTriangle':
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.closePath();
        break;
      case 'diamond':
        ctx.moveTo(x1 + w/2, y1);
        ctx.lineTo(x2, y1 + h/2);
        ctx.lineTo(x1 + w/2, y2);
        ctx.lineTo(x1, y1 + h/2);
        ctx.closePath();
        break;
      case 'pentagon':
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const px = x1 + w/2 + (w/2) * Math.cos(angle);
          const py = y1 + h/2 + (h/2) * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      case 'hexagon':
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6;
          const px = x1 + w/2 + (w/2) * Math.cos(angle);
          const py = y1 + h/2 + (h/2) * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      case 'star':
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
          const radius = i % 2 === 0 ? Math.min(Math.abs(w/2), Math.abs(h/2)) : Math.min(Math.abs(w/2), Math.abs(h/2)) * 0.4;
          const px = x1 + w/2 + radius * Math.cos(angle);
          const py = y1 + h/2 + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      case 'arrow':
        const arrowW = Math.abs(w);
        const headW = arrowW * 0.3;
        const shaftH = Math.abs(h) * 0.4;
        ctx.moveTo(x1, y1 + h/2 - shaftH/2);
        ctx.lineTo(x2 - headW, y1 + h/2 - shaftH/2);
        ctx.lineTo(x2 - headW, y1);
        ctx.lineTo(x2, y1 + h/2);
        ctx.lineTo(x2 - headW, y2);
        ctx.lineTo(x2 - headW, y1 + h/2 + shaftH/2);
        ctx.lineTo(x1, y1 + h/2 + shaftH/2);
        ctx.closePath();
        break;
    }
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const pos = getCoords(e);
    lastPos.current = pos;
    startPos.current = pos;

    if (shape) {
      snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } else if (tool === 'pencil') {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color1;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else if (tool === 'eraser') {
      ctx.lineCap = 'round';
      ctx.lineWidth = brushSize;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos.current || !startPos.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    const pos = getCoords(e);

    if (shape) {
      if (snapshot.current) ctx.putImageData(snapshot.current, 0, 0);
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color1;
      ctx.fillStyle = color2;
      drawShape(ctx, shape, startPos.current.x, startPos.current.y, pos.x, pos.y);
      if (outlineType === 'fill' || outlineType === 'outlineFill') ctx.fill();
      if (outlineType === 'outline' || outlineType === 'outlineFill') ctx.stroke();
    } else {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    lastPos.current = pos;
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.releasePointerCapture(e.pointerId);
    if (tool === 'eraser') ctx.globalCompositeOperation = 'source-over';
    setIsDrawing(false);
    lastPos.current = null;
    startPos.current = null;
    snapshot.current = null;
  };

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    resetCanvas: () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        drawManifesto(ctx, canvasRef.current.width, canvasRef.current.height);
        onReset();
      }
    },
    clearCanvas: () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    },
    exportImage: () => {
      canvasRef.current?.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-sketch.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    },
  };
};

export { usePaintEngine };
