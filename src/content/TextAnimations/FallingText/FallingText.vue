<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, useTemplateRef } from 'vue';
import Matter from 'matter-js';

interface FallingTextProps {
  text?: string;
  highlightWords?: string[];
  trigger?: 'auto' | 'scroll' | 'click' | 'hover';
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
}

const props = withDefaults(defineProps<FallingTextProps>(), {
  text: '',
  highlightWords: () => [],
  trigger: 'auto',
  backgroundColor: 'transparent',
  wireframes: false,
  gravity: 1,
  mouseConstraintStiffness: 0.2,
  fontSize: '1rem'
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const textRef = useTemplateRef<HTMLDivElement>('textRef');
const canvasContainerRef = useTemplateRef<HTMLDivElement>('canvasContainerRef');

const effectStarted = ref(false);

let engine: Matter.Engine | null = null;
let render: Matter.Render | null = null;
let runner: Matter.Runner | null = null;
let mouseConstraint: Matter.MouseConstraint | null = null;
let wordBodies: Array<{ elem: HTMLElement; body: Matter.Body }> = [];
let intersectionObserver: IntersectionObserver | null = null;
let animationFrameId: number | null = null;

const createTextHTML = () => {
  if (!textRef.value) return;

  const words = props.text.split(' ');
  const newHTML = words
    .map(word => {
      const isHighlighted = props.highlightWords.some(hw => word.startsWith(hw));
      return `<span class="inline-block mx-[2px] select-none ${isHighlighted ? 'text-green-500 font-bold' : ''}">${word}</span>`;
    })
    .join(' ');

  textRef.value.innerHTML = newHTML;
};

const setupTrigger = () => {
  if (props.trigger === 'auto') {
    setTimeout(() => {
      effectStarted.value = true;
    }, 100);
    return;
  }

  if (props.trigger === 'scroll' && containerRef.value) {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          effectStarted.value = true;
          intersectionObserver?.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    intersectionObserver.observe(containerRef.value);
  }
};

const handleTrigger = () => {
  if (!effectStarted.value && (props.trigger === 'click' || props.trigger === 'hover')) {
    effectStarted.value = true;
  }
};

const startPhysics = async () => {
  if (!containerRef.value || !canvasContainerRef.value || !textRef.value) return;

  await nextTick();

  const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

  const containerRect = containerRef.value.getBoundingClientRect();
  const width = containerRect.width;
  const height = containerRect.height;

  if (width <= 0 || height <= 0) return;

  engine = Engine.create();
  engine.world.gravity.y = props.gravity;

  render = Render.create({
    element: canvasContainerRef.value,
    engine,
    options: {
      width,
      height,
      background: props.backgroundColor,
      wireframes: props.wireframes
    }
  });

  const boundaryOptions = {
    isStatic: true,
    render: { fillStyle: 'transparent' }
  };

  const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);
  const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
  const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
  const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

  const wordSpans = textRef.value.querySelectorAll('span') as NodeListOf<HTMLElement>;
  wordBodies = Array.from(wordSpans).map(elem => {
    const rect = elem.getBoundingClientRect();
    const containerRect = containerRef.value!.getBoundingClientRect();

    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top + rect.height / 2;

    const body = Bodies.rectangle(x, y, rect.width, rect.height, {
      render: { fillStyle: 'transparent' },
      restitution: 0.8,
      frictionAir: 0.01,
      friction: 0.2
    });

    Matter.Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 5,
      y: 0
    });
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

    return { elem, body };
  });

  wordBodies.forEach(({ elem, body }) => {
    elem.style.position = 'absolute';
    elem.style.left = `${body.position.x - (body.bounds.max.x - body.bounds.min.x) / 2}px`;
    elem.style.top = `${body.position.y - (body.bounds.max.y - body.bounds.min.y) / 2}px`;
    elem.style.transform = 'none';
  });

  const mouse = Mouse.create(containerRef.value);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: props.mouseConstraintStiffness,
      render: { visible: false }
    }
  });
  render.mouse = mouse;

  World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map(wb => wb.body)]);

  runner = Runner.create();
  Runner.run(runner, engine);
  Render.run(render);

  const updateLoop = () => {
    wordBodies.forEach(({ body, elem }) => {
      const { x, y } = body.position;
      elem.style.left = `${x}px`;
      elem.style.top = `${y}px`;
      elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
    });
    Matter.Engine.update(engine!);
    animationFrameId = requestAnimationFrame(updateLoop);
  };
  updateLoop();
};

const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (render) {
    Matter.Render.stop(render);
    if (render.canvas && canvasContainerRef.value) {
      canvasContainerRef.value.removeChild(render.canvas);
    }
    render = null;
  }

  if (runner && engine) {
    Matter.Runner.stop(runner);
    runner = null;
  }

  if (engine) {
    Matter.World.clear(engine.world, false);
    Matter.Engine.clear(engine);
    engine = null;
  }

  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }

  mouseConstraint = null;
  wordBodies = [];
};

watch(
  () => [props.text, props.highlightWords],
  () => {
    createTextHTML();
  },
  { immediate: true, deep: true }
);

watch(
  () => props.trigger,
  () => {
    effectStarted.value = false;
    cleanup();
    setupTrigger();
  },
  { immediate: true }
);

watch(
  () => effectStarted.value,
  started => {
    if (started) {
      startPhysics();
    }
  }
);

watch(
  () => [props.gravity, props.wireframes, props.backgroundColor, props.mouseConstraintStiffness],
  () => {
    if (effectStarted.value) {
      cleanup();
      startPhysics();
    }
  },
  { deep: true }
);

onMounted(() => {
  createTextHTML();
  setupTrigger();
});

onUnmounted(() => {
  cleanup();
});
</script>

<template>
  <div
    ref="containerRef"
    class="z-[1] relative pt-8 w-full h-full overflow-hidden text-center cursor-pointer"
    @click="props.trigger === 'click' ? handleTrigger() : undefined"
    @mouseenter="props.trigger === 'hover' ? handleTrigger() : undefined"
  >
    <div
      ref="textRef"
      class="inline-block"
      :style="{
        fontSize: props.fontSize,
        lineHeight: 1.4
      }"
    />

    <div class="top-0 left-0 z-0 absolute" ref="canvasContainerRef" />
  </div>
</template>
