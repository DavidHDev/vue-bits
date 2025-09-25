<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { mat4, quat, vec2, vec3 } from 'gl-matrix';

type InfiniteMenuItem = {
  image: string;
  link?: string;
  title?: string;
  description?: string;
};

type InfiniteMenuProps = {
  items?: InfiniteMenuItem[];
};

const DEFAULT_ITEMS: InfiniteMenuItem[] = [
  {
    image: 'https://picsum.photos/900/900?grayscale',
    link: 'https://google.com/',
    title: '',
    description: ''
  }
];

const props = defineProps<InfiniteMenuProps>();

// Refs
const canvasRef = ref<HTMLCanvasElement>();
const activeItem = ref<InfiniteMenuItem | null>(null);
const isMoving = ref(false);
const resolvedItems = computed(() => (props.items?.length ? props.items : DEFAULT_ITEMS));

// WebGL variables
let animationId: number | null = null;
let infiniteMenu: InfiniteGridMenu | null = null;

// Shader sources
const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

#define PI 3.141593

void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);

    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);

    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }

    worldPosition.xyz = radius * normalize(worldPosition.xyz);

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

    ivec2 texSize = textureSize(uTex, 0);
    float imageAspect = float(texSize.x) / float(texSize.y);
    float containerAspect = 1.0;

    float scale = max(imageAspect / containerAspect,
                     containerAspect / imageAspect);

    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = (st - 0.5) * scale + 0.5;

    st = clamp(st, 0.0, 1.0);

    st = st * cellSize + cellOffset;

    outColor = texture(uTex, st);
    outColor.a *= vAlpha;
}
`;

class Face {
  constructor(public a: number, public b: number, public c: number) {}
}

class Vertex {
  position: vec3;
  normal: vec3;
  uv: vec2;

  constructor(x: number, y: number, z: number) {
    this.position = vec3.fromValues(x, y, z);
    this.normal = vec3.create();
    this.uv = vec2.create();
  }
}

class Geometry {
  vertices: Vertex[] = [];
  faces: Face[] = [];

  addVertex(...args: number[]): this {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  addFace(...args: number[]): this {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  get lastVertex(): Vertex {
    return this.vertices[this.vertices.length - 1];
  }

  subdivide(divisions = 1): this {
    const midPointCache: Record<string, number> = {};
    let f = this.faces;

    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array(f.length * 4);

      f.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);

        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });

      f = newFaces;
    }

    this.faces = f;
    return this;
  }

  spherize(radius = 1): this {
    this.vertices.forEach((vertex) => {
      vec3.normalize(vertex.normal, vertex.position);
      vec3.scale(vertex.position, vertex.normal, radius);
    });
    return this;
  }

  get data() {
    return {
      vertices: this.vertexData,
      indices: this.indexData,
      normals: this.normalData,
      uvs: this.uvData,
    };
  }

  get vertexData(): Float32Array {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.position)));
  }

  get normalData(): Float32Array {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.normal)));
  }

  get uvData(): Float32Array {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.uv)));
  }

  get indexData(): Uint16Array {
    return new Uint16Array(this.faces.flatMap((f) => [f.a, f.b, f.c]));
  }

  getMidPoint(ndxA: number, ndxB: number, cache: Record<string, number>): number {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
      return cache[cacheKey];
    }
    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex(
      (a[0] + b[0]) * 0.5,
      (a[1] + b[1]) * 0.5,
      (a[2] + b[2]) * 0.5
    );
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0,
      0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t,
      t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1
    ).addFace(
      0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
      1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
      3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
      4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    steps = Math.max(4, steps);

    const alpha = (2 * Math.PI) / steps;

    this.addVertex(0, 0, 0);
    this.lastVertex.uv[0] = 0.5;
    this.lastVertex.uv[1] = 0.5;

    for (let i = 0; i < steps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv[0] = x * 0.5 + 0.5;
      this.lastVertex.uv[1] = y * 0.5 + 0.5;

      if (i > 0) {
        this.addFace(0, i, i + 1);
      }
    }
    this.addFace(0, steps, 1);
  }
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(
  gl: WebGL2RenderingContext,
  shaderSources: string[],
  transformFeedbackVaryings?: string[],
  attribLocations?: Record<string, number>
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) gl.attachShader(program, shader);
  });

  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
  }

  if (attribLocations) {
    for (const attrib in attribLocations) {
      gl.bindAttribLocation(program, attribLocations[attrib], attrib);
    }
  }

  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(
  gl: WebGL2RenderingContext,
  bufLocNumElmPairs: [WebGLBuffer, number, number][],
  indices?: Uint16Array
): WebGLVertexArrayObject | null {
  const va = gl.createVertexArray();
  if (!va) return null;

  gl.bindVertexArray(va);

  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(
      loc,
      numElem,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  if (indices) {
    const indexBuffer = gl.createBuffer();
    if (indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }
  }

  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

function makeBuffer(gl: WebGL2RenderingContext, sizeOrData: number | ArrayBuffer | ArrayBufferView, usage: number): WebGLBuffer | null {
  const buf = gl.createBuffer();
  if (!buf) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  if (typeof sizeOrData === 'number') {
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  } else {
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData as AllowSharedBufferSource, usage);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function createAndSetupTexture(
  gl: WebGL2RenderingContext,
  minFilter: number,
  magFilter: number,
  wrapS: number,
  wrapT: number
): WebGLTexture | null {
  const texture = gl.createTexture();
  if (!texture) return null;

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
}

class ArcballControl {
  isPointerDown = false;
  orientation = quat.create();
  pointerRotation = quat.create();
  rotationVelocity = 0;
  rotationAxis = vec3.fromValues(1, 0, 0);
  snapDirection = vec3.fromValues(0, 0, -1);
  snapTargetDirection?: vec3;
  EPSILON = 0.1;
  IDENTITY_QUAT = quat.create();

  private pointerPos = vec2.create();
  private previousPointerPos = vec2.create();
  private _rotationVelocity = 0;
  private _combinedQuat = quat.create();

  constructor(private canvas: HTMLCanvasElement, private updateCallback?: (deltaTime: number) => void) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.canvas.addEventListener('pointerdown', (e) => {
      vec2.set(this.pointerPos, e.clientX, e.clientY);
      vec2.copy(this.previousPointerPos, this.pointerPos);
      this.isPointerDown = true;
    });

    this.canvas.addEventListener('pointerup', () => {
      this.isPointerDown = false;
    });

    this.canvas.addEventListener('pointerleave', () => {
      this.isPointerDown = false;
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (this.isPointerDown) {
        vec2.set(this.pointerPos, e.clientX, e.clientY);
      }
    });

    this.canvas.style.touchAction = 'none';
  }

  update(deltaTime: number, targetFrameDuration = 16) {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    const snapRotation = quat.create();

    if (this.isPointerDown) {
      const INTENSITY = 0.3 * timeScale;
      const ANGLE_AMPLIFICATION = 5 / timeScale;

      const midPointerPos = vec2.sub(vec2.create(), this.pointerPos, this.previousPointerPos);
      vec2.scale(midPointerPos, midPointerPos, INTENSITY);

      if (vec2.sqrLen(midPointerPos) > this.EPSILON) {
        vec2.add(midPointerPos, this.previousPointerPos, midPointerPos);

        const p = this.project(midPointerPos);
        const q = this.project(this.previousPointerPos);
        const a = vec3.normalize(vec3.create(), p);
        const b = vec3.normalize(vec3.create(), q);

        vec2.copy(this.previousPointerPos, midPointerPos);

        angleFactor *= ANGLE_AMPLIFICATION;

        this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
      } else {
        quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);
      }
    } else {
      const INTENSITY = 0.1 * timeScale;
      quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);

      if (this.snapTargetDirection) {
        const SNAPPING_INTENSITY = 0.2;
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = vec3.squaredDistance(a, b);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= SNAPPING_INTENSITY * distanceFactor;
        this.quatFromVectors(a, b, snapRotation, angleFactor);
      }
    }

    const combinedQuat = quat.multiply(quat.create(), snapRotation, this.pointerRotation);
    this.orientation = quat.multiply(quat.create(), combinedQuat, this.orientation);
    quat.normalize(this.orientation, this.orientation);

    const RA_INTENSITY = 0.8 * timeScale;
    quat.slerp(this._combinedQuat, this._combinedQuat, combinedQuat, RA_INTENSITY);
    quat.normalize(this._combinedQuat, this._combinedQuat);

    const rad = Math.acos(this._combinedQuat[3]) * 2.0;
    const s = Math.sin(rad / 2.0);
    let rv = 0;
    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis[0] = this._combinedQuat[0] / s;
      this.rotationAxis[1] = this._combinedQuat[1] / s;
      this.rotationAxis[2] = this._combinedQuat[2] / s;
    }

    const RV_INTENSITY = 0.5 * timeScale;
    this._rotationVelocity += (rv - this._rotationVelocity) * RV_INTENSITY;
    this.rotationVelocity = this._rotationVelocity / timeScale;

    this.updateCallback?.(deltaTime);
  }

  quatFromVectors(a: vec3, b: vec3, out: quat, angleFactor = 1) {
    const axis = vec3.cross(vec3.create(), a, b);
    vec3.normalize(axis, axis);
    const d = Math.max(-1, Math.min(1, vec3.dot(a, b)));
    const angle = Math.acos(d) * angleFactor;
    quat.setAxisAngle(out, axis, angle);
    return { q: out, axis, angle };
  }

  private project(pos: vec2): vec3 {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = Math.max(w, h) - 1;

    const x = (2 * pos[0] - w - 1) / s;
    const y = (2 * pos[1] - h - 1) / s;
    let z = 0;
    const xySq = x * x + y * y;
    const rSq = r * r;

    if (xySq <= rSq / 2.0) {
      z = Math.sqrt(rSq - xySq);
    } else {
      z = rSq / Math.sqrt(xySq);
    }
    return vec3.fromValues(-x, y, z);
  }
}

class InfiniteGridMenu {
  private TARGET_FRAME_DURATION = 1000 / 60;
  private SPHERE_RADIUS = 2;
  private time = 0;
  private deltaTime = 0;
  private deltaFrames = 0;
  private frames = 0;

  private camera = {
    matrix: mat4.create(),
    near: 0.1,
    far: 40,
    fov: Math.PI / 4,
    aspect: 1,
    position: vec3.fromValues(0, 0, 3),
    up: vec3.fromValues(0, 1, 0),
    matrices: {
      view: mat4.create(),
      projection: mat4.create(),
      inversProjection: mat4.create(),
    },
  };

  private nearestVertexIndex: number | null = null;
  private smoothRotationVelocity = 0;
  private scaleFactor = 1.0;
  private movementActive = false;

  private discProgram: WebGLProgram | null = null;
  private discLocations: Record<string, WebGLUniformLocation | number | null> = {};
  private discGeo!: DiscGeometry;
  private discBuffers: Record<string, Float32Array | Uint16Array> = {};
  private discVAO: WebGLVertexArrayObject | null = null;
  private icoGeo!: IcosahedronGeometry;
  private instancePositions: vec3[] = [];
  private DISC_INSTANCE_COUNT = 0;
  private discInstances: {
    matricesArray: Float32Array;
    matrices: Float32Array[];
    buffer: WebGLBuffer | null;
  } = {
    matricesArray: new Float32Array(0),
    matrices: [],
    buffer: null
  };
  private worldMatrix = mat4.create();
  private tex: WebGLTexture | null = null;
  private atlasSize = 0;
  private control!: ArcballControl;
  private viewportSize!: vec2;

  constructor(
    private canvas: HTMLCanvasElement,
    private items: InfiniteMenuItem[],
    private onActiveItemChange: (index: number) => void,
    private onMovementChange: (isMoving: boolean) => void,
    private onInit?: (menu: InfiniteGridMenu) => void
  ) {
    this.init();
  }

  private init() {
    this.gl = this.canvas.getContext('webgl2', { antialias: true, alpha: false }) as WebGL2RenderingContext;
    if (!this.gl) {
      throw new Error('No WebGL 2 context!');
    }

    this.viewportSize = vec2.fromValues(this.canvas.clientWidth, this.canvas.clientHeight);

    this.discProgram = createProgram(this.gl, [discVertShaderSource, discFragShaderSource], undefined, {
      aModelPosition: 0,
      aModelNormal: 1,
      aModelUvs: 2,
      aInstanceMatrix: 3,
    });

    if (!this.discProgram) {
      throw new Error('Failed to create shader program');
    }

    this.discLocations = {
      aModelPosition: this.gl.getAttribLocation(this.discProgram, 'aModelPosition'),
      aModelUvs: this.gl.getAttribLocation(this.discProgram, 'aModelUvs'),
      aInstanceMatrix: this.gl.getAttribLocation(this.discProgram, 'aInstanceMatrix'),
      uWorldMatrix: this.gl.getUniformLocation(this.discProgram, 'uWorldMatrix'),
      uViewMatrix: this.gl.getUniformLocation(this.discProgram, 'uViewMatrix'),
      uProjectionMatrix: this.gl.getUniformLocation(this.discProgram, 'uProjectionMatrix'),
      uCameraPosition: this.gl.getUniformLocation(this.discProgram, 'uCameraPosition'),
      uRotationAxisVelocity: this.gl.getUniformLocation(this.discProgram, 'uRotationAxisVelocity'),
      uTex: this.gl.getUniformLocation(this.discProgram, 'uTex'),
      uItemCount: this.gl.getUniformLocation(this.discProgram, 'uItemCount'),
      uAtlasSize: this.gl.getUniformLocation(this.discProgram, 'uAtlasSize'),
      uFrames: this.gl.getUniformLocation(this.discProgram, 'uFrames'),
      uScaleFactor: this.gl.getUniformLocation(this.discProgram, 'uScaleFactor')
    };

    this.discGeo = new DiscGeometry(56, 1);
    this.discBuffers = this.discGeo.data;
    this.discVAO = makeVertexArray(
      this.gl,
      [
        [makeBuffer(this.gl, this.discBuffers.vertices, this.gl.STATIC_DRAW)!, this.discLocations.aModelPosition as number, 3],
        [makeBuffer(this.gl, this.discBuffers.uvs, this.gl.STATIC_DRAW)!, this.discLocations.aModelUvs as number, 2],
      ],
      this.discBuffers.indices as Uint16Array
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map((v) => v.position);
    this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
    this.initDiscInstances(this.DISC_INSTANCE_COUNT);

    this.initTexture();

    this.control = new ArcballControl(this.canvas, (deltaTime) => this.onControlUpdate(deltaTime));

    this.updateCameraMatrix();
    this.updateProjectionMatrix();
    this.resize();

    this.onInit?.(this);
  }

  private initTexture() {
    if (!this.gl) return;

    this.tex = createAndSetupTexture(this.gl, this.gl.LINEAR, this.gl.LINEAR, this.gl.CLAMP_TO_EDGE, this.gl.CLAMP_TO_EDGE);
    if (!this.tex) return;

    const itemCount = Math.max(1, this.items.length);
    this.atlasSize = Math.ceil(Math.sqrt(itemCount));
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 512;
    canvas.width = this.atlasSize * cellSize;
    canvas.height = this.atlasSize * cellSize;

    Promise.all(this.items.map(item =>
      new Promise<HTMLImageElement>(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img); // Continue even if image fails
        img.src = item.image;
      })
    )).then(images => {
      images.forEach((img, i) => {
        const x = (i % this.atlasSize) * cellSize;
        const y = Math.floor(i / this.atlasSize) * cellSize;
        try {
          ctx.drawImage(img, x, y, cellSize, cellSize);
        } catch {
          // Skip failed images
        }
      });

      if (this.gl && this.tex) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, canvas);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
      }
    });
  }

  private initDiscInstances(count: number) {
    if (!this.gl) return;

    this.discInstances = {
      matricesArray: new Float32Array(count * 16),
      matrices: [] as Float32Array[],
      buffer: this.gl.createBuffer(),
    };

    for (let i = 0; i < count; ++i) {
      const instanceMatrixArray = new Float32Array(this.discInstances.matricesArray.buffer, i * 16 * 4, 16);
      instanceMatrixArray.set(mat4.create());
      this.discInstances.matrices.push(instanceMatrixArray);
    }

    this.gl.bindVertexArray(this.discVAO);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.discInstances.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.discInstances.matricesArray.byteLength, this.gl.DYNAMIC_DRAW);

    const mat4AttribSlotCount = 4;
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < mat4AttribSlotCount; ++j) {
      const loc = (this.discLocations.aInstanceMatrix as number) + j;
      this.gl.enableVertexAttribArray(loc);
      this.gl.vertexAttribPointer(
        loc,
        4,
        this.gl.FLOAT,
        false,
        bytesPerMatrix,
        j * 4 * 4
      );
      this.gl.vertexAttribDivisor(loc, 1);
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindVertexArray(null);
  }

  run(time = 0) {
    this.deltaTime = Math.min(32, time - this.time);
    this.time = time;
    this.deltaFrames = this.deltaTime / this.TARGET_FRAME_DURATION;
    this.frames += this.deltaFrames;

    this.animate();
    this.render();

    animationId = requestAnimationFrame((t) => this.run(t));
  }

  resize() {
    this.viewportSize = vec2.set(
      this.viewportSize || vec2.create(),
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );

    if (!this.gl) return;

    const needsResize = resizeCanvasToDisplaySize(this.canvas);
    if (needsResize) {
      this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    }

    this.updateProjectionMatrix();
  }

  private animate() {
    if (!this.gl) return;

    this.control.update(this.deltaTime, this.TARGET_FRAME_DURATION);

    const positions = this.instancePositions.map((p) => vec3.transformQuat(vec3.create(), p, this.control.orientation));
    const scale = 0.25;
    const SCALE_INTENSITY = 0.6;

    positions.forEach((p, ndx) => {
      const s = (Math.abs(p[2]) / this.SPHERE_RADIUS) * SCALE_INTENSITY + (1 - SCALE_INTENSITY);
      const finalScale = s * scale;
      const matrix = mat4.create();
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), vec3.negate(vec3.create(), p)));
      mat4.multiply(matrix, matrix, mat4.targetTo(mat4.create(), [0, 0, 0], p, [0, 1, 0]));
      mat4.multiply(matrix, matrix, mat4.fromScaling(mat4.create(), [finalScale, finalScale, finalScale]));
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), [0, 0, -this.SPHERE_RADIUS]));

      mat4.copy(this.discInstances.matrices[ndx], matrix);
    });

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.discInstances.buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.discInstances.matricesArray);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    this.smoothRotationVelocity = this.control.rotationVelocity;
  }

  private render() {
    if (!this.gl) return;

    this.gl.useProgram(this.discProgram);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.uniformMatrix4fv(this.discLocations.uWorldMatrix, false, this.worldMatrix);
    this.gl.uniformMatrix4fv(this.discLocations.uViewMatrix, false, this.camera.matrices.view);
    this.gl.uniformMatrix4fv(this.discLocations.uProjectionMatrix, false, this.camera.matrices.projection);
    this.gl.uniform3f(this.discLocations.uCameraPosition, this.camera.position[0], this.camera.position[1], this.camera.position[2]);
    this.gl.uniform4f(
      this.discLocations.uRotationAxisVelocity,
      this.control.rotationAxis[0],
      this.control.rotationAxis[1],
      this.control.rotationAxis[2],
      this.smoothRotationVelocity * 1.1
    );

    const itemCountLocation = this.discLocations.uItemCount as WebGLUniformLocation | null;
    if (itemCountLocation !== null) {
      this.gl.uniform1i(itemCountLocation, this.items.length);
    }

    const atlasSizeLocation = this.discLocations.uAtlasSize as WebGLUniformLocation | null;
    if (atlasSizeLocation !== null) {
      this.gl.uniform1i(atlasSizeLocation, this.atlasSize);
    }

    const framesLocation = this.discLocations.uFrames as WebGLUniformLocation | null;
    if (framesLocation !== null) {
      this.gl.uniform1f(framesLocation, this.frames);
    }

    const scaleFactorLocation = this.discLocations.uScaleFactor as WebGLUniformLocation | null;
    if (scaleFactorLocation !== null) {
      this.gl.uniform1f(scaleFactorLocation, this.scaleFactor);
    }

    const textureLocation = this.discLocations.uTex as WebGLUniformLocation | null;
    if (textureLocation !== null) {
      this.gl.uniform1i(textureLocation, 0);
    }
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);

    this.gl.bindVertexArray(this.discVAO);
    this.gl.drawElementsInstanced(
      this.gl.TRIANGLES,
      this.discBuffers.indices.length,
      this.gl.UNSIGNED_SHORT,
      0,
      this.DISC_INSTANCE_COUNT
    );
  }

  private updateCameraMatrix() {
    mat4.targetTo(this.camera.matrix, this.camera.position, [0, 0, 0], this.camera.up);
    mat4.invert(this.camera.matrices.view, this.camera.matrix);
  }

  private updateProjectionMatrix() {
    if (!this.gl) return;

    this.camera.aspect = this.gl.canvas.width / this.gl.canvas.height;
    const height = this.SPHERE_RADIUS * 0.35;
    const distance = this.camera.position[2];
    if (this.camera.aspect > 1) {
      this.camera.fov = 2 * Math.atan(height / distance);
    } else {
      this.camera.fov = 2 * Math.atan((height / this.camera.aspect) / distance);
    }
    mat4.perspective(
      this.camera.matrices.projection,
      this.camera.fov,
      this.camera.aspect,
      this.camera.near,
      this.camera.far
    );
    mat4.invert(this.camera.matrices.inversProjection, this.camera.matrices.projection);
  }

  private onControlUpdate(deltaTime: number) {
    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = 3;

    const isMoving = this.control.isPointerDown || Math.abs(this.smoothRotationVelocity) > 0.01;

    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (!this.control.isPointerDown) {
      const nearestVertexIndex = this.findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
      const snapDirection = vec3.normalize(vec3.create(), this.getVertexWorldPosition(nearestVertexIndex));
      this.control.snapTargetDirection = snapDirection;
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
    }

    this.camera.position[2] += (cameraTargetZ - this.camera.position[2]) / damping;
    this.updateCameraMatrix();
  }

  private findNearestVertexIndex(): number {
    const n = this.control.snapDirection;
    const inversOrientation = quat.conjugate(quat.create(), this.control.orientation);
    const nt = vec3.transformQuat(vec3.create(), n, inversOrientation);

    let maxD = -1;
    let nearestVertexIndex = 0;
    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = vec3.dot(nt, this.instancePositions[i]);
      if (d > maxD) {
        maxD = d;
        nearestVertexIndex = i;
      }
    }
    return nearestVertexIndex;
  }

  private getVertexWorldPosition(index: number): vec3 {
    const nearestVertexPos = this.instancePositions[index];
    return vec3.transformQuat(vec3.create(), nearestVertexPos, this.control.orientation);
  }

  destroy() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  private gl: WebGL2RenderingContext | null = null;
}

// Event handlers
const handleActiveItem = (index: number) => {
  const items = resolvedItems.value;
  if (!items.length) return;
  const itemIndex = index % items.length;
  activeItem.value = items[itemIndex];
};

const handleButtonClick = () => {
  if (!activeItem.value?.link) return;
  if (activeItem.value.link.startsWith('http')) {
    window.open(activeItem.value.link, '_blank');
  } else {
    console.log('Internal route:', activeItem.value.link);
  }
};

// Lifecycle
onMounted(() => {
  if (!canvasRef.value) return;

  try {
    infiniteMenu = new InfiniteGridMenu(
      canvasRef.value,
      resolvedItems.value,
      handleActiveItem,
      (moving) => { isMoving.value = moving; },
      (menu) => menu.run()
    );

    const handleResize = () => {
      infiniteMenu?.resize();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup function stored for unmount
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      infiniteMenu?.destroy();
    });
  } catch (error) {
    console.error('Failed to initialize InfiniteMenu:', error);
  }
});

watch(() => props.items, () => {
  // Reinitialize on items change
  if (infiniteMenu && canvasRef.value) {
    infiniteMenu.destroy();
    infiniteMenu = new InfiniteGridMenu(
      canvasRef.value,
      resolvedItems.value,
      handleActiveItem,
      (moving) => { isMoving.value = moving; },
      (menu) => menu.run()
    );
  }
}, { deep: true });
</script>

<template>
  <div class="relative w-full h-full">
    <canvas
      ref="canvasRef"
      class="w-full h-full cursor-grab active:cursor-grabbing outline-none overflow-hidden"
    />

    <template v-if="activeItem">
      <h2
        :class="[
          'select-none absolute font-black text-6xl top-1/2 text-white transition-all duration-500 ease-in-out hidden xl:block',
          isMoving
            ? 'pointer-events-none opacity-0 transition-all duration-100 ease-in-out'
            : 'opacity-100 pointer-events-auto'
        ]"
        :style="{
          left: '1.6em',
          transform: 'translate(20%, -50%)'
        }"
      >
        {{ activeItem.title }}
      </h2>

      <p
        :class="[
          'select-none absolute top-1/2 text-2xl text-white/80 transition-all ease-in-out hidden xl:block',
          isMoving
            ? 'pointer-events-none opacity-0 duration-100'
            : 'opacity-100 pointer-events-auto duration-500'
        ]"
        :style="{
          right: '1%',
          maxWidth: '10ch',
          transform: isMoving ? 'translate(-60%, -50%)' : 'translate(-90%, -50%)'
        }"
      >
        {{ activeItem.description }}
      </p>

      <div
        @click="handleButtonClick"
        :class="[
          'absolute left-1/2 z-10 grid place-items-center bg-purple-600 rounded-full cursor-pointer border-4 border-black transition-all ease-in-out',
          isMoving
            ? 'pointer-events-none opacity-0 duration-100'
            : 'opacity-100 pointer-events-auto duration-500'
        ]"
        :style="{
          width: '60px',
          height: '60px',
          bottom: isMoving ? '-80px' : '61px',
          transform: isMoving ? 'translateX(-50%) scale(0)' : 'translateX(-50%) scale(1)'
        }"
      >
        <p class="select-none relative text-white text-2xl" :style="{ top: '2px' }">&#x2197;</p>
      </div>
    </template>
  </div>
</template>
