<!-- Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE -->

<script setup lang="ts">
import { onMounted, onUnmounted, watch, useTemplateRef } from 'vue';
import * as THREE from 'three';

interface ASCIITextProps {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<ASCIITextProps>(), {
  text: 'David!',
  asciiFontSize: 8,
  textFontSize: 200,
  textColor: '#fdf9f3',
  planeBaseHeight: 8,
  enableWaves: true,
  className: ''
});

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;

    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;
    
    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

// @ts-expect-error - Adding map function to Math object
Math.map = function (n: number, start: number, stop: number, start2: number, stop2: number) {
  return ((n - start) / (stop - start)) * (stop2 - start2) + start2;
};

const PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

interface AsciiFilterOptions {
  fontSize?: number;
  fontFamily?: string;
  charset?: string;
  invert?: boolean;
}

interface CanvasTxtOptions {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

class AsciiFilter {
  renderer: THREE.WebGLRenderer;
  domElement: HTMLDivElement;
  pre: HTMLPreElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  deg: number;
  invert: boolean;
  fontSize: number;
  fontFamily: string;
  charset: string;
  width: number = 0;
  height: number = 0;
  center: { x: number; y: number } = { x: 0, y: 0 };
  mouse: { x: number; y: number } = { x: 0, y: 0 };
  cols: number = 0;
  rows: number = 0;

  constructor(renderer: THREE.WebGLRenderer, { fontSize, fontFamily, charset, invert }: AsciiFilterOptions = {}) {
    this.renderer = renderer;
    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';

    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.domElement.appendChild(this.canvas);

    this.deg = 0;
    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? "'Courier New', monospace";
    this.charset = charset ?? ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

    if (this.context) {
      this.context.imageSmoothingEnabled = false;
    }

    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();

    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    this.context!.font = `${this.fontSize}px ${this.fontFamily}`;

    const testChar = 'M';
    const charMetrics = this.context!.measureText(testChar);
    const charWidth = charMetrics.width;
    const charHeight = this.fontSize;

    this.cols = Math.floor(this.width / charWidth);
    this.rows = Math.floor(this.height / charHeight);

    this.canvas.width = this.cols;
    this.canvas.height = this.rows;

    const totalWidth = this.cols * charWidth;
    const totalHeight = this.rows * charHeight;
    const offsetX = (this.width - totalWidth) / 2;
    const offsetY = (this.height - totalHeight) / 2;

    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.margin = '0';
    this.pre.style.padding = '0';
    this.pre.style.lineHeight = `${this.fontSize}px`;
    this.pre.style.position = 'absolute';
    this.pre.style.left = `${offsetX}px`;
    this.pre.style.top = `${offsetY}px`;
    this.pre.style.width = `${totalWidth}px`;
    this.pre.style.height = `${totalHeight}px`;
    this.pre.style.letterSpacing = '0';
    this.pre.style.wordSpacing = '0';
    this.pre.style.whiteSpace = 'pre';
    this.pre.style.overflow = 'hidden';
    this.pre.style.zIndex = '9';
    this.pre.style.backgroundImage = 'radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%)';
    this.pre.style.backgroundAttachment = 'fixed';
    this.pre.style.webkitTextFillColor = 'transparent';
    this.pre.style.webkitBackgroundClip = 'text';
    this.pre.style.backgroundClip = 'text';
    this.pre.style.mixBlendMode = 'difference';
  }

  onMouseMove(e: MouseEvent) {
    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context!.clearRect(0, 0, w, h);
    if (this.context && w && h) {
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    }

    this.asciify(this.context!, w, h);
    this.hue();
  }

  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (w && h) {
      const imgData = ctx.getImageData(0, 0, w, h).data;
      let str = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = x * 4 + y * 4 * w;
          const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];

          if (a === 0) {
            str += ' ';
            continue;
          }

          const gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
          let idx = Math.floor((1 - gray) * (this.charset.length - 1));
          if (this.invert) idx = this.charset.length - idx - 1;
          str += this.charset[idx];
        }
        str += '\n';
      }
      this.pre.innerHTML = str;
    }
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }

  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

class CanvasTxt {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  txt: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  font: string;

  constructor(txt: string, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' }: CanvasTxtOptions = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.txt = txt;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }

  resize() {
    if (this.context) {
      this.context.font = this.font;
      const metrics = this.context.measureText(this.txt);

      const textWidth = Math.ceil(metrics.width) + 20;
      const textHeight = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;

      this.canvas.width = textWidth;
      this.canvas.height = textHeight;
    }
  }

  render() {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = this.color;
      this.context.font = this.font;

      const metrics = this.context.measureText(this.txt);
      const yPos = 10 + metrics.actualBoundingBoxAscent;

      this.context.fillText(this.txt, 10, yPos);
    }
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get texture() {
    return this.canvas;
  }
}

class CanvAscii {
  textString: string;
  asciiFontSize: number;
  textFontSize: number;
  textColor!: string;
  planeBaseHeight!: number;
  container!: HTMLElement;
  width!: number;
  height!: number;
  enableWaves!: boolean;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  mouse: { x: number; y: number } = { x: 0, y: 0 };
  textCanvas!: CanvasTxt;
  texture!: THREE.CanvasTexture;
  geometry!: THREE.PlaneGeometry;
  material!: THREE.ShaderMaterial;
  mesh!: THREE.Mesh;
  renderer!: THREE.WebGLRenderer;
  filter!: AsciiFilter;
  center: { x: number; y: number } = { x: 0, y: 0 };
  animationFrameId: number = 0;

  constructor(
    {
      text,
      asciiFontSize,
      textFontSize,
      textColor,
      planeBaseHeight,
      enableWaves
    }: {
      text: string;
      asciiFontSize: number;
      textFontSize: number;
      textColor: string;
      planeBaseHeight: number;
      enableWaves: boolean;
    },
    containerElem: HTMLElement,
    width: number,
    height: number
  ) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = containerElem;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.z = 30;

    this.scene = new THREE.Scene();

    this.onMouseMove = this.onMouseMove.bind(this);
    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    this.textCanvas = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: 'IBM Plex Mono',
      color: this.textColor
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;

    const textAspect = this.textCanvas.width / this.textCanvas.height;
    const baseH = this.planeBaseHeight;
    const planeW = baseH * textAspect;
    const planeH = baseH;

    this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 }
      }
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: 'IBM Plex Mono',
      fontSize: this.asciiFontSize,
      invert: true
    });

    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);

    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('touchmove', this.onMouseMove);
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.filter.setSize(w, h);
    this.center = { x: w / 2, y: h / 2 };
  }

  load() {
    this.animate();
  }

  onMouseMove(evt: MouseEvent | TouchEvent) {
    const e = 'touches' in evt ? evt.touches[0] : evt;
    const bounds = this.container.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    this.mouse = { x, y };
  }

  animate() {
    const animateFrame = () => {
      this.animationFrameId = requestAnimationFrame(animateFrame);
      this.render();
    };
    animateFrame();
  }

  render() {
    const time = new Date().getTime() * 0.001;

    this.textCanvas.render();
    this.texture.needsUpdate = true;
    (this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = Math.sin(time);

    this.updateRotation();
    this.filter.render(this.scene, this.camera);
  }

  updateRotation() {
    // @ts-expect-error - Using custom Math.map function
    const x = Math.map(this.mouse.y, 0, this.height, 0.5, -0.5);
    // @ts-expect-error - Using custom Math.map function
    const y = Math.map(this.mouse.x, 0, this.width, -0.5, 0.5);

    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
  }

  clear() {
    this.scene.traverse(obj => {
      if (obj instanceof THREE.Mesh && obj.material && obj.geometry) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
        obj.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    this.filter.dispose();
    this.container.removeChild(this.filter.domElement);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('touchmove', this.onMouseMove);
    this.clear();
    this.renderer.dispose();
  }
}

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
let asciiRef: CanvAscii | null = null;

const initializeAscii = () => {
  if (!containerRef.value) return;

  const { width, height } = containerRef.value.getBoundingClientRect();

  if (width === 0 || height === 0) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.boundingClientRect.width > 0 && entry.boundingClientRect.height > 0) {
          const { width: w, height: h } = entry.boundingClientRect;

          asciiRef = new CanvAscii(
            {
              text: props.text,
              asciiFontSize: props.asciiFontSize,
              textFontSize: props.textFontSize,
              textColor: props.textColor,
              planeBaseHeight: props.planeBaseHeight,
              enableWaves: props.enableWaves
            },
            containerRef.value!,
            w,
            h
          );
          asciiRef.load();

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.value);
    return;
  }

  asciiRef = new CanvAscii(
    {
      text: props.text,
      asciiFontSize: props.asciiFontSize,
      textFontSize: props.textFontSize,
      textColor: props.textColor,
      planeBaseHeight: props.planeBaseHeight,
      enableWaves: props.enableWaves
    },
    containerRef.value,
    width,
    height
  );
  asciiRef.load();

  const ro = new ResizeObserver(entries => {
    if (!entries[0] || !asciiRef) return;
    const { width: w, height: h } = entries[0].contentRect;
    if (w > 0 && h > 0) {
      asciiRef.setSize(w, h);
    }
  });
  ro.observe(containerRef.value);
};

onMounted(() => {
  initializeAscii();
});

onUnmounted(() => {
  if (asciiRef) {
    asciiRef.dispose();
  }
});

watch(
  () => [
    props.text,
    props.asciiFontSize,
    props.textFontSize,
    props.textColor,
    props.planeBaseHeight,
    props.enableWaves
  ],
  () => {
    if (asciiRef) {
      asciiRef.dispose();
    }
    initializeAscii();
  }
);
</script>

<template>
  <div ref="containerRef" :class="['ascii-text-container', className]" class="absolute inset-0 w-full h-full" />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap');

.ascii-text-container :deep(canvas) {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}

.ascii-text-container :deep(pre) {
  margin: 0;
  user-select: none;
  padding: 0;
  position: absolute;
  white-space: pre;
  overflow: hidden;
  background-image: radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%);
  background-attachment: fixed;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  z-index: 9;
  mix-blend-mode: difference;
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0;
}
</style>
