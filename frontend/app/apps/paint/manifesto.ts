const drawManifesto = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#2c2c2c';
  ctx.fillStyle = '#2c2c2c';
  ctx.lineWidth = 2;
  ctx.font = '24px "Segoe UI", system-ui, sans-serif';
  ctx.fillText('Portfolio OS Architecture', 60, 60);

  ctx.font = '14px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#5c5c5c';
  ctx.fillText('A sketch of how this system works', 60, 85);

  ctx.strokeStyle = '#0078d4';
  ctx.fillStyle = '#0078d4';
  ctx.lineWidth = 2;
  ctx.strokeRect(100, 130, 200, 80);
  ctx.font = 'bold 14px "Segoe UI"';
  ctx.fillText('Browser Environment', 120, 155);
  ctx.font = '12px "Segoe UI"';
  ctx.fillStyle = '#5c5c5c';
  ctx.fillText('• React + TypeScript', 120, 180);
  ctx.fillText('• Canvas API', 120, 195);

  ctx.strokeStyle = '#0078d4';
  ctx.fillStyle = '#0078d4';
  ctx.strokeRect(400, 130, 200, 80);
  ctx.font = 'bold 14px "Segoe UI"';
  ctx.fillText('Windows 11 Shell', 420, 155);
  ctx.font = '12px "Segoe UI"';
  ctx.fillStyle = '#5c5c5c';
  ctx.fillText('• Taskbar + Start Menu', 420, 180);
  ctx.fillText('• Window Manager', 420, 195);

  ctx.strokeStyle = '#107c10';
  ctx.fillStyle = '#107c10';
  ctx.strokeRect(100, 260, 130, 90);
  ctx.font = 'bold 13px "Segoe UI"';
  ctx.fillText('File Explorer', 115, 285);
  ctx.font = '11px "Segoe UI"';
  ctx.fillStyle = '#5c5c5c';
  ctx.fillText('Projects & work', 115, 305);
  ctx.fillText('Primary nav', 115, 320);

  ctx.strokeStyle = '#107c10';
  ctx.fillStyle = '#107c10';
  ctx.strokeRect(260, 260, 130, 90);
  ctx.font = 'bold 13px "Segoe UI"';
  ctx.fillText('Terminal', 275, 285);
  ctx.font = '11px "Segoe UI"';
  ctx.fillStyle = '#5c5c5c';
  ctx.fillText('Skills showcase', 275, 305);
  ctx.fillText('Interactive CLI', 275, 320);

  ctx.strokeStyle = '#107c10';
  ctx.fillStyle = '#107c10';
  ctx.strokeRect(420, 260, 130, 90);
  ctx.font = 'bold 13px "Segoe UI"';
  ctx.fillText('Paint', 450, 285);
  ctx.font = '11px "Segoe UI"';
  ctx.fillStyle = '#5c5c5c';
  ctx.fillText('Delight moment', 450, 305);
  ctx.fillText('Simple & focused', 450, 320);

  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 3]);
  ctx.beginPath();
  ctx.moveTo(300, 170);
  ctx.lineTo(400, 170);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(200, 210);
  ctx.lineTo(165, 260);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(500, 210);
  ctx.lineTo(485, 260);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#8b4513';
  ctx.font = 'italic 14px "Segoe UI"';
  ctx.fillText('"Build with constraints. Ship with intent."', 100, 410);

  ctx.fillStyle = '#999';
  ctx.font = '12px "Segoe UI"';
  ctx.fillText('✏️ You can draw over this — or reset it anytime', 100, 450);
};

export { drawManifesto };