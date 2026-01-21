<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const vertexShader = `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vP;
void main(){vP=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;

const fragmentShader = `#version 300 es
precision highp float;
in vec2 vP;
out vec4 oC;
uniform sampler2D u_tex;
uniform float u_time,u_ratio,u_imgRatio,u_seed,u_scale,u_refract,u_blur,u_liquid;
uniform float u_bright,u_contrast,u_angle,u_fresnel,u_sharp,u_wave,u_noise,u_chroma;
uniform float u_distort,u_contour;
uniform vec3 u_lightColor,u_darkColor,u_tint;

vec3 sC,sM;

vec3 pW(vec3 v){
  vec3 i=floor(v),f=fract(v),s=sign(fract(v*.5)-.5),h=fract(sM*i+i.yzx),c=f*(f-1.);
  return s*c*((h*16.-4.)*c-1.);
}

vec3 aF(vec3 b,vec3 c){return pW(b+c.zxy-pW(b.zxy+c.yzx)+pW(b.yzx+c.xyz));}
vec3 lM(vec3 s,vec3 p){return(p+aF(s,p))*.5;}

vec2 fA(){
  vec2 c=vP-.5;
  c.x*=u_ratio>u_imgRatio?u_ratio/u_imgRatio:1.;
  c.y*=u_ratio>u_imgRatio?1.:u_imgRatio/u_ratio;
  return vec2(c.x+.5,.5-c.y);
}

vec2 rot(vec2 p,float r){float c=cos(r),s=sin(r);return vec2(p.x*c+p.y*s,p.y*c-p.x*s);}

float bM(vec2 c,float t){
  vec2 l=smoothstep(vec2(0.),vec2(t),c),u=smoothstep(vec2(0.),vec2(t),1.-c);
  return l.x*l.y*u.x*u.y;
}

float mG(float hi,float lo,float t,float sh,float cv){
  sh*=(2.-u_sharp);
  float ci=smoothstep(.15,.85,cv),r=lo;
  float e1=.08/u_scale;
  r=mix(r,hi,smoothstep(0.,sh*1.5,t));
  r=mix(r,lo,smoothstep(e1-sh,e1+sh,t));
  float e2=e1+.05/u_scale*(1.-ci*.35);
  r=mix(r,hi,smoothstep(e2-sh,e2+sh,t));
  float e3=e2+.025/u_scale*(1.-ci*.45);
  r=mix(r,lo,smoothstep(e3-sh,e3+sh,t));
  float e4=e1+.1/u_scale;
  r=mix(r,hi,smoothstep(e4-sh,e4+sh,t));
  float rm=1.-e4,gT=clamp((t-e4)/rm,0.,1.);
  r=mix(r,mix(hi,lo,smoothstep(0.,1.,gT)),smoothstep(e4-sh*.5,e4+sh*.5,t));
  return r;
}

void main(){
  sC=fract(vec3(.7548,.5698,.4154)*(u_seed+17.31))+.5;
  sM=fract(sC.zxy-sC.yzx*1.618);
  vec2 sc=vec2(vP.x*u_ratio,1.-vP.y);
  float angleRad=u_angle*3.14159/180.;
  sc=rot(sc-.5,angleRad)+.5;
  sc=clamp(sc,0.,1.);
  float sl=sc.x-sc.y,an=u_time*.001;
  vec2 iC=fA();
  vec4 texSample=texture(u_tex,iC);
  float dp=texSample.r;
  float shapeMask=texSample.a;
  vec3 hi=u_lightColor*u_bright;
  vec3 lo=u_darkColor*(2.-u_bright);
  lo.b+=smoothstep(.6,1.4,sc.x+sc.y)*.08;
  vec2 fC=sc-.5;
  float rd=length(fC+vec2(0.,sl*.15));
  vec2 ag=rot(fC,(.22-sl*.18)*3.14159);
  float cv=1.-pow(rd*1.65,1.15);
  cv*=pow(sc.y,.35);
  float vs=shapeMask;
  vs*=bM(iC,.01);
  float fr=pow(1.-cv,u_fresnel)*.3;
  vs=min(vs+fr*vs,1.);
  float mT=an*.0625;
  vec3 wO=vec3(-1.05,1.35,1.55);
  vec3 wA=aF(vec3(31.,73.,56.),mT+wO)*.22*u_wave;
  vec3 wB=aF(vec3(24.,64.,42.),mT-wO.yzx)*.22*u_wave;
  vec2 nC=sc*45.*u_noise;
  nC+=aF(sC.zxy,an*.17*sC.yzx-sc.yxy*.35).xy*18.*u_wave;
  vec3 tC=vec3(.00041,.00053,.00076)*mT+wB*nC.x+wA*nC.y;
  tC=lM(sC,tC);
  tC=lM(sC+1.618,tC);
  float tb=sin(tC.x*3.14159)*.5+.5;
  tb=tb*2.-1.;
  float noiseVal=pW(vec3(sc*8.+an,an*.5)).x;
  float edgeFactor=smoothstep(0.,.5,dp)*smoothstep(1.,.5,dp);
  float lD=dp+(1.-dp)*u_liquid*tb;
  lD+=noiseVal*u_distort*.15*edgeFactor;
  float rB=clamp(1.-cv,0.,1.);
  float fl=ag.x+sl;
  fl+=noiseVal*sl*u_distort*edgeFactor;
  fl*=mix(1.,1.-dp*.5,u_contour);
  fl-=dp*u_contour*.8;
  float eI=smoothstep(0.,1.,lD)*smoothstep(1.,0.,lD);
  fl-=tb*sl*1.8*eI;
  float cA=cv*clamp(pow(sc.y,.12),.25,1.);
  fl*=.12+(1.05-lD)*cA;
  fl*=smoothstep(1.,.65,lD);
  float vA1=smoothstep(.08,.18,sc.y)*smoothstep(.38,.18,sc.y);
  float vA2=smoothstep(.08,.18,1.-sc.y)*smoothstep(.38,.18,1.-sc.y);
  fl+=vA1*.16+vA2*.025;
  fl*=.45+pow(sc.y,2.)*.55;
  fl*=u_scale;
  fl-=an;
  float rO=rB+cv*tb*.025;
  float vM1=smoothstep(-.12,.18,sc.y)*smoothstep(.48,.08,sc.y);
  float cM1=smoothstep(.35,.55,cv)*smoothstep(.95,.35,cv);
  rO+=vM1*cM1*4.5;
  rO-=sl;
  float bO=rB*1.25;
  float vM2=smoothstep(-.02,.35,sc.y)*smoothstep(.75,.08,sc.y);
  float cM2=smoothstep(.35,.55,cv)*smoothstep(.75,.35,cv);
  bO+=vM2*cM2*.9;
  bO-=lD*.18;
  rO*=u_refract*u_chroma;
  bO*=u_refract*u_chroma;
  float sf=u_blur;
  float rP=fract(fl+rO);
  float rC=mG(hi.r,lo.r,rP,sf+.018+u_refract*cv*.025,cv);
  float gP=fract(fl);
  float gC=mG(hi.g,lo.g,gP,sf+.008/max(.01,1.-sl),cv);
  float bP=fract(fl-bO);
  float bC=mG(hi.b,lo.b,bP,sf+.008,cv);
  vec3 col=vec3(rC,gC,bC);
  col=(col-.5)*u_contrast+.5;
  col=clamp(col,0.,1.);
  col=mix(col,1.-min(vec3(1.),(1.-col)/max(u_tint,vec3(.001))),length(u_tint-1.)*.5);
  col=clamp(col,0.,1.);
  oC=vec4(col*vs,vs);
}`;

interface MetallicPaintProps {
  imageSrc: string;
  seed?: number;
  scale?: number;
  refraction?: number;
  blur?: number;
  liquid?: number;
  speed?: number;
  brightness?: number;
  contrast?: number;
  angle?: number;
  fresnel?: number;
  lightColor?: string;
  darkColor?: string;
  patternSharpness?: number;
  waveAmplitude?: number;
  noiseScale?: number;
  chromaticSpread?: number;
  mouseAnimation?: boolean;
  distortion?: number;
  contour?: number;
  tintColor?: string;
}

function processImage(img: HTMLImageElement): ImageData {
  const MAX_SIZE = 1000;
  const MIN_SIZE = 500;
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > MAX_SIZE || height > MAX_SIZE || width < MIN_SIZE || height < MIN_SIZE) {
    const scale =
      width > height
        ? width > MAX_SIZE
          ? MAX_SIZE / width
          : width < MIN_SIZE
            ? MIN_SIZE / width
            : 1
        : height > MAX_SIZE
          ? MAX_SIZE / height
          : height < MIN_SIZE
            ? MIN_SIZE / height
            : 1;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const size = width * height;
  const alphaValues = new Float32Array(size);
  const shapeMask = new Uint8Array(size);
  const boundaryMask = new Uint8Array(size);

  for (let i = 0; i < size; i++) {
    const idx = i * 4;
    const r = data[idx],
      g = data[idx + 1],
      b = data[idx + 2],
      a = data[idx + 3];
    const isBackground = (r > 250 && g > 250 && b > 250 && a === 255) || a < 5;
    alphaValues[i] = isBackground ? 0 : a / 255;
    shapeMask[i] = alphaValues[i] > 0.1 ? 1 : 0;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!shapeMask[idx]) continue;
      if (
        x === 0 ||
        x === width - 1 ||
        y === 0 ||
        y === height - 1 ||
        !shapeMask[idx - 1] ||
        !shapeMask[idx + 1] ||
        !shapeMask[idx - width] ||
        !shapeMask[idx + width]
      ) {
        boundaryMask[idx] = 1;
      }
    }
  }

  const u = new Float32Array(size);
  const ITERATIONS = 200;
  const C = 0.01;
  const omega = 1.85;

  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (!shapeMask[idx] || boundaryMask[idx]) continue;
        const sum =
          (shapeMask[idx + 1] ? u[idx + 1] : 0) +
          (shapeMask[idx - 1] ? u[idx - 1] : 0) +
          (shapeMask[idx + width] ? u[idx + width] : 0) +
          (shapeMask[idx - width] ? u[idx - width] : 0);
        const newVal = (C + sum) / 4;
        u[idx] = omega * newVal + (1 - omega) * u[idx];
      }
    }
  }

  let maxVal = 0;
  for (let i = 0; i < size; i++) if (u[i] > maxVal) maxVal = u[i];
  if (maxVal === 0) maxVal = 1;

  const outData = ctx.createImageData(width, height);
  for (let i = 0; i < size; i++) {
    const px = i * 4;
    const depth = u[i] / maxVal;
    const gray = Math.round(255 * (1 - depth * depth));
    outData.data[px] = outData.data[px + 1] = outData.data[px + 2] = gray;
    outData.data[px + 3] = Math.round(alphaValues[i] * 255);
  }

  return outData;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
    : [1, 1, 1];
}

const props = withDefaults(defineProps<MetallicPaintProps>(), {
  seed: 42,
  scale: 4,
  refraction: 0.01,
  blur: 0.015,
  liquid: 0.75,
  speed: 0.3,
  brightness: 2,
  contrast: 0.5,
  angle: 0,
  fresnel: 1,
  lightColor: '#ffffff',
  darkColor: '#000000',
  patternSharpness: 1,
  waveAmplitude: 1,
  noiseScale: 0.5,
  chromaticSpread: 2,
  mouseAnimation: false,
  distortion: 1,
  contour: 0.2,
  tintColor: '#feb3ff'
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const glRef = ref<WebGL2RenderingContext | null>(null);
const programRef = ref<WebGLProgram | null>(null);
const uniformsRef = ref<Record<string, WebGLUniformLocation | null>>({});
const textureRef = ref<WebGLTexture | null>(null);
const animTimeRef = ref(0);
const lastTimeRef = ref(0);
const rafRef = ref<number | null>(null);
const imgDataRef = ref<ImageData | null>(null);
const speedRef = ref(props.speed);
const mouseRef = ref({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
const mouseAnimRef = ref(props.mouseAnimation);

const ready = ref<boolean>(false);
const textureReady = ref<boolean>(false);

watch(
  () => props.speed,
  speed => (speedRef.value = speed)
);

watch(
  () => props.mouseAnimation,
  mouseAnimation => (mouseAnimRef.value = mouseAnimation)
);

const initGL = (): boolean => {
  const canvas = canvasRef.value;
  if (!canvas) return false;

  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true });
  if (!gl) return false;

  const compile = (src: string, type: number): WebGLShader | null => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };

  const vs = compile(vertexShader, gl.VERTEX_SHADER);
  const fs = compile(fragmentShader, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return false;

  const prog = gl.createProgram();
  if (!prog) return false;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return false;
  }

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(prog, i);
    if (info) {
      uniforms[info.name] = gl.getUniformLocation(prog, info.name);
    }
  }

  const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const buf = gl.createBuffer();
  if (!buf) return false;

  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  gl.useProgram(prog);
  const pos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  glRef.value = gl;
  programRef.value = prog;
  uniformsRef.value = uniforms;

  return true;
};

watch(initGL, () => {
  if (!initGL()) return;

  const canvas = canvasRef.value;
  const gl = glRef.value;
  if (!canvas || !gl) return;

  const side = 1000 * devicePixelRatio;
  canvas.width = side;
  canvas.height = side;
  gl.viewport(0, 0, side, side);

  ready.value = true;

  return () => {
    if (rafRef.value) cancelAnimationFrame(rafRef.value);
    if (textureRef.value && glRef.value) {
      glRef.value.deleteTexture(textureRef.value);
    }
  };
});

const uploadTexture = (imgData: ImageData): void => {
  const gl = glRef.value;
  const uniforms = uniformsRef.value;
  if (!gl || !imgData) return;

  if (textureRef.value) gl.deleteTexture(textureRef.value);

  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, imgData.width, imgData.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imgData.data);
  gl.uniform1i(uniforms.u_tex, 0);

  const ratio = imgData.width / imgData.height;
  gl.uniform1f(uniforms.u_imgRatio, ratio);
  gl.uniform1f(uniforms.u_ratio, 1);

  textureRef.value = tex;
  imgDataRef.value = imgData;
};

watch(
  () => [ready.value, props.imageSrc, uploadTexture],
  () => {
    if (!ready.value || !props.imageSrc) return;

    textureReady.value = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const imgData = processImage(img);
      uploadTexture(imgData);
      textureReady.value = true;
    };
    img.src = props.imageSrc;
  }
);

watch(
  () => [
    ready.value,
    props.seed,
    props.scale,
    props.refraction,
    props.blur,
    props.liquid,
    props.brightness,
    props.contrast,
    props.angle,
    props.fresnel,
    props.lightColor,
    props.darkColor,
    props.patternSharpness,
    props.waveAmplitude,
    props.noiseScale,
    props.chromaticSpread,
    props.distortion,
    props.contour,
    props.tintColor
  ],
  () => {
    const gl = glRef.value;
    const u = uniformsRef.value;
    if (!gl || !ready.value) return;

    gl.uniform1f(u.u_seed, props.seed);
    gl.uniform1f(u.u_scale, props.scale);
    gl.uniform1f(u.u_refract, props.refraction);
    gl.uniform1f(u.u_blur, props.blur);
    gl.uniform1f(u.u_liquid, props.liquid);
    gl.uniform1f(u.u_bright, props.brightness);
    gl.uniform1f(u.u_contrast, props.contrast);
    gl.uniform1f(u.u_angle, props.angle);
    gl.uniform1f(u.u_fresnel, props.fresnel);

    const light = hexToRgb(props.lightColor);
    const dark = hexToRgb(props.darkColor);
    const tint = hexToRgb(props.tintColor);
    gl.uniform3f(u.u_lightColor, light[0], light[1], light[2]);
    gl.uniform3f(u.u_darkColor, dark[0], dark[1], dark[2]);
    gl.uniform1f(u.u_sharp, props.patternSharpness);
    gl.uniform1f(u.u_wave, props.waveAmplitude);
    gl.uniform1f(u.u_noise, props.noiseScale);
    gl.uniform1f(u.u_chroma, props.chromaticSpread);
    gl.uniform1f(u.u_distort, props.distortion);
    gl.uniform1f(u.u_contour, props.contour);
    gl.uniform3f(u.u_tint, tint[0], tint[1], tint[2]);
  }
);

let cleanup: (() => void) | null = null;
const setup = () => {
  if (!ready.value || !textureReady.value) return;

  const gl = glRef.value;
  const u = uniformsRef.value;
  const canvas = canvasRef.value;
  const mouse = mouseRef.value;
  if (!gl || !canvas) return;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = (e.clientX - rect.left) / rect.width;
    mouse.targetY = (e.clientY - rect.top) / rect.height;
  };

  canvas.addEventListener('mousemove', handleMouseMove);

  const render = (time: number) => {
    const delta = time - lastTimeRef.value;
    lastTimeRef.value = time;

    if (mouseAnimRef.value) {
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      animTimeRef.value = mouse.x * 3000 + mouse.y * 1500;
    } else {
      animTimeRef.value += delta * speedRef.value;
    }

    gl.uniform1f(u.u_time, animTimeRef.value);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafRef.value = requestAnimationFrame(render);
  };

  lastTimeRef.value = performance.now();
  rafRef.value = requestAnimationFrame(render);

  cleanup = () => {
    if (rafRef.value) cancelAnimationFrame(rafRef.value);
    canvas.removeEventListener('mousemove', handleMouseMove);
  };
};

onMounted(() => {
  setup();
});

onBeforeUnmount(() => {
  cleanup?.();
});

watch(
  () => [ready.value, textureReady.value],
  () => {
    cleanup?.();
    setup();
  }
);
</script>

<template>
  <canvas ref="canvasRef" className="block h-full w-full object-contain" />
</template>
