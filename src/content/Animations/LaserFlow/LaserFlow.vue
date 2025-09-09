<script setup lang="ts">
import * as THREE from 'three';
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch, type CSSProperties } from 'vue';

type Props = {
  className?: string;
  style?: CSSProperties;
  wispDensity?: number;
  dpr?: number;
  mouseSmoothTime?: number;
  mouseTiltStrength?: number;
  horizontalBeamOffset?: number;
  verticalBeamOffset?: number;
  flowSpeed?: number;
  verticalSizing?: number;
  horizontalSizing?: number;
  fogIntensity?: number;
  fogScale?: number;
  wispSpeed?: number;
  wispIntensity?: number;
  flowStrength?: number;
  decay?: number;
  falloffStart?: number;
  fogFallSpeed?: number;
  color?: string;
};

const VERT = `
precision highp float;
attribute vec3 position;
void main(){
  gl_Position = vec4(position, 1.0);
}
`;

const FRAG = `
#ifdef GL_ES
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
precision mediump int;

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform float uWispDensity;
uniform float uTiltScale;
uniform float uFlowTime;
uniform float uFogTime;
uniform float uBeamXFrac;
uniform float uBeamYFrac;
uniform float uFlowSpeed;
uniform float uVLenFactor;
uniform float uHLenFactor;
uniform float uFogIntensity;
uniform float uFogScale;
uniform float uWSpeed;
uniform float uWIntensity;
uniform float uFlowStrength;
uniform float uDecay;
uniform float uFalloffStart;
uniform float uFogFallSpeed;
uniform vec3 uColor;
uniform float uFade;

// Core beam/flare shaping and dynamics
#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define EPS 1e-6
#define EDGE_SOFT (DT_LOCAL*4.0)
#define DT_LOCAL 0.0038
#define TAP_RADIUS 6
#define R_H 150.0
#define R_V 150.0
#define FLARE_HEIGHT 16.0
#define FLARE_AMOUNT 8.0
#define FLARE_EXP 2.0
#define TOP_FADE_START 0.1
#define TOP_FADE_EXP 1.0
#define FLOW_PERIOD 0.5
#define FLOW_SHARPNESS 1.5

// Wisps (animated micro-streaks) that travel along the beam
#define W_BASE_X 1.5
#define W_LAYER_GAP 0.25
#define W_LANES 55
#define W_SIDE_DECAY 0.5
#define W_HALF 0.01
#define W_AA 0.15
#define W_CELL 20.0
#define W_SEG_MIN 0.01
#define W_SEG_MAX 0.55
#define W_CURVE_AMOUNT 15.0
#define W_CURVE_RANGE (FLARE_HEIGHT - 3.0)
#define W_BOTTOM_EXP 10.0

// Volumetric fog controls
#define FOG_ON 1
#define FOG_CONTRAST 1.5
#define FOG_SPEED_U 0.1
#define FOG_SPEED_V -0.1
#define FOG_OCTAVES 5
#define FOG_BOTTOM_BIAS 0.8
#define FOG_TILT_TO_MOUSE 0.05
#define FOG_TILT_DEADZONE 0.01
#define FOG_TILT_MAX_X 0.35
#define FOG_TILT_SHAPE 1.5
#define FOG_BEAM_MIN 0.0
#define FOG_BEAM_MAX 0.75
#define FOG_MASK_GAMMA 0.20
#define FOG_EXPAND_SHAPE 12.2
#define FOG_EDGE_MIX 0.5

// Horizontal vignette for the fog volume
#define HFOG_EDGE_START 0.20
#define HFOG_EDGE_END 0.98
#define HFOG_EDGE_GAMMA 1.4
#define HFOG_Y_RADIUS 25.0
#define HFOG_Y_SOFT 60.0

// Beam extents and edge masking
#define EDGE_X0 0.22
#define EDGE_X1 0.995
#define EDGE_X_GAMMA 1.25
#define EDGE_LUMA_T0 0.0
#define EDGE_LUMA_T1 2.0
#define DITHER_STRENGTH 1.0

    float g(float x){return x<=0.00031308?12.92*x:1.055*pow(x,1.0/2.4)-0.055;}
    float bs(vec2 p,vec2 q,float powr){
        float d=distance(p,q),f=powr*uFalloffStart,r=(f*f)/(d*d+EPS);
        return powr*min(1.0,r);
    }
    float bsa(vec2 p,vec2 q,float powr,vec2 s){
        vec2 d=p-q; float dd=(d.x*d.x)/(s.x*s.x)+(d.y*d.y)/(s.y*s.y),f=powr*uFalloffStart,r=(f*f)/(dd+EPS);
        return powr*min(1.0,r);
    }
    float tri01(float x){float f=fract(x);return 1.0-abs(f*2.0-1.0);}
    float tauWf(float t,float tmin,float tmax){float a=smoothstep(tmin,tmin+EDGE_SOFT,t),b=1.0-smoothstep(tmax-EDGE_SOFT,tmax,t);return max(0.0,a*b);} 
    float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+34.123);return fract(p.x*p.y);}
    float vnoise(vec2 p){
        vec2 i=floor(p),f=fract(p);
        float a=h21(i),b=h21(i+vec2(1,0)),c=h21(i+vec2(0,1)),d=h21(i+vec2(1,1));
        vec2 u=f*f*(3.0-2.0*f);
        return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
    }
    float fbm2(vec2 p){
        float v=0.0,amp=0.6; mat2 m=mat2(0.86,0.5,-0.5,0.86);
        for(int i=0;i<FOG_OCTAVES;++i){v+=amp*vnoise(p); p=m*p*2.03+17.1; amp*=0.52;}
        return v;
    }
    float rGate(float x,float l){float a=smoothstep(0.0,W_AA,x),b=1.0-smoothstep(l,l+W_AA,x);return max(0.0,a*b);}
    float flareY(float y){float t=clamp(1.0-(clamp(y,0.0,FLARE_HEIGHT)/max(FLARE_HEIGHT,EPS)),0.0,1.0);return pow(t,FLARE_EXP);}

    float vWisps(vec2 uv,float topF){
    float y=uv.y,yf=(y+uFlowTime*uWSpeed)/W_CELL;
    float dRaw=clamp(uWispDensity,0.0,2.0),d=dRaw<=0.0?1.0:dRaw;
    float lanesF=floor(float(W_LANES)*min(d,1.0)+0.5); // WebGL1-safe
    int lanes=int(max(1.0,lanesF));
    float sp=min(d,1.0),ep=max(d-1.0,0.0);
    float fm=flareY(max(y,0.0)),rm=clamp(1.0-(y/max(W_CURVE_RANGE,EPS)),0.0,1.0),cm=fm*rm;
    const float G=0.05; float xS=1.0+(FLARE_AMOUNT*W_CURVE_AMOUNT*G)*cm;
    float sPix=clamp(y/R_V,0.0,1.0),bGain=pow(1.0-sPix,W_BOTTOM_EXP),sum=0.0;
    for(int s=0;s<2;++s){
        float sgn=s==0?-1.0:1.0;
        for(int i=0;i<W_LANES;++i){
            if(i>=lanes) break;
            float off=W_BASE_X+float(i)*W_LAYER_GAP,xc=sgn*(off*xS);
            float dx=abs(uv.x-xc),lat=1.0-smoothstep(W_HALF,W_HALF+W_AA,dx),amp=exp(-off*W_SIDE_DECAY);
            float seed=h21(vec2(off,sgn*17.0)),yf2=yf+seed*7.0,ci=floor(yf2),fy=fract(yf2);
            float seg=mix(W_SEG_MIN,W_SEG_MAX,h21(vec2(ci,off*2.3)));
            float spR=h21(vec2(ci,off+sgn*31.0)),seg1=rGate(fy,seg)*step(spR,sp);
            if(ep>0.0){float spR2=h21(vec2(ci*3.1+7.0,off*5.3+sgn*13.0)); float f2=fract(fy+0.5); seg1+=rGate(f2,seg*0.9)*step(spR2,ep);}
            sum+=amp*lat*seg1;
        }
    }
    float span=smoothstep(-3.0,0.0,y)*(1.0-smoothstep(R_V-6.0,R_V,y));
    return uWIntensity*sum*topF*bGain*span;
}

void mainImage(out vec4 fc,in vec2 frag){
    vec2 C=iResolution.xy*.5; float invW=1.0/max(C.x,1.0);
    float sc=512.0/iResolution.x*.4;
    vec2 uv=(frag-C)*sc,off=vec2(uBeamXFrac*iResolution.x*sc,uBeamYFrac*iResolution.y*sc);
    vec2 uvc = uv - off;
    float a=0.0,b=0.0;
    float basePhase=1.5*PI+uDecay*.5; float tauMin=basePhase-uDecay; float tauMax=basePhase;
    float cx=clamp(uvc.x/(R_H*uHLenFactor),-1.0,1.0),tH=clamp(TWO_PI-acos(cx),tauMin,tauMax);
    for(int k=-TAP_RADIUS;k<=TAP_RADIUS;++k){
        float tu=tH+float(k)*DT_LOCAL,wt=tauWf(tu,tauMin,tauMax); if(wt<=0.0) continue;
        float spd=max(abs(sin(tu)),0.02),u=clamp((basePhase-tu)/max(uDecay,EPS),0.0,1.0),env=pow(1.0-abs(u*2.0-1.0),0.8);
        vec2 p=vec2((R_H*uHLenFactor)*cos(tu),0.0);
        a+=wt*bs(uvc,p,env*spd);
    }
    float yPix=uvc.y,cy=clamp(-yPix/(R_V*uVLenFactor),-1.0,1.0),tV=clamp(TWO_PI-acos(cy),tauMin,tauMax);
    for(int k=-TAP_RADIUS;k<=TAP_RADIUS;++k){
        float tu=tV+float(k)*DT_LOCAL,wt=tauWf(tu,tauMin,tauMax); if(wt<=0.0) continue;
        float yb=(-R_V)*cos(tu),s=clamp(yb/R_V,0.0,1.0),spd=max(abs(sin(tu)),0.02);
        float env=pow(1.0-s,0.6)*spd;
        float cap=1.0-smoothstep(TOP_FADE_START,1.0,s); cap=pow(cap,TOP_FADE_EXP); env*=cap;
        float ph=s/max(FLOW_PERIOD,EPS)+uFlowTime*uFlowSpeed;
        float fl=pow(tri01(ph),FLOW_SHARPNESS);
        env*=mix(1.0-uFlowStrength,1.0,fl);
        float yp=(-R_V*uVLenFactor)*cos(tu),m=pow(smoothstep(FLARE_HEIGHT,0.0,yp),FLARE_EXP),wx=1.0+FLARE_AMOUNT*m;
        vec2 sig=vec2(wx,1.0),p=vec2(0.0,yp);
        float mask=step(0.0,yp);
        b+=wt*bsa(uvc,p,mask*env,sig);
    }
    float sPix=clamp(yPix/R_V,0.0,1.0),topA=pow(1.0-smoothstep(TOP_FADE_START,1.0,sPix),TOP_FADE_EXP);
    float L=a+b*topA;
    float w=vWisps(vec2(uvc.x,yPix),topA);
    float fog=0.0;
#if FOG_ON
    vec2 fuv=uvc*uFogScale;
    float mAct=step(1.0,length(iMouse.xy)),nx=((iMouse.x-C.x)*invW)*mAct;
    float ax = abs(nx);
    float stMag = mix(ax, pow(ax, FOG_TILT_SHAPE), 0.35);
    float st = sign(nx) * stMag * uTiltScale;
    st = clamp(st, -FOG_TILT_MAX_X, FOG_TILT_MAX_X);
    vec2 dir=normalize(vec2(st,1.0));
    fuv+=uFogTime*uFogFallSpeed*dir;
    vec2 prp=vec2(-dir.y,dir.x);
    fuv+=prp*(0.08*sin(dot(uvc,prp)*0.08+uFogTime*0.9));
    float n=fbm2(fuv+vec2(fbm2(fuv+vec2(7.3,2.1)),fbm2(fuv+vec2(-3.7,5.9)))*0.6);
    n=pow(clamp(n,0.0,1.0),FOG_CONTRAST);
    float pixW = 1.0 / max(iResolution.y, 1.0);
#ifdef GL_OES_standard_derivatives
    float wL = max(fwidth(L), pixW);
#else
    float wL = pixW;
#endif
    float m0=pow(smoothstep(FOG_BEAM_MIN - wL, FOG_BEAM_MAX + wL, L),FOG_MASK_GAMMA);
    float bm=1.0-pow(1.0-m0,FOG_EXPAND_SHAPE); bm=mix(bm*m0,bm,FOG_EDGE_MIX);
    float yP=1.0-smoothstep(HFOG_Y_RADIUS,HFOG_Y_RADIUS+HFOG_Y_SOFT,abs(yPix));
    float nxF=abs((frag.x-C.x)*invW),hE=1.0-smoothstep(HFOG_EDGE_START,HFOG_EDGE_END,nxF); hE=pow(clamp(hE,0.0,1.0),HFOG_EDGE_GAMMA);
    float hW=mix(1.0,hE,clamp(yP,0.0,1.0));
    float bBias=mix(1.0,1.0-sPix,FOG_BOTTOM_BIAS);
    fog=n*uFogIntensity*bBias*bm*hW;
#endif
    float LF=L+fog;
    float dith=(h21(frag)-0.5)*(DITHER_STRENGTH/255.0);
    float tone=g(LF+w);
    vec3 col=tone*uColor+dith;
    float alpha=clamp(g(L+w*0.6)+dith*0.6,0.0,1.0);
    float nxE=abs((frag.x-C.x)*invW),xF=pow(clamp(1.0-smoothstep(EDGE_X0,EDGE_X1,nxE),0.0,1.0),EDGE_X_GAMMA);
    float scene=LF+max(0.0,w)*0.5,hi=smoothstep(EDGE_LUMA_T0,EDGE_LUMA_T1,scene);
    float eM=mix(xF,1.0,hi);
    col*=eM; alpha*=eM;
    col*=uFade; alpha*=uFade;
    fc=vec4(col,alpha);
}

void main(){
  vec4 fc;
  mainImage(fc, gl_FragCoord.xy);
  gl_FragColor = fc;
}
`;

const props = withDefaults(defineProps<Props>(), {
  wispDensity: 1,
  mouseSmoothTime: 0.0,
  mouseTiltStrength: 0.01,
  horizontalBeamOffset: 0.1,
  verticalBeamOffset: 0.0,
  flowSpeed: 0.35,
  verticalSizing: 2.0,
  horizontalSizing: 0.5,
  fogIntensity: 0.45,
  fogScale: 0.3,
  wispSpeed: 15.0,
  wispIntensity: 5.0,
  flowStrength: 0.25,
  decay: 1.1,
  falloffStart: 1.2,
  fogFallSpeed: 0.6,
  color: '#A0FFBC'
});

const mountRef = useTemplateRef('mountRef');
const hasFadedRef = ref(false);

let cleanup: (() => void) | null = null;

const setup = () => {
  const mount = mountRef.value!;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    premultipliedAlpha: false
  });
  renderer.setClearColor(0x000000, 1);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3(1, 1, 1) },
    iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
    uWispDensity: { value: props.wispDensity },
    uTiltScale: { value: props.mouseTiltStrength },
    uFlowTime: { value: 0 },
    uFogTime: { value: 0 },
    uBeamXFrac: { value: props.horizontalBeamOffset },
    uBeamYFrac: { value: props.verticalBeamOffset },
    uFlowSpeed: { value: props.flowSpeed },
    uVLenFactor: { value: props.verticalSizing },
    uHLenFactor: { value: props.horizontalSizing },
    uFogIntensity: { value: props.fogIntensity },
    uFogScale: { value: props.fogScale },
    uWSpeed: { value: props.wispSpeed },
    uWIntensity: { value: props.wispIntensity },
    uFlowStrength: { value: props.flowStrength },
    uDecay: { value: props.decay },
    uFalloffStart: { value: props.falloffStart },
    uFogFallSpeed: { value: props.fogFallSpeed },
    uColor: { value: new THREE.Vector3(1, 1, 1) },
    uFade: { value: hasFadedRef.value ? 1 : 0 }
  };

  const material = new THREE.RawShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: false,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const clock = new THREE.Clock();
  let prevTime = 0;
  let flowTime = 0;
  let fogTime = 0;
  let fade = hasFadedRef.value ? 1 : 0;
  const mouseTarget = new THREE.Vector2(0, 0);
  const mouseSmooth = new THREE.Vector2(0, 0);

  const setSize = () => {
    const { clientWidth: w, clientHeight: h } = mount;
    const pixelRatio = Math.min(props.dpr ?? window.devicePixelRatio ?? 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(w, h, false);
    uniforms.iResolution.value.set(w * pixelRatio, h * pixelRatio, pixelRatio);
  };

  setSize();
  const ro = new ResizeObserver(setSize);
  ro.observe(mount);

  const updateMouse = (clientX: number, clientY: number) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ratio = renderer.getPixelRatio();
    const hb = rect.height * ratio;
    mouseTarget.set(x * ratio, hb - y * ratio);
  };

  const onMove = (ev: PointerEvent | MouseEvent) => updateMouse(ev.clientX, ev.clientY);
  const onLeave = () => mouseTarget.set(0, 0);

  renderer.domElement.addEventListener('pointermove', onMove as any);
  renderer.domElement.addEventListener('pointerdown', onMove as any);
  renderer.domElement.addEventListener('pointerenter', onMove as any);
  renderer.domElement.addEventListener('pointerleave', onLeave as any);
  window.addEventListener('mousemove', onMove);

  let raf = 0;
  const animate = () => {
    const t = clock.getElapsedTime();
    const dt = Math.max(0, t - prevTime);
    prevTime = t;
    uniforms.iTime.value = t;
    uniforms.uTiltScale.value = props.mouseTiltStrength;
    uniforms.uWispDensity.value = props.wispDensity;
    uniforms.uBeamXFrac.value = props.horizontalBeamOffset;
    uniforms.uBeamYFrac.value = props.verticalBeamOffset;
    uniforms.uFlowSpeed.value = props.flowSpeed;
    uniforms.uVLenFactor.value = props.verticalSizing;
    uniforms.uHLenFactor.value = props.horizontalSizing;
    uniforms.uFogIntensity.value = props.fogIntensity;
    uniforms.uFogScale.value = props.fogScale;
    uniforms.uWSpeed.value = props.wispSpeed;
    uniforms.uWIntensity.value = props.wispIntensity;
    uniforms.uFlowStrength.value = props.flowStrength;
    uniforms.uDecay.value = props.decay;
    uniforms.uFalloffStart.value = props.falloffStart;
    uniforms.uFogFallSpeed.value = props.fogFallSpeed;
    (function () {
      let c = props.color || '#ffffff';
      c = c.trim();
      if (c[0] === '#') c = c.slice(1);
      if (c.length === 3)
        c = c
          .split('')
          .map(x => x + x)
          .join('');
      let n = parseInt(c, 16);
      if (isNaN(n)) n = 0xffffff;
      const r = ((n >> 16) & 255) / 255;
      const g = ((n >> 8) & 255) / 255;
      const b = (n & 255) / 255;
      uniforms.uColor.value.set(r, g, b);
    })();
    const cdt = Math.min(0.033, Math.max(0.001, dt));
    flowTime += cdt;
    fogTime += cdt;
    uniforms.uFlowTime.value = flowTime;
    uniforms.uFogTime.value = fogTime;
    if (!hasFadedRef.value) {
      const fadeDur = 1.0;
      fade = Math.min(1, fade + cdt / fadeDur);
      uniforms.uFade.value = fade;
      if (fade >= 1) hasFadedRef.value = true;
    } else if (uniforms.uFade.value !== 1) {
      uniforms.uFade.value = 1;
    }

    const tau = Math.max(1e-3, props.mouseSmoothTime);
    const alpha = 1 - Math.exp(-cdt / tau);
    mouseSmooth.lerp(mouseTarget, alpha);
    uniforms.iMouse.value.set(mouseSmooth.x, mouseSmooth.y, 0, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };
  animate();

  cleanup = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    renderer.domElement.removeEventListener('pointermove', onMove as any);
    renderer.domElement.removeEventListener('pointerdown', onMove as any);
    renderer.domElement.removeEventListener('pointerenter', onMove as any);
    renderer.domElement.removeEventListener('pointerleave', onLeave as any);
    window.removeEventListener('mousemove', onMove);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    mount.removeChild(renderer.domElement);
  };
};

onMounted(() => {
  setup();
});

onBeforeUnmount(() => {
  cleanup?.();
});

watch(
  props,
  () => {
    cleanup?.();
    setup();
  },
  { deep: true }
);
</script>

<template>
  <div ref="mountRef" :class="['w-full h-full relative', className]" :style="style" />
</template>
