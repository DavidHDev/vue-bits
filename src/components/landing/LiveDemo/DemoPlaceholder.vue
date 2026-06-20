<script setup lang="ts">
import { h, shallowRef, watch, type Component } from 'vue';

type Variant = 'shapegrid' | 'magicrings' | 'shinytext' | 'dock';

interface Props {
  variant: Variant;
  active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  active: false
});

const loaders = {
  shapegrid: () => import('@/content/Backgrounds/ShapeGrid/ShapeGrid.vue'),
  magicrings: () => import('@/content/Animations/MagicRings/MagicRings.vue'),
  shinytext: () => import('@/content/TextAnimations/ShinyText/ShinyText.vue'),
  dock: () => import('@/content/Components/Dock/Dock.vue')
};

const LoadedComponent = shallowRef<Component | null>(null);

const loadedVariant = shallowRef<Variant | null>(null);

watch(
  () => [props.variant, props.active],
  async () => {
    if (!props.active || loadedVariant.value === props.variant) {
      return;
    }

    const loadingVariant = props.variant;

    const module = await loaders[loadingVariant]();

    if (props.variant !== loadingVariant) {
      return;
    }

    LoadedComponent.value = module.default;
    loadedVariant.value = loadingVariant;
  },
  {
    immediate: true
  }
);

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'white',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
};

const HomeIcon = () =>
  h('svg', iconProps, [
    h('path', {
      d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
    }),
    h('polyline', {
      points: '9 22 9 12 15 12 15 22'
    })
  ]);

const ArchiveIcon = () =>
  h('svg', iconProps, [
    h('polyline', {
      points: '21 8 21 21 3 21 3 8'
    }),
    h('rect', {
      x: 1,
      y: 3,
      width: 22,
      height: 5
    }),
    h('line', {
      x1: 10,
      y1: 12,
      x2: 14,
      y2: 12
    })
  ]);

const ProfileIcon = () =>
  h('svg', iconProps, [
    h('path', {
      d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'
    }),
    h('circle', {
      cx: 12,
      cy: 7,
      r: 4
    })
  ]);

const SearchIcon = () =>
  h('svg', iconProps, [
    h('circle', {
      cx: 11,
      cy: 11,
      r: 7
    }),
    h('line', {
      x1: 21,
      y1: 21,
      x2: 16.65,
      y2: 16.65
    })
  ]);

const SettingsIcon = () =>
  h('svg', iconProps, [
    h('circle', {
      cx: 12,
      cy: 12,
      r: 3
    }),
    h('path', {
      d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'
    })
  ]);

const dockItems = [
  {
    label: 'Home',
    icon: HomeIcon,
    onClick: () => {}
  },
  {
    label: 'Archive',
    icon: ArchiveIcon,
    onClick: () => {}
  },
  {
    label: 'Search',
    icon: SearchIcon,
    onClick: () => {}
  },
  {
    label: 'Profile',
    icon: ProfileIcon,
    onClick: () => {}
  },
  {
    label: 'Settings',
    icon: SettingsIcon,
    onClick: () => {}
  }
];
</script>

<template>
  <div v-if="!LoadedComponent" class="demo-fill" aria-hidden="true" />

  <div v-else-if="variant === 'shapegrid'" class="demo-fill" aria-hidden="true">
    <component
      :is="LoadedComponent"
      shape="hexagon"
      direction="diagonal"
      :speed="0.6"
      borderColor="rgba(156, 163, 175, 0.4)"
      hoverFillColor="rgba(0, 200, 83, 0.6)"
      :squareSize="26"
      :hoverTrailAmount="4"
    />
  </div>

  <div v-else-if="variant === 'magicrings'" class="demo-fill" aria-hidden="true">
    <component
      :is="LoadedComponent"
      color="#00ffa9"
      colorTwo="#42fcff"
      :ringCount="6"
      :lineThickness="1.6"
      :baseRadius="0.32"
      :radiusStep="0.09"
      :noiseAmount="0.08"
      :followMouse="true"
      :hoverScale="1.15"
      :parallax="0.04"
    />
  </div>

  <div v-else-if="variant === 'shinytext'" class="demo-fill demo-shiny-wrap">
    <component
      :is="LoadedComponent"
      text="Shiny Text"
      :speed="3"
      color="#666"
      shineColor="#fff"
      class="demo-shiny-text"
    />
  </div>

  <div v-else-if="variant === 'dock'" class="demo-fill demo-dock-wrap">
    <div class="demo-dock-stage">
      <component
        :is="LoadedComponent"
        :items="dockItems"
        :panelHeight="64"
        :baseItemSize="42"
        :magnification="64"
        :distance="140"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-fill {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--bg-body);
}

.demo-shiny-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-shiny-text {
  font-family: 'Geist', sans-serif;
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 700;
  letter-spacing: -0.03em;
}

.demo-dock-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-dock-stage {
  position: relative;
  width: 100%;
  height: 78px;
}
</style>
