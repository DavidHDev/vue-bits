<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

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

const canvasRef = ref<HTMLCanvasElement | null>(null);

let requestId: number | null = null;

const numSquaresX = ref(0);
const numSquaresY = ref(0);

const gridOffset = ref<GridOffset>({
  x: 0,
  y: 0
});

const hoveredSquare = ref<GridOffset | null>(null);

const trailCells = ref<GridOffset[]>([]);

const cellOpacities = ref<Map<string, number>>(new Map());

let cleanup: (() => void) | null = null;

function initCanvas() {
  const canvas = canvasRef.value;

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  const isHex = props.shape === 'hexagon';
  const isTri = props.shape === 'triangle';

  const hexHoriz = props.squareSize * 1.5;
  const hexVert = props.squareSize * Math.sqrt(3);

  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    numSquaresX.value = Math.ceil(canvas.width / props.squareSize) + 1;
    numSquaresY.value = Math.ceil(canvas.height / props.squareSize) + 1;
  };

  const drawHex = (cx: number, cy: number, size: number) => {
    ctx.beginPath();

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;

      const vx = cx + size * Math.cos(angle);
      const vy = cy + size * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(vx, vy);
      } else {
        ctx.lineTo(vx, vy);
      }
    }

    ctx.closePath();
  };

  const drawCircle = (cx: number, cy: number, size: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.closePath();
  };

  const drawTriangle = (cx: number, cy: number, size: number, flip: boolean) => {
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

  const drawGrid = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isHex) {
      const colShift = Math.floor(gridOffset.value.x / hexHoriz);

      const offsetX = ((gridOffset.value.x % hexHoriz) + hexHoriz) % hexHoriz;

      const offsetY = ((gridOffset.value.y % hexVert) + hexVert) % hexVert;

      const cols = Math.ceil(canvas.width / hexHoriz) + 3;
      const rows = Math.ceil(canvas.height / hexVert) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * hexHoriz + offsetX;

          const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY;

          const cellKey = `${col},${row}`;

          const alpha = cellOpacities.value.get(cellKey);

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

      const colShift = Math.floor(gridOffset.value.x / halfW);

      const rowShift = Math.floor(gridOffset.value.y / props.squareSize);

      const offsetX = ((gridOffset.value.x % halfW) + halfW) % halfW;

      const offsetY = ((gridOffset.value.y % props.squareSize) + props.squareSize) % props.squareSize;

      const cols = Math.ceil(canvas.width / halfW) + 4;
      const rows = Math.ceil(canvas.height / props.squareSize) + 4;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * halfW + offsetX;

          const cy = row * props.squareSize + props.squareSize / 2 + offsetY;

          const flip = (((col + colShift + row + rowShift) % 2) + 2) % 2 !== 0;

          const cellKey = `${col},${row}`;

          const alpha = cellOpacities.value.get(cellKey);

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
      const offsetX = ((gridOffset.value.x % props.squareSize) + props.squareSize) % props.squareSize;

      const offsetY = ((gridOffset.value.y % props.squareSize) + props.squareSize) % props.squareSize;

      const cols = Math.ceil(canvas.width / props.squareSize) + 3;
      const rows = Math.ceil(canvas.height / props.squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * props.squareSize + props.squareSize / 2 + offsetX;

          const cy = row * props.squareSize + props.squareSize / 2 + offsetY;

          const cellKey = `${col},${row}`;

          const alpha = cellOpacities.value.get(cellKey);

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
      const offsetX = ((gridOffset.value.x % props.squareSize) + props.squareSize) % props.squareSize;

      const offsetY = ((gridOffset.value.y % props.squareSize) + props.squareSize) % props.squareSize;

      const cols = Math.ceil(canvas.width / props.squareSize) + 3;
      const rows = Math.ceil(canvas.height / props.squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const sx = col * props.squareSize + offsetX;

          const sy = row * props.squareSize + offsetY;

          const cellKey = `${col},${row}`;

          const alpha = cellOpacities.value.get(cellKey);

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
    gradient.addColorStop(1, '#14110E');

    ctx.fillStyle = gradient;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const updateCellOpacities = () => {
    const targets = new Map<string, number>();

    if (hoveredSquare.value) {
      targets.set(`${hoveredSquare.value.x},${hoveredSquare.value.y}`, 1);
    }

    if (props.hoverTrailAmount > 0) {
      for (let i = 0; i < trailCells.value.length; i++) {
        const t = trailCells.value[i];

        const key = `${t.x},${t.y}`;

        if (!targets.has(key)) {
          targets.set(key, (trailCells.value.length - i) / (trailCells.value.length + 1));
        }
      }
    }

    for (const [key] of targets) {
      if (!cellOpacities.value.has(key)) {
        cellOpacities.value.set(key, 0);
      }
    }

    for (const [key, opacity] of cellOpacities.value) {
      const target = targets.get(key) || 0;

      const next = opacity + (target - opacity) * 0.15;

      if (next < 0.005) {
        cellOpacities.value.delete(key);
      } else {
        cellOpacities.value.set(key, next);
      }
    }
  };

  const updateAnimation = () => {
    const effectiveSpeed = Math.max(props.speed, 0.1);

    const wrapX = isHex ? hexHoriz * 2 : props.squareSize;

    const wrapY = isHex ? hexVert : isTri ? props.squareSize * 2 : props.squareSize;

    switch (props.direction) {
      case 'right':
        gridOffset.value.x = (gridOffset.value.x - effectiveSpeed + wrapX) % wrapX;
        break;

      case 'left':
        gridOffset.value.x = (gridOffset.value.x + effectiveSpeed + wrapX) % wrapX;
        break;

      case 'up':
        gridOffset.value.y = (gridOffset.value.y + effectiveSpeed + wrapY) % wrapY;
        break;

      case 'down':
        gridOffset.value.y = (gridOffset.value.y - effectiveSpeed + wrapY) % wrapY;
        break;

      case 'diagonal':
        gridOffset.value.x = (gridOffset.value.x - effectiveSpeed + wrapX) % wrapX;

        gridOffset.value.y = (gridOffset.value.y - effectiveSpeed + wrapY) % wrapY;

        break;
    }

    updateCellOpacities();

    drawGrid();

    requestId = requestAnimationFrame(updateAnimation);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (isHex) {
      const colShift = Math.floor(gridOffset.value.x / hexHoriz);

      const offsetX = ((gridOffset.value.x % hexHoriz) + hexHoriz) % hexHoriz;

      const offsetY = ((gridOffset.value.y % hexVert) + hexVert) % hexVert;

      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;

      const col = Math.round(adjustedX / hexHoriz);

      const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;

      const row = Math.round((adjustedY - rowOffset) / hexVert);

      updateHovered(col, row);
    } else if (isTri) {
      const halfW = props.squareSize / 2;

      const offsetX = ((gridOffset.value.x % halfW) + halfW) % halfW;

      const offsetY = ((gridOffset.value.y % props.squareSize) + props.squareSize) % props.squareSize;

      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;

      const col = Math.round(adjustedX / halfW);

      const row = Math.floor(adjustedY / props.squareSize);

      updateHovered(col, row);
    } else if (props.shape === 'circle') {
      const offsetX = ((gridOffset.value.x % props.squareSize) + props.squareSize) % props.squareSize;

      const offsetY = ((gridOffset.value.y % props.squareSize) + props.squareSize) % props.squareSize;

      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;

      const col = Math.round(adjustedX / props.squareSize);

      const row = Math.round(adjustedY / props.squareSize);

      updateHovered(col, row);
    } else {
      const offsetX = ((gridOffset.value.x % props.squareSize) + props.squareSize) % props.squareSize;

      const offsetY = ((gridOffset.value.y % props.squareSize) + props.squareSize) % props.squareSize;

      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;

      const col = Math.floor(adjustedX / props.squareSize);

      const row = Math.floor(adjustedY / props.squareSize);

      updateHovered(col, row);
    }
  };

  const updateHovered = (col: number, row: number) => {
    if (!hoveredSquare.value || hoveredSquare.value.x !== col || hoveredSquare.value.y !== row) {
      if (hoveredSquare.value && props.hoverTrailAmount > 0) {
        trailCells.value.unshift({
          ...hoveredSquare.value
        });

        if (trailCells.value.length > props.hoverTrailAmount) {
          trailCells.value.length = props.hoverTrailAmount;
        }
      }

      hoveredSquare.value = {
        x: col,
        y: row
      };
    }
  };

  const handleMouseLeave = () => {
    if (hoveredSquare.value && props.hoverTrailAmount > 0) {
      trailCells.value.unshift({
        ...hoveredSquare.value
      });

      if (trailCells.value.length > props.hoverTrailAmount) {
        trailCells.value.length = props.hoverTrailAmount;
      }
    }

    hoveredSquare.value = null;
  };

  window.addEventListener('resize', resizeCanvas);

  canvas.addEventListener('mousemove', handleMouseMove);

  canvas.addEventListener('mouseleave', handleMouseLeave);

  resizeCanvas();

  requestId = requestAnimationFrame(updateAnimation);

  cleanup = () => {
    window.removeEventListener('resize', resizeCanvas);

    canvas.removeEventListener('mousemove', handleMouseMove);

    canvas.removeEventListener('mouseleave', handleMouseLeave);

    if (requestId) {
      cancelAnimationFrame(requestId);
    }
  };
}

watch(
  () => [
    props.direction,
    props.speed,
    props.borderColor,
    props.hoverFillColor,
    props.squareSize,
    props.shape,
    props.hoverTrailAmount
  ],
  () => {
    cleanup?.();

    initCanvas();
  }
);

onMounted(() => {
  initCanvas();
});

onBeforeUnmount(() => {
  cleanup?.();
});
</script>

<template>
  <canvas ref="canvasRef" class="block border-none w-full h-full" />
</template>
