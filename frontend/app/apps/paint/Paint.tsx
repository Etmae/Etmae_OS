import React, { useRef, useEffect, useState } from 'react';
import { create } from 'zustand';
import { usePaintStore } from './store';
import { usePaintEngine } from './usePaintEngine';
import { COLORS, SHAPES, BRUSHES } from './constants';
import type { ToolType, ShapeType, BrushType, OutlineType } from './constants';

// ============================================================================

// MAIN COMPONENT

// ============================================================================

export default function Paint() {
  const store = usePaintStore();
  const [showResetHint, setShowResetHint] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showBrushMenu, setShowBrushMenu] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const engine = usePaintEngine(() => {
    setShowResetHint(true);
    setTimeout(() => setShowResetHint(false), 3000);
  });
  
  return (
    <div className="flex flex-col h-full min-h-[260px] bg-[#f3f3f3] select-none font-['Segoe_UI',system-ui,sans-serif] text-[11px] sm:text-xs md:text-sm">

      {/* Top Menu Bar */}
      <div className="bg-white border-b border-gray-300 px-2 sm:px-3 py-1 flex items-center gap-2 sm:gap-3 overflow-x-auto">

        <button onClick={engine.exportImage} className="p-1.5 hover:bg-gray-100 rounded" title="Save">

          <svg width="16" height="16" fill="currentColor"><path d="M2 2h10l2 2v9a1 1 0 01-1 1H3a1 1 0 01-1-1V2z"/><path d="M4 2v4h6V2"/></svg>

        </button>

        <button className="p-1.5 hover:bg-gray-100 rounded" title="Undo">

          <svg width="16" height="16" fill="currentColor"><path d="M8 3L3 8l5 5v-3h6V6H8V3z"/></svg>

        </button>

        <button className="p-1.5 hover:bg-gray-100 rounded" title="Redo">

          <svg width="16" height="16" fill="currentColor"><path d="M8 3l5 5-5 5v-3H2V6h6V3z"/></svg>

        </button>

        <div className="h-5 w-px bg-gray-300"/>

        

        <div className="relative">

          <button onClick={() => setShowFileMenu(!showFileMenu)} className="px-3 py-1.5 hover:bg-gray-100 rounded text-sm flex items-center gap-1">

            File <svg width="10" height="10" fill="currentColor"><path d="M2 3l3 4 3-4z"/></svg>

          </button>

          {showFileMenu && (

            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-1 w-48">

              <button onClick={() => { engine.clearCanvas(); setShowFileMenu(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">New</button>

              <button onClick={() => { engine.exportImage(); setShowFileMenu(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Save</button>

              <button onClick={() => { engine.exportImage(); setShowFileMenu(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Save as</button>

              <div className="h-px bg-gray-200 my-1"/>

              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Print</button>

            </div>

          )}

        </div>

        

        <div className="relative">

          <button onClick={() => setShowViewMenu(!showViewMenu)} className="px-3 py-1.5 hover:bg-gray-100 rounded text-sm flex items-center gap-1">

            View <svg width="10" height="10" fill="currentColor"><path d="M2 3l3 4 3-4z"/></svg>

          </button>

          {showViewMenu && (

            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-1 w-48">

              <button onClick={() => store.setZoom(Math.min(400, store.zoom + 25))} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Zoom in</button>

              <button onClick={() => store.setZoom(Math.max(25, store.zoom - 25))} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Zoom out</button>

              <button onClick={() => store.setZoom(100)} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Actual size</button>

            </div>

          )}

        </div>

      </div>

      {/* Toolbar */}

      <div className="bg-white border-b border-gray-300 px-2 sm:px-3 py-2 sm:py-2.5">

        <div className="flex flex-wrap md:flex-nowrap items-start gap-3 sm:gap-4">

          {/* Image Tools */}

          <div className="flex flex-col gap-1 min-w-[120px]">

            <span className="text-[11px] text-gray-600 font-semibold">Image</span>

            <div className="flex gap-1">

              <button className="p-2 hover:bg-gray-100 rounded" title="Select">

                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">

                  <rect x="2" y="2" width="12" height="12" strokeDasharray="2"/>

                </svg>

              </button>

              <button className="p-2 hover:bg-gray-100 rounded" title="Crop">

                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">

                  <path d="M5 2v10h10M11 14V4H1"/>

                </svg>

              </button>

              <button className="p-2 hover:bg-gray-100 rounded" title="Resize">

                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">

                  <rect x="3" y="3" width="10" height="10"/>

                  <path d="M13 13l3 3"/>

                </svg>

              </button>

              <button onClick={engine.resetCanvas} className="p-2 hover:bg-gray-100 rounded" title="Reset">

                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">

                  <path d="M4 8a4 4 0 018 0M4 8l-2-2m2 2l2-2"/>

                </svg>

              </button>

            </div>

          </div>

          

          <div className="h-12 w-px bg-gray-300"/>

          

          {/* Tools */}

          <div className="flex flex-col gap-1 min-w-[120px]">

            <span className="text-[11px] text-gray-600 font-semibold">Tools</span>

            <div className="flex gap-1">

              <button onClick={() => store.setTool('pencil')} className={`p-2 hover:bg-gray-100 rounded ${store.tool === 'pencil' ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`} title="Pencil">

                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">

                  <path d="M3 13L13 3M3 13L7 9"/>

                </svg>

              </button>

              <button onClick={() => store.setTool('fill')} className={`p-2 hover:bg-gray-100 rounded ${store.tool === 'fill' ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`} title="Fill">

                <svg width="16" height="16" fill="currentColor">

                  <path d="M8 2L2 8h4v6h4V8h4z"/>

                </svg>

              </button>

              <button onClick={() => store.setTool('text')} className={`p-2 hover:bg-gray-100 rounded ${store.tool === 'text' ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`} title="Text">

                <svg width="16" height="16" fill="currentColor">

                  <path d="M4 2h8v2H9v10H7V4H4z"/>

                </svg>

              </button>

              <button onClick={() => store.setTool('eraser')} className={`p-2 hover:bg-gray-100 rounded ${store.tool === 'eraser' ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`} title="Eraser">

                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">

                  <rect x="4" y="6" width="10" height="7" rx="1"/>

                </svg>

              </button>

              <button onClick={() => store.setTool('picker')} className={`p-2 hover:bg-gray-100 rounded ${store.tool === 'picker' ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`} title="Color picker">

                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">

                  <path d="M8 2v12M2 8h12"/>

                </svg>

              </button>

              <button onClick={() => store.setTool('magnifier')} className={`p-2 hover:bg-gray-100 rounded ${store.tool === 'magnifier' ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`} title="Magnifier">

                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">

                  <circle cx="7" cy="7" r="5"/>

                  <path d="M11 11l4 4"/>

                </svg>

              </button>

            </div>

          </div>

          <div className="h-12 w-px bg-gray-300"/>

          {/* Brushes */}

          <div className="flex flex-col gap-1 relative min-w-[140px]">

            <span className="text-[11px] text-gray-600 font-semibold">Brushes</span>

            <button onClick={() => setShowBrushMenu(!showBrushMenu)} className="px-3 py-2 hover:bg-gray-100 rounded border border-gray-300 flex items-center gap-2 text-sm min-w-[140px]">

              {BRUSHES.find(b => b.id === store.brush)?.name} <svg width="10" height="10" fill="currentColor" className="ml-auto"><path d="M2 3l3 4 3-4z"/></svg>

            </button>

            {showBrushMenu && (

              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-1 w-48">

                {BRUSHES.map((b) => (

                  <button key={b.id} onClick={() => { store.setBrush(b.id as BrushType); setShowBrushMenu(false); }}

                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">

                    {b.name}

                  </button>

                ))}

              </div>

            )}

          </div>

          <div className="h-12 w-px bg-gray-300"/>

          {/* Shapes */}

          <div className="flex flex-col gap-1 relative min-w-[140px]">

            <span className="text-[11px] text-gray-600 font-semibold">Shapes</span>

            <div className="flex gap-2">

              <button onClick={() => setShowShapeMenu(!showShapeMenu)} className="px-3 py-2 hover:bg-gray-100 rounded border border-gray-300 flex items-center gap-2 text-sm min-w-[120px]">

                {store.shape || 'Select'} <svg width="10" height="10" fill="currentColor" className="ml-auto"><path d="M2 3l3 4 3-4z"/></svg>

              </button>

              <div className="grid grid-cols-3 gap-0.5">

                <button onClick={() => store.setOutlineType('outline')} className={`w-7 h-5 border-2 border-black ${store.outlineType === 'outline' ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`} title="Outline"/>

                <button onClick={() => store.setOutlineType('outlineFill')} className={`w-7 h-5 border-2 border-black bg-gray-300 ${store.outlineType === 'outlineFill' ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`} title="Outline and fill"/>

                <button onClick={() => store.setOutlineType('fill')} className={`w-7 h-5 bg-gray-400 border border-gray-300 ${store.outlineType === 'fill' ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`} title="Fill"/>

              </div>

            </div>

            {showShapeMenu && (

              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 grid grid-cols-4 gap-2 p-3 w-96">

                {SHAPES.map((s) => (

                  <button key={s.id} onClick={() => { store.setShape(s.id as ShapeType); setShowShapeMenu(false); }}

                    className={`p-3 hover:bg-gray-100 rounded flex flex-col items-center gap-1 text-[10px] ${store.shape === s.id ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`}>

                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">

                      {s.id === 'line' && <line x1="4" y1="28" x2="28" y2="4"/>}

                      {s.id === 'rect' && <rect x="6" y="10" width="20" height="16"/>}

                      {s.id === 'roundRect' && <rect x="6" y="10" width="20" height="16" rx="3"/>}

                      {s.id === 'oval' && <ellipse cx="16" cy="16" rx="10" ry="8"/>}

                      {s.id === 'triangle' && <path d="M16 6L28 28H4Z"/>}

                      {s.id === 'rightTriangle' && <path d="M4 4L28 28H4Z"/>}

                      {s.id === 'diamond' && <path d="M16 4L28 16L16 28L4 16Z"/>}

                      {s.id === 'pentagon' && <path d="M16 4L28 12L24 28H8L4 12Z"/>}

                      {s.id === 'hexagon' && <path d="M16 4L26 10L26 22L16 28L6 22L6 10Z"/>}

                      {s.id === 'arrow' && <path d="M4 16h18v-6l8 8-8 8v-6H4z"/>}

                      {s.id === 'star' && <path d="M16 4L19 13L28 13L21 18L24 28L16 22L8 28L11 18L4 13L13 13Z"/>}

                    </svg>

                    {s.name}

                  </button>

                ))}

              </div>

            )}

          </div>

          <div className="h-12 w-px bg-gray-300"/>

          {/* Size */}

          <div className="flex flex-col gap-1 relative min-w-[120px]">

            <span className="text-[11px] text-gray-600 font-semibold">Size</span>

            <button onClick={() => setShowSizeMenu(!showSizeMenu)} className="px-3 py-2 hover:bg-gray-100 rounded border border-gray-300 flex items-center gap-2">

              <div className="bg-black rounded-full" style={{ width: `${Math.min(store.brushSize + 4, 16)}px`, height: `${Math.min(store.brushSize + 4, 16)}px` }}/>

              <svg width="10" height="10" fill="currentColor"><path d="M2 3l3 4 3-4z"/></svg>

            </button>

            {showSizeMenu && (

              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-64">

                <input type="range" min="1" max="30" value={store.brushSize} onChange={(e) => store.setBrushSize(Number(e.target.value))}

                  className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"/>

                <div className="flex justify-between mt-2 text-xs text-gray-600">

                  <span>1px</span>

                  <span className="font-semibold">{store.brushSize}px</span>

                  <span>30px</span>

                </div>

              </div>

            )}

          </div>

          <div className="h-12 w-px bg-gray-300"/>

          {/* Colors */}

          <div className="flex flex-col gap-1 min-w-[160px]">

            <span className="text-[11px] text-gray-600 font-semibold">Colors</span>

            <div className="flex gap-2 items-center">

              <div className="relative w-10 h-10">

                <div className="absolute top-0 left-0 w-7 h-7 border-2 border-white shadow-md rounded-sm cursor-pointer"

                  style={{ backgroundColor: store.color1 }} title="Color 1"/>

                <div className="absolute bottom-0 right-0 w-7 h-7 border-2 border-white shadow-md rounded-sm cursor-pointer"

                  style={{ backgroundColor: store.color2 }} title="Color 2"/>

              </div>

              <div className="grid grid-cols-10 gap-0.5">

                {COLORS.map((c) => (

                  <button key={c} onClick={(e) => e.shiftKey ? store.setColor2(c) : store.setColor1(c)}

                    className="w-5 h-5 border border-gray-300 hover:scale-110 transition-transform rounded-sm"

                    style={{ backgroundColor: c }} title={c}/>

                ))}

              </div>

              <button className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-100">

                Edit colors

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Reset Notification */}

      {showResetHint && (

        <div className="bg-[#fff4ce] border-b border-[#e3bb5e] px-4 py-2.5 text-sm text-gray-800 flex items-center gap-2">

          <svg width="16" height="16" fill="currentColor">

            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>

            <path d="M8 4v5l3 2"/>

          </svg>

          <span>Canvas reset to original manifesto sketch</span>

        </div>

      )}

      {/* Canvas Workspace */}

      <div className="flex-1 flex items-center justify-center overflow-auto bg-[#e5e5e5] p-3 sm:p-4 md:p-8">

        <div className="shadow-2xl bg-white" style={{ transform: `scale(${store.zoom / 100})`, transformOrigin: 'center', transition: 'transform 0.15s ease-out' }}>

          <canvas ref={engine.canvasRef} onPointerDown={engine.startDrawing} onPointerMove={engine.draw} onPointerUp={engine.stopDrawing} onPointerLeave={engine.stopDrawing}

            className="cursor-crosshair touch-none" style={{ display: 'block' }}/>

        </div>

      </div>

      {/* Status Bar */}

      <div className="bg-[#f3f3f3] border-t border-gray-300 px-4 py-1.5 flex items-center justify-between text-xs text-gray-700">

        <div className="flex items-center gap-4">

          <span className="font-semibold">1152 × 648px</span>

        </div>

        <div className="flex items-center gap-3">

          <button onClick={() => store.setZoom(Math.max(25, store.zoom - 25))} className="hover:bg-gray-200 px-2 py-1 rounded font-bold">

            −

          </button>

          <input type="range" min="25" max="400" step="25" value={store.zoom} onChange={(e) => store.setZoom(Number(e.target.value))}

            className="w-32 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full"/>

          <button onClick={() => store.setZoom(Math.min(400, store.zoom + 25))} className="hover:bg-gray-200 px-2 py-1 rounded font-bold">

            +

          </button>

          <span className="w-14 text-center font-bold">{store.zoom}%</span>

        </div>

      </div>
      
    </div>

  );

}
