<template>
  <canvas ref="canvasRef" class="w-full h-full border-none block" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

interface ShapeGridProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
  shape?: 'square' | 'hexagon' | 'circle' | 'triangle';
  hoverTrailAmount?: number;
}

const props = withDefaults(defineProps<ShapeGridProps>(), {
  direction: 'right',
  speed: 1,
  borderColor: '#999',
  squareSize: 40,
  hoverFillColor: '#222',
  shape: 'square',
  hoverTrailAmount: 0
});

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');

let ctx: CanvasRenderingContext2D | null = null;
let requestId: number | null = null;
const gridOffset: GridOffset = { x: 0, y: 0 };
let hoveredSquare: GridOffset | null = null;
let trailCells: GridOffset[] = [];
const cellOpacities = new Map<string, number>();

const drawHex = (cx: number, cy: number, size: number) => {
  if (!ctx) return;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const vx = cx + size * Math.cos(angle);
    const vy = cy + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
};

const drawCircle = (cx: number, cy: number, size: number) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.closePath();
};

const drawTriangle = (cx: number, cy: number, size: number, flip: boolean) => {
  if (!ctx) return;
  ctx.beginPath();
  if (flip) {
    ctx.moveTo(cx, cy + size / 2);
    ctx.lineTo(cx + size / 2, cy - size / 2);
    ctx.lineTo(cx - size / 2, cy - size / 2);
  } else {
    ctx.moveTo(cx, cy - size / 2);
    ctx.lineTo(cx + size / 2, cy + size / 2);
    ctx.lineTo(cx - size / 2, cy + size / 2);
  }
  ctx.closePath();
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};

const drawGrid = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;

  const isHex = props.shape === 'hexagon';
  const isTri = props.shape === 'triangle';
  const hexHoriz = props.squareSize * 1.5;
  const hexVert = props.squareSize * Math.sqrt(3);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isHex) {
    const colShift = Math.floor(gridOffset.x / hexHoriz);
    const offsetX = ((gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
    const offsetY = ((gridOffset.y % hexVert) + hexVert) % hexVert;

    const cols = Math.ceil(canvas.width / hexHoriz) + 3;
    const rows = Math.ceil(canvas.height / hexVert) + 3;

    for (let col = -2; col < cols; col++) {
      for (let row = -2; row < rows; row++) {
        const cx = col * hexHoriz + offsetX;
        const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY;

        const cellKey = `${col},${row}`;
        const alpha = cellOpacities.get(cellKey);
        if (alpha) {
          ctx.globalAlpha = alpha;
          drawHex(cx, cy, props.squareSize);
          ctx.fillStyle = props.hoverFillColor;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        drawHex(cx, cy, props.squareSize);
        ctx.strokeStyle = props.borderColor;
        ctx.stroke();
      }
    }
  } else if (isTri) {
    const halfW = props.squareSize / 2;
    const colShift = Math.floor(gridOffset.x / halfW);
    const rowShift = Math.floor(gridOffset.y / props.squareSize);
    const offsetX = ((gridOffset.x % halfW) + halfW) % halfW;
    const offsetY = ((gridOffset.y % props.squareSize) + props.squareSize) % props.squareSize;

    const cols = Math.ceil(canvas.width / halfW) + 4;
    const rows = Math.ceil(canvas.height / props.squareSize) + 4;

    for (let col = -2; col < cols; col++) {
      for (let row = -2; row < rows; row++) {
        const cx = col * halfW + offsetX;
        const cy = row * props.squareSize + props.squareSize / 2 + offsetY;
        const flip = (((col + colShift + row + rowShift) % 2) + 2) % 2 !== 0;

        const cellKey = `${col},${row}`;
        const alpha = cellOpacities.get(cellKey);
        if (alpha) {
          ctx.globalAlpha = alpha;
          drawTriangle(cx, cy, props.squareSize, flip);
          ctx.fillStyle = props.hoverFillColor;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        drawTriangle(cx, cy, props.squareSize, flip);
        ctx.strokeStyle = props.borderColor;
        ctx.stroke();
      }
    }
  } else if (props.shape === 'circle') {
    const offsetX = ((gridOffset.x % props.squareSize) + props.squareSize) % props.squareSize;
    const offsetY = ((gridOffset.y % props.squareSize) + props.squareSize) % props.squareSize;

    const cols = Math.ceil(canvas.width / props.squareSize) + 3;
    const rows = Math.ceil(canvas.height / props.squareSize) + 3;

    for (let col = -2; col < cols; col++) {
      for (let row = -2; row < rows; row++) {
        const cx = col * props.squareSize + props.squareSize / 2 + offsetX;
        const cy = row * props.squareSize + props.squareSize / 2 + offsetY;

        const cellKey = `${col},${row}`;
        const alpha = cellOpacities.get(cellKey);
        if (alpha) {
          ctx.globalAlpha = alpha;
          drawCircle(cx, cy, props.squareSize);
          ctx.fillStyle = props.hoverFillColor;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        drawCircle(cx, cy, props.squareSize);
        ctx.strokeStyle = props.borderColor;
        ctx.stroke();
      }
    }
  } else {
    const offsetX = ((gridOffset.x % props.squareSize) + props.squareSize) % props.squareSize;
    const offsetY = ((gridOffset.y % props.squareSize) + props.squareSize) % props.squareSize;

    const cols = Math.ceil(canvas.width / props.squareSize) + 3;
    const rows = Math.ceil(canvas.height / props.squareSize) + 3;

    for (let col = -2; col < cols; col++) {
      for (let row = -2; row < rows; row++) {
        const sx = col * props.squareSize + offsetX;
        const sy = row * props.squareSize + offsetY;

        const cellKey = `${col},${row}`;
        const alpha = cellOpacities.get(cellKey);
        if (alpha) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = props.hoverFillColor;
          ctx.fillRect(sx, sy, props.squareSize, props.squareSize);
          ctx.globalAlpha = 1;
        }

        ctx.strokeStyle = props.borderColor;
        ctx.strokeRect(sx, sy, props.squareSize, props.squareSize);
      }
    }
  }

  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, '#0b0b0b');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const updateCellOpacities = () => {
  const targets = new Map<string, number>();

  if (hoveredSquare) {
    targets.set(`${hoveredSquare.x},${hoveredSquare.y}`, 1);
  }

  if (props.hoverTrailAmount > 0) {
    for (let i = 0; i < trailCells.length; i++) {
      const t = trailCells[i];
      const key = `${t.x},${t.y}`;
      if (!targets.has(key)) {
        targets.set(key, (trailCells.length - i) / (trailCells.length + 1));
      }
    }
  }

  for (const [key] of targets) {
    if (!cellOpacities.has(key)) {
      cellOpacities.set(key, 0);
    }
  }

  for (const [key, opacity] of cellOpacities) {
    const target = targets.get(key) || 0;
    const next = opacity + (target - opacity) * 0.15;
    if (next < 0.005) {
      cellOpacities.delete(key);
    } else {
      cellOpacities.set(key, next);
    }
  }
};

const updateAnimation = () => {
  const isHex = props.shape === 'hexagon';
  const isTri = props.shape === 'triangle';
  const hexHoriz = props.squareSize * 1.5;
  const hexVert = props.squareSize * Math.sqrt(3);

  const effectiveSpeed = Math.max(props.speed, 0.1);
  const wrapX = isHex ? hexHoriz * 2 : props.squareSize;
  const wrapY = isHex ? hexVert : isTri ? props.squareSize * 2 : props.squareSize;

  switch (props.direction) {
    case 'right':
      gridOffset.x = (gridOffset.x - effectiveSpeed + wrapX) % wrapX;
      break;
    case 'left':
      gridOffset.x = (gridOffset.x + effectiveSpeed + wrapX) % wrapX;
      break;
    case 'up':
      gridOffset.y = (gridOffset.y + effectiveSpeed + wrapY) % wrapY;
      break;
    case 'down':
      gridOffset.y = (gridOffset.y - effectiveSpeed + wrapY) % wrapY;
      break;
    case 'diagonal':
      gridOffset.x = (gridOffset.x - effectiveSpeed + wrapX) % wrapX;
      gridOffset.y = (gridOffset.y - effectiveSpeed + wrapY) % wrapY;
      break;
  }

  updateCellOpacities();
  drawGrid();
  requestId = requestAnimationFrame(updateAnimation);
};

const handleMouseMove = (event: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const isHex = props.shape === 'hexagon';
  const isTri = props.shape === 'triangle';
  const hexHoriz = props.squareSize * 1.5;
  const hexVert = props.squareSize * Math.sqrt(3);

  let col = 0;
  let row = 0;

  if (isHex) {
    const colShift = Math.floor(gridOffset.x / hexHoriz);
    const offsetX = ((gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
    const offsetY = ((gridOffset.y % hexVert) + hexVert) % hexVert;
    const adjustedX = mouseX - offsetX;
    const adjustedY = mouseY - offsetY;

    col = Math.round(adjustedX / hexHoriz);
    const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
    row = Math.round((adjustedY - rowOffset) / hexVert);
  } else if (isTri) {
    const halfW = props.squareSize / 2;
    const offsetX = ((gridOffset.x % halfW) + halfW) % halfW;
    const offsetY = ((gridOffset.y % props.squareSize) + props.squareSize) % props.squareSize;

    const adjustedX = mouseX - offsetX;
    const adjustedY = mouseY - offsetY;

    col = Math.round(adjustedX / halfW);
    row = Math.floor(adjustedY / props.squareSize);
  } else if (props.shape === 'circle') {
    const offsetX = ((gridOffset.x % props.squareSize) + props.squareSize) % props.squareSize;
    const offsetY = ((gridOffset.y % props.squareSize) + props.squareSize) % props.squareSize;

    const adjustedX = mouseX - offsetX;
    const adjustedY = mouseY - offsetY;

    col = Math.round(adjustedX / props.squareSize);
    row = Math.round(adjustedY / props.squareSize);
  } else {
    const offsetX = ((gridOffset.x % props.squareSize) + props.squareSize) % props.squareSize;
    const offsetY = ((gridOffset.y % props.squareSize) + props.squareSize) % props.squareSize;

    const adjustedX = mouseX - offsetX;
    const adjustedY = mouseY - offsetY;

    col = Math.floor(adjustedX / props.squareSize);
    row = Math.floor(adjustedY / props.squareSize);
  }

  if (!hoveredSquare || hoveredSquare.x !== col || hoveredSquare.y !== row) {
    if (hoveredSquare && props.hoverTrailAmount > 0) {
      trailCells.unshift({ ...hoveredSquare });
      if (trailCells.length > props.hoverTrailAmount) trailCells.length = props.hoverTrailAmount;
    }
    hoveredSquare = { x: col, y: row };
  }
};

const handleMouseLeave = () => {
  if (hoveredSquare && props.hoverTrailAmount > 0) {
    trailCells.unshift({ ...hoveredSquare });
    if (trailCells.length > props.hoverTrailAmount) trailCells.length = props.hoverTrailAmount;
  }
  hoveredSquare = null;
};

const initialize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('resize', resizeCanvas);
  requestId = requestAnimationFrame(updateAnimation);
};

const cleanup = () => {
  const canvas = canvasRef.value;
  if (requestId !== null) {
    cancelAnimationFrame(requestId);
    requestId = null;
  }
  if (canvas) {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseleave', handleMouseLeave);
  }
  window.removeEventListener('resize', resizeCanvas);
  hoveredSquare = null;
  trailCells = [];
  cellOpacities.clear();
};

onMounted(() => {
  initialize();
});

onUnmounted(() => {
  cleanup();
});

watch(
  [
    () => props.direction,
    () => props.speed,
    () => props.borderColor,
    () => props.hoverFillColor,
    () => props.squareSize,
    () => props.shape,
    () => props.hoverTrailAmount
  ],
  () => {
    cleanup();
    initialize();
  }
);
</script>
