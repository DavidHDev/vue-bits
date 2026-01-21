export type ComponentMetadata = Record<
  string,
  {
    videoUrl: string;
    description: string;
    category: string;
    name: string;
    docsUrl: string;
    tags: string[];
  }
>;

export const componentMetadata: ComponentMetadata = {
  //! Animations -------------------------------------------------------------------------------------------------------------------------------

  'Animations/AnimatedContent': {
    videoUrl: '/assets/videos/animatedcontent.webm',
    description:
      'Wrapper that animates any children on scroll or mount with configurable direction, distance, duration and easing.',
    category: 'Animations',
    name: 'AnimatedContent',
    docsUrl: 'https://vue-bits.dev/animations/animated-content',
    tags: []
  },
  'Animations/BlobCursor': {
    videoUrl: '/assets/videos/blobcursor.webm',
    description: 'Organic blob cursor that smoothly follows the pointer with inertia and elastic morphing.',
    category: 'Animations',
    name: 'BlobCursor',
    docsUrl: 'https://vue-bits.dev/animations/blob-cursor',
    tags: []
  },
  'Animations/ClickSpark': {
    videoUrl: '/assets/videos/clickspark.webm',
    description: 'Creates particle spark bursts at click position.',
    category: 'Animations',
    name: 'ClickSpark',
    docsUrl: 'https://vue-bits.dev/animations/click-spark',
    tags: []
  },
  'Animations/Crosshair': {
    videoUrl: '/assets/videos/crosshair.webm',
    description: 'Custom crosshair cursor with tracking, and link hover effects.',
    category: 'Animations',
    name: 'Crosshair',
    docsUrl: 'https://vue-bits.dev/animations/crosshair',
    tags: []
  },
  'Animations/Cubes': {
    videoUrl: '/assets/videos/cubes.webm',
    description: '3D rotating cube cluster. Supports auto-rotation or hover interaction.',
    category: 'Animations',
    name: 'Cubes',
    docsUrl: 'https://vue-bits.dev/animations/cubes',
    tags: []
  },
  'Animations/ElectricBorder': {
    videoUrl: '/assets/videos/electricborder.webm',
    description: 'Jittery electric energy border with animated arcs, glow and adjustable intensity.',
    category: 'Animations',
    name: 'ElectricBorder',
    docsUrl: 'https://vue-bits.dev/animations/electric-border',
    tags: []
  },
  'Animations/FadeContent': {
    videoUrl: '/assets/videos/fadecontent.webm',
    description: 'Simple directional fade / slide entrance wrapper with threshold-based activation.',
    category: 'Animations',
    name: 'FadeContent',
    docsUrl: 'https://vue-bits.dev/animations/fade-content',
    tags: []
  },
  'Animations/GlareHover': {
    videoUrl: '/assets/videos/glarehover.webm',
    description: 'Adds a realistic moving glare highlight on hover over any element.',
    category: 'Animations',
    name: 'GlareHover',
    docsUrl: 'https://vue-bits.dev/animations/glare-hover',
    tags: []
  },
  'Animations/GradualBlur': {
    videoUrl: '/assets/videos/gradualblur.webm',
    description: 'Progressively un-blurs content based on scroll or trigger creating a cinematic reveal.',
    category: 'Animations',
    name: 'GradualBlur',
    docsUrl: 'https://vue-bits.dev/animations/gradual-blur',
    tags: []
  },
  'Animations/GhostCursor': {
    videoUrl: '/assets/videos/ghostcursor.webm',
    description: 'Semi-transparent ghost cursor that smoothly follows the real cursor with a trailing effect.',
    category: 'Animations',
    name: 'GhostCursor',
    docsUrl: 'https://vue-bits.dev/animations/ghost-cursor',
    tags: []
  },
  'Animations/ImageTrail': {
    videoUrl: '/assets/videos/imagetrail.webm',
    description: 'Cursor-based image trail with several built-in variants.',
    category: 'Animations',
    name: 'ImageTrail',
    docsUrl: 'https://vue-bits.dev/animations/image-trail',
    tags: []
  },
  'Animations/LogoLoop': {
    videoUrl: '/assets/videos/logoloop.webm',
    description: 'Continuously looping marquee of brand or tech logos with seamless repeat and hover pause.',
    category: 'Animations',
    name: 'LogoLoop',
    docsUrl: 'https://vue-bits.dev/animations/logo-loop',
    tags: []
  },
  'Animations/Magnet': {
    videoUrl: '/assets/videos/magnet.webm',
    description: 'Elements magnetically ease toward the cursor then settle back with spring physics.',
    category: 'Animations',
    name: 'Magnet',
    docsUrl: 'https://vue-bits.dev/animations/magnet',
    tags: []
  },
  'Animations/MagnetLines': {
    videoUrl: '/assets/videos/magnetlines.webm',
    description: 'Animated field lines bend toward the cursor.',
    category: 'Animations',
    name: 'MagnetLines',
    docsUrl: 'https://vue-bits.dev/animations/magnet-lines',
    tags: []
  },
  'Animations/MetaBalls': {
    videoUrl: '/assets/videos/metaballs.webm',
    description: 'Liquid metaball blobs that merge and separate with smooth implicit surface animation.',
    category: 'Animations',
    name: 'MetaBalls',
    docsUrl: 'https://vue-bits.dev/animations/meta-balls',
    tags: []
  },
  'Animations/MetallicPaint': {
    videoUrl: '/assets/videos/metallicpaint.webm',
    description: 'Liquid metallic paint shader which can be applied to SVG elements.',
    category: 'Animations',
    name: 'MetallicPaint',
    docsUrl: 'https://vue-bits.dev/animations/metallic-paint',
    tags: []
  },
  'Animations/Noise': {
    videoUrl: '/assets/videos/noise.webm',
    description: 'Animated film grain / noise overlay adding subtle texture and motion.',
    category: 'Animations',
    name: 'Noise',
    docsUrl: 'https://vue-bits.dev/animations/noise',
    tags: []
  },
  'Animations/PixelTransition': {
    videoUrl: '/assets/videos/pixeltransition.webm',
    description: 'Pixel dissolve transition for content reveal on hover.',
    category: 'Animations',
    name: 'PixelTransition',
    docsUrl: 'https://vue-bits.dev/animations/pixel-transition',
    tags: []
  },
  'Animations/Ribbons': {
    videoUrl: '/assets/videos/ribbons.webm',
    description: 'Flowing responsive ribbons/cursor trail driven by physics and pointer motion.',
    category: 'Animations',
    name: 'Ribbons',
    docsUrl: 'https://vue-bits.dev/animations/ribbons',
    tags: []
  },
  'Animations/ShapeBlur': {
    videoUrl: '/assets/videos/shapeblur.webm',
    description: 'Morphing blurred geometric shape. The effect occurs on hover.',
    category: 'Animations',
    name: 'ShapeBlur',
    docsUrl: 'https://vue-bits.dev/animations/shape-blur',
    tags: []
  },
  'Animations/SplashCursor': {
    videoUrl: '/assets/videos/splashcursor.webm',
    description: 'Liquid splash burst at cursor with curling ripples and waves.',
    category: 'Animations',
    name: 'SplashCursor',
    docsUrl: 'https://vue-bits.dev/animations/splash-cursor',
    tags: []
  },
  'Animations/StarBorder': {
    videoUrl: '/assets/videos/starborder.webm',
    description: 'Animated star / sparkle border orbiting content with twinkle pulses.',
    category: 'Animations',
    name: 'StarBorder',
    docsUrl: 'https://vue-bits.dev/animations/star-border',
    tags: []
  },
  'Animations/StickerPeel': {
    videoUrl: '/assets/videos/stickerpeel.webm',
    description: 'Sticker corner lift + peel interaction using 3D transform and shadow depth.',
    category: 'Animations',
    name: 'StickerPeel',
    docsUrl: 'https://vue-bits.dev/animations/sticker-peel',
    tags: []
  },
  'Animations/TargetCursor': {
    videoUrl: '/assets/videos/targetcursor.webm',
    description: 'A cursor follow animation with 4 corners that lock onto targets.',
    category: 'Animations',
    name: 'TargetCursor',
    docsUrl: 'https://vue-bits.dev/animations/target-cursor',
    tags: []
  },
  'Animations/LaserFlow': {
    videoUrl: '/assets/videos/laserflow.webm',
    description: 'Dynamic laser light that flows onto a surface, customizable effect.',
    category: 'Animations',
    name: 'LaserFlow',
    docsUrl: 'https://vue-bits.dev/animations/laser-flow',
    tags: []
  },
  'Animations/PixelTrail': {
    videoUrl: '/assets/videos/pixeltrail.webm',
    description: 'Pixel grid trail effect that follows cursor movement with customizable gooey filter.',
    category: 'Animations',
    name: 'PixelTrail',
    docsUrl: 'https://vue-bits.dev/animations/pixel-trail',
    tags: []
  },

  //! Text Animations -------------------------------------------------------------------------------------------------------------------------------

  'TextAnimations/ASCIIText': {
    videoUrl: '/assets/videos/asciitext.webm',
    description: 'Renders text with an animated ASCII background for a retro feel.',
    category: 'TextAnimations',
    name: 'ASCIIText',
    docsUrl: 'https://vue-bits.dev/text-animations/ascii-text',
    tags: []
  },
  'TextAnimations/CountUp': {
    videoUrl: '/assets/videos/countup.webm',
    description: 'Animated number counter supporting formatting and decimals.',
    category: 'TextAnimations',
    name: 'CountUp',
    docsUrl: 'https://vue-bits.dev/text-animations/count-up',
    tags: []
  },
  'TextAnimations/BlurText': {
    videoUrl: '/assets/videos/blurtext.webm',
    description: 'Text starts blurred then crisply resolves for a soft-focus reveal effect.',
    category: 'TextAnimations',
    name: 'BlurText',
    docsUrl: 'https://vue-bits.dev/text-animations/blur-text',
    tags: []
  },
  'TextAnimations/CircularText': {
    videoUrl: '/assets/videos/circulartext.webm',
    description: 'Layouts characters around a circle with optional rotation animation.',
    category: 'TextAnimations',
    name: 'CircularText',
    docsUrl: 'https://vue-bits.dev/text-animations/circular-text',
    tags: []
  },
  'TextAnimations/CurvedLoop': {
    videoUrl: '/assets/videos/curvedloop.webm',
    description: 'Flowing looping text path along a customizable curve with drag interaction.',
    category: 'TextAnimations',
    name: 'CurvedLoop',
    docsUrl: 'https://vue-bits.dev/text-animations/curved-loop',
    tags: []
  },
  'TextAnimations/DecryptedText': {
    videoUrl: '/assets/videos/decryptedtext.webm',
    description: 'Hacker-style decryption cycling random glyphs until resolving to real text.',
    category: 'TextAnimations',
    name: 'DecryptedText',
    docsUrl: 'https://vue-bits.dev/text-animations/decrypted-text',
    tags: []
  },
  'TextAnimations/FallingText': {
    videoUrl: '/assets/videos/fallingtext.webm',
    description: 'Characters fall with gravity + bounce creating a playful entrance.',
    category: 'TextAnimations',
    name: 'FallingText',
    docsUrl: 'https://vue-bits.dev/text-animations/falling-text',
    tags: []
  },
  'TextAnimations/FuzzyText': {
    videoUrl: '/assets/videos/fuzzytext.webm',
    description: 'Vibrating fuzzy text with controllable hover intensity.',
    category: 'TextAnimations',
    name: 'FuzzyText',
    docsUrl: 'https://vue-bits.dev/text-animations/fuzzy-text',
    tags: []
  },
  'TextAnimations/GlitchText': {
    videoUrl: '/assets/videos/glitchtext.webm',
    description: 'RGB split and distortion glitch effect with jitter effects.',
    category: 'TextAnimations',
    name: 'GlitchText',
    docsUrl: 'https://vue-bits.dev/text-animations/glitch-text',
    tags: []
  },
  'TextAnimations/GradientText': {
    videoUrl: '/assets/videos/gradienttext.webm',
    description: 'Animated gradient sweep across live text with speed and color control.',
    category: 'TextAnimations',
    name: 'GradientText',
    docsUrl: 'https://vue-bits.dev/text-animations/gradient-text',
    tags: []
  },
  'TextAnimations/RotatingText': {
    videoUrl: '/assets/videos/rotatingtext.webm',
    description: 'Cycles through multiple phrases with 3D rotate / flip transitions.',
    category: 'TextAnimations',
    name: 'RotatingText',
    docsUrl: 'https://vue-bits.dev/text-animations/rotating-text',
    tags: []
  },
  'TextAnimations/ScrambleText': {
    videoUrl: '/assets/videos/scrambledtext.webm',
    description: 'Detects cursor position and applies a distortion effect to text.',
    category: 'TextAnimations',
    name: 'ScrambleText',
    docsUrl: 'https://vue-bits.dev/text-animations/scramble-text',
    tags: []
  },
  'TextAnimations/ScrollFloat': {
    videoUrl: '/assets/videos/scrollfloat.webm',
    description: 'Text gently floats / parallax shifts on scroll.',
    category: 'TextAnimations',
    name: 'ScrollFloat',
    docsUrl: 'https://vue-bits.dev/text-animations/scroll-float',
    tags: []
  },
  'TextAnimations/ScrollReveal': {
    videoUrl: '/assets/videos/scrollreveal.webm',
    description: 'Text gently unblurs and reveals on scroll.',
    category: 'TextAnimations',
    name: 'ScrollReveal',
    docsUrl: 'https://vue-bits.dev/text-animations/scroll-reveal',
    tags: []
  },
  'TextAnimations/ScrollVelocity': {
    videoUrl: '/assets/videos/scrollvelocity.webm',
    description: "Text marquee animatio - speed and distortion scale with user's scroll velocity.",
    category: 'TextAnimations',
    name: 'ScrollVelocity',
    docsUrl: 'https://vue-bits.dev/text-animations/scroll-velocity',
    tags: []
  },
  'TextAnimations/ShinyText': {
    videoUrl: '/assets/videos/shinytext.webm',
    description: 'Metallic sheen sweeps across text producing a reflective highlight.',
    category: 'TextAnimations',
    name: 'ShinyText',
    docsUrl: 'https://vue-bits.dev/text-animations/shiny-text',
    tags: []
  },
  'TextAnimations/SplitText': {
    videoUrl: '/assets/videos/splittext.webm',
    description: 'Splits text into characters / words for staggered entrance animation.',
    category: 'TextAnimations',
    name: 'SplitText',
    docsUrl: 'https://vue-bits.dev/text-animations/split-text',
    tags: []
  },
  'TextAnimations/TextCursor': {
    videoUrl: '/assets/videos/textcursor.webm',
    description: 'Make any text element follow your cursor, leaving a trail of copies behind it.',
    category: 'TextAnimations',
    name: 'TextCursor',
    docsUrl: 'https://vue-bits.dev/text-animations/text-cursor',
    tags: []
  },
  'TextAnimations/TextPressure': {
    videoUrl: '/assets/videos/textpressure.webm',
    description: 'Characters scale / warp interactively based on pointer pressure zone.',
    category: 'TextAnimations',
    name: 'TextPressure',
    docsUrl: 'https://vue-bits.dev/text-animations/text-pressure',
    tags: []
  },
  'TextAnimations/TextType': {
    videoUrl: '/assets/videos/texttype.webm',
    description: 'Typewriter effect with blinking cursor and adjustable typing cadence.',
    category: 'TextAnimations',
    name: 'TextType',
    docsUrl: 'https://vue-bits.dev/text-animations/text-type',
    tags: []
  },
  'TextAnimations/TrueFocus': {
    videoUrl: '/assets/videos/truefocus.webm',
    description: 'Applies dynamic blur / clarity based over a series of words in order.',
    category: 'TextAnimations',
    name: 'TrueFocus',
    docsUrl: 'https://vue-bits.dev/text-animations/true-focus',
    tags: []
  },
  'TextAnimations/VariableProximity': {
    videoUrl: '/assets/videos/variableproximity.webm',
    description: 'Letter styling changes continuously with pointer distance mapping.',
    category: 'TextAnimations',
    name: 'VariableProximity',
    docsUrl: 'https://vue-bits.dev/text-animations/variable-proximity',
    tags: []
  },
  'TextAnimations/Shuffle': {
    videoUrl: '/assets/videos/shuffle.webm',
    description: 'GSAP-powered slot machine style text shuffle animation with scroll trigger.',
    category: 'TextAnimations',
    name: 'Shuffle',
    docsUrl: 'https://vue-bits.dev/text-animations/shuffle',
    tags: []
  },

  //! Components -------------------------------------------------------------------------------------------------------------------------------
  'Components/AnimatedList': {
    videoUrl: '/assets/videos/animatedlist.webm',
    description: 'List items enter with staggered motion variants for polished reveals.',
    category: 'Components',
    name: 'AnimatedList',
    docsUrl: 'https://vue-bits.dev/components/animated-list',
    tags: []
  },
  'Components/BounceCards': {
    videoUrl: '/assets/videos/bouncecards.webm',
    description: 'Cards bounce that bounce in on mount.',
    category: 'Components',
    name: 'BounceCards',
    docsUrl: 'https://vue-bits.dev/components/bounce-cards',
    tags: []
  },
  'Components/BubbleMenu': {
    videoUrl: '/assets/videos/bubblemenu.webm',
    description: 'Floating circular expanding menu with staggered item reveal.',
    category: 'Components',
    name: 'BubbleMenu',
    docsUrl: 'https://vue-bits.dev/components/bubble-menu',
    tags: []
  },
  'Components/CardNav': {
    videoUrl: '/assets/videos/cardnav.webm',
    description: 'Expandable navigation bar with card panels revealing nested links.',
    category: 'Components',
    name: 'CardNav',
    docsUrl: 'https://vue-bits.dev/components/card-nav',
    tags: []
  },
  'Components/CardSwap': {
    videoUrl: '/assets/videos/cardswap.webm',
    description: 'Cards animate position swapping with smooth layout transitions.',
    category: 'Components',
    name: 'CardSwap',
    docsUrl: 'https://vue-bits.dev/components/card-swap',
    tags: []
  },
  'Components/Carousel': {
    videoUrl: '/assets/videos/carousel.webm',
    description: 'Responsive carousel with touch gestures, looping and transitions.',
    category: 'Components',
    name: 'Carousel',
    docsUrl: 'https://vue-bits.dev/components/carousel',
    tags: []
  },
  'Components/ChromaGrid': {
    videoUrl: '/assets/videos/chromagrid.webm',
    description: 'A responsive grid of grayscale tiles. Hovering the grid reaveals their colors.',
    category: 'Components',
    name: 'ChromaGrid',
    docsUrl: 'https://vue-bits.dev/components/chroma-grid',
    tags: []
  },
  'Components/CircularGallery': {
    videoUrl: '/assets/videos/circulargallery.webm',
    description: 'Circular orbit gallery rotating images.',
    category: 'Components',
    name: 'CircularGallery',
    docsUrl: 'https://vue-bits.dev/components/circular-gallery',
    tags: []
  },
  'Components/Counter': {
    videoUrl: '/assets/videos/counter.webm',
    description: 'Flexible animated counter supporting increments + easing.',
    category: 'Components',
    name: 'Counter',
    docsUrl: 'https://vue-bits.dev/components/counter',
    tags: []
  },
  'Components/DecayCard': {
    videoUrl: '/assets/videos/decaycard.webm',
    description: 'Hover parallax effect that disintegrates the content of a card.',
    category: 'Components',
    name: 'DecayCard',
    docsUrl: 'https://vue-bits.dev/components/decay-card',
    tags: []
  },
  'Components/Dock': {
    videoUrl: '/assets/videos/dock.webm',
    description: 'macOS style magnifying dock with proximity scaling of icons.',
    category: 'Components',
    name: 'Dock',
    docsUrl: 'https://vue-bits.dev/components/dock',
    tags: []
  },
  'Components/DomeGallery': {
    videoUrl: '/assets/videos/domegallery.webm',
    description: 'Immersive 3D dome gallery projecting images on a hemispheric surface.',
    category: 'Components',
    name: 'DomeGallery',
    docsUrl: 'https://vue-bits.dev/components/dome-gallery',
    tags: []
  },
  'Components/ElasticSlider': {
    videoUrl: '/assets/videos/elasticslider.webm',
    description: 'Slider handle stretches elastically then snaps with spring physics.',
    category: 'Components',
    name: 'ElasticSlider',
    docsUrl: 'https://vue-bits.dev/components/elastic-slider',
    tags: []
  },
  'Components/FlowingMenu': {
    videoUrl: '/assets/videos/flowingmenu.webm',
    description: 'Liquid flowing active indicator glides between menu items.',
    category: 'Components',
    name: 'FlowingMenu',
    docsUrl: 'https://vue-bits.dev/components/flowing-menu',
    tags: []
  },
  'Components/FlyingPosters': {
    videoUrl: '/assets/videos/flyingposters.webm',
    description: '3D posters rotate on scroll infinitely.',
    category: 'Components',
    name: 'FlyingPosters',
    docsUrl: 'https://vue-bits.dev/components/flying-posters',
    tags: []
  },
  'Components/Folder': {
    videoUrl: '/assets/videos/folder.webm',
    description: 'Interactive folder opens to reveal nested content smooth motion.',
    category: 'Components',
    name: 'Folder',
    docsUrl: 'https://vue-bits.dev/components/folder',
    tags: []
  },
  'Components/GlassIcons': {
    videoUrl: '/assets/videos/glassicons.webm',
    description: 'Icon set styled with frosted glass blur.',
    category: 'Components',
    name: 'GlassIcons',
    docsUrl: 'https://vue-bits.dev/components/glass-icons',
    tags: []
  },
  'Components/GlassSurface': {
    videoUrl: '/assets/videos/glasssurface.webm',
    description: 'Advanced Apple-style glass surface with real-time distortion + lighting.',
    category: 'Components',
    name: 'GlassSurface',
    docsUrl: 'https://vue-bits.dev/components/glass-surface',
    tags: []
  },
  'Components/GooeyNav': {
    videoUrl: '/assets/videos/gooeynav.webm',
    description: 'Navigation indicator morphs with gooey blob transitions between items.',
    category: 'Components',
    name: 'GooeyNav',
    docsUrl: 'https://vue-bits.dev/components/gooey-nav',
    tags: []
  },
  'Components/InfiniteMenu': {
    videoUrl: '/assets/videos/infinitemenu.webm',
    description: 'Horizontally looping menu effect that scrolls endlessly with seamless wrap.',
    category: 'Components',
    name: 'InfiniteMenu',
    docsUrl: 'https://vue-bits.dev/components/infinite-menu',
    tags: []
  },
  'Components/InfiniteScroll': {
    videoUrl: '/assets/videos/infinitescroll.webm',
    description: 'Infinite scrolling container auto-loads content near viewport end.',
    category: 'Components',
    name: 'InfiniteScroll',
    docsUrl: 'https://vue-bits.dev/components/infinite-scroll',
    tags: []
  },
  'Components/MagicBento': {
    videoUrl: '/assets/videos/magicbento.webm',
    description: 'Interactive bento grid tiles expand + animate with various options.',
    category: 'Components',
    name: 'MagicBento',
    docsUrl: 'https://vue-bits.dev/components/magic-bento',
    tags: []
  },
  'Components/Masonry': {
    videoUrl: '/assets/videos/masonry.webm',
    description: 'Responsive masonry layout with animated reflow + gaps optimization.',
    category: 'Components',
    name: 'Masonry',
    docsUrl: 'https://vue-bits.dev/components/masonry',
    tags: []
  },
  'Components/PillNav': {
    videoUrl: '/assets/videos/pillnav.webm',
    description: 'Minimal pill nav with sliding active highlight + smooth easing.',
    category: 'Components',
    name: 'PillNav',
    docsUrl: 'https://vue-bits.dev/components/pill-nav',
    tags: []
  },
  'Components/PixelCard': {
    videoUrl: '/assets/videos/pixelcard.webm',
    description: 'Card content revealed through pixel expansion transition.',
    category: 'Components',
    name: 'PixelCard',
    docsUrl: 'https://vue-bits.dev/components/pixel-card',
    tags: []
  },
  'Components/ProfileCard': {
    videoUrl: '/assets/videos/profilecard.webm',
    description: 'Animated profile card glare with 3D hover effect.',
    category: 'Components',
    name: 'ProfileCard',
    docsUrl: 'https://vue-bits.dev/components/profile-card',
    tags: []
  },
  'Components/ScrollStack': {
    videoUrl: '/assets/videos/scrollstack.webm',
    description: 'Overlapping card stack reveals on scroll with depth layering.',
    category: 'Components',
    name: 'ScrollStack',
    docsUrl: 'https://vue-bits.dev/components/scroll-stack',
    tags: []
  },
  'Components/SpotlightCard': {
    videoUrl: '/assets/videos/spotlightcard.webm',
    description: 'Dynamic spotlight follows cursor casting gradient illumination.',
    category: 'Components',
    name: 'SpotlightCard',
    docsUrl: 'https://vue-bits.dev/components/spotlight-card',
    tags: []
  },
  'Components/Stack': {
    videoUrl: '/assets/videos/stack.webm',
    description: 'Layered stack with swipe animations and smooth transitions.',
    category: 'Components',
    name: 'Stack',
    docsUrl: 'https://vue-bits.dev/components/stack',
    tags: []
  },
  'Components/Stepper': {
    videoUrl: '/assets/videos/stepper.webm',
    description: 'Animated multi-step progress indicator with active state transitions.',
    category: 'Components',
    name: 'Stepper',
    docsUrl: 'https://vue-bits.dev/components/stepper',
    tags: []
  },
  'Components/TiltedCard': {
    videoUrl: '/assets/videos/tiltedcard.webm',
    description: '3D perspective tilt card reacting to pointer.',
    category: 'Components',
    name: 'TiltedCard',
    docsUrl: 'https://vue-bits.dev/components/tilted-card',
    tags: []
  },
  'Components/StaggeredMenu': {
    videoUrl: '/assets/videos/staggeredmenu.webm',
    description: 'Menu with staggered item animations and smooth transitions on open/close.',
    category: 'Components',
    name: 'StaggeredMenu',
    docsUrl: 'https://vue-bits.dev/components/staggered-menu',
    tags: []
  },

  //! Backgrounds -------------------------------------------------------------------------------------------------------------------------------
  'Backgrounds/Aurora': {
    videoUrl: '/assets/videos/aurora.webm',
    description: 'Flowing aurora gradient background.',
    category: 'Backgrounds',
    name: 'Aurora',
    docsUrl: 'https://vue-bits.dev/backgrounds/aurora',
    tags: []
  },
  'Backgrounds/Balatro': {
    videoUrl: '/assets/videos/balatro.webm',
    description: 'The balatro shader, fully customizalbe and interactive.',
    category: 'Backgrounds',
    name: 'Balatro',
    docsUrl: 'https://vue-bits.dev/backgrounds/balatro',
    tags: []
  },
  'Backgrounds/Ballpit': {
    videoUrl: '/assets/videos/ballpit.webm',
    description: 'Physics ball pit simulation with bouncing colorful spheres.',
    category: 'Backgrounds',
    name: 'Ballpit',
    docsUrl: 'https://vue-bits.dev/backgrounds/ballpit',
    tags: []
  },
  'Backgrounds/Beams': {
    videoUrl: '/assets/videos/beams.webm',
    description: 'Crossing animated ribbons with customizable properties.',
    category: 'Backgrounds',
    name: 'Beams',
    docsUrl: 'https://vue-bits.dev/backgrounds/beams',
    tags: []
  },
  'Backgrounds/ColorBends': {
    videoUrl: '/assets/videos/colorbends.webm',
    description: 'Vibrant color bends with smooth flowing animation.',
    category: 'Backgrounds',
    name: 'ColorBends',
    docsUrl: 'https://vue-bits.dev/backgrounds/color-bends',
    tags: []
  },
  'Backgrounds/DarkVeil': {
    videoUrl: '/assets/videos/darkveil.webm',
    description: 'Subtle dark background with a smooth animation and postprocessing.',
    category: 'Backgrounds',
    name: 'DarkVeil',
    docsUrl: 'https://vue-bits.dev/backgrounds/dark-veil',
    tags: []
  },
  'Backgrounds/Dither': {
    videoUrl: '/assets/videos/dither.webm',
    description: 'Retro dithered noise shader background.',
    category: 'Backgrounds',
    name: 'Dither',
    docsUrl: 'https://vue-bits.dev/backgrounds/dither',
    tags: []
  },
  'Backgrounds/DotGrid': {
    videoUrl: '/assets/videos/dotgrid.webm',
    description: 'Animated dot grid with cursor interactions.',
    category: 'Backgrounds',
    name: 'DotGrid',
    docsUrl: 'https://vue-bits.dev/backgrounds/dot-grid',
    tags: []
  },
  'Backgrounds/FaultyTerminal': {
    videoUrl: '/assets/videos/faultyterminal.webm',
    description: 'Terminal CRT scanline squares effect with flicker + noise.',
    category: 'Backgrounds',
    name: 'FaultyTerminal',
    docsUrl: 'https://vue-bits.dev/backgrounds/faulty-terminal',
    tags: []
  },
  'Backgrounds/FloatingLines': {
    videoUrl: '/assets/video/floatinglines.webm',
    description: '3D floating lines that react to cursor movement.',
    category: 'Backgrounds',
    name: 'FloatingLines',
    docsUrl: 'https://vue-bits.dev/backgrounds/floating-lines',
    tags: []
  },
  'Backgrounds/Galaxy': {
    videoUrl: '/assets/videos/galaxy.webm',
    description: 'Parallax realistic starfield with pointer interactions.',
    category: 'Backgrounds',
    name: 'Galaxy',
    docsUrl: 'https://vue-bits.dev/backgrounds/galaxy',
    tags: []
  },
  'Backgrounds/GradientBlinds': {
    videoUrl: '/assets/videos/gradientblinds.webm',
    description: 'Layered gradient blinds with spotlight and noise distortion.',
    category: 'Backgrounds',
    name: 'GradientBlinds',
    docsUrl: 'https://vue-bits.dev/backgrounds/gradient-blinds',
    tags: []
  },
  'Backgrounds/GridDistortion': {
    videoUrl: '/assets/videos/griddistortion.webm',
    description: 'Warped grid mesh distorts smoothly reacting to cursor.',
    category: 'Backgrounds',
    name: 'GridDistortion',
    docsUrl: 'https://vue-bits.dev/backgrounds/grid-distortion',
    tags: []
  },
  'Backgrounds/GridMotion': {
    videoUrl: '/assets/videos/gridmotion.webm',
    description: 'Perspective moving grid lines based on cusror position.',
    category: 'Backgrounds',
    name: 'GridMotion',
    docsUrl: 'https://vue-bits.dev/backgrounds/grid-motion',
    tags: []
  },
  'Backgrounds/Hyperspeed': {
    videoUrl: '/assets/videos/hyperspeed.webm',
    description: 'Animated lines continously moving to simulate hyperspace travel on click hold.',
    category: 'Backgrounds',
    name: 'Hyperspeed',
    docsUrl: 'https://vue-bits.dev/backgrounds/hyperspeed',
    tags: []
  },
  'Backgrounds/Iridescence': {
    videoUrl: '/assets/videos/iridescence.webm',
    description: 'Slick iridescent shader with shifting waves.',
    category: 'Backgrounds',
    name: 'Iridescence',
    docsUrl: 'https://vue-bits.dev/backgrounds/iridescence',
    tags: []
  },
  'Backgrounds/LetterGlitch': {
    videoUrl: '/assets/videos/letterglitch.webm',
    description: 'Matrix style letter animation.',
    category: 'Backgrounds',
    name: 'LetterGlitch',
    docsUrl: 'https://vue-bits.dev/backgrounds/letter-glitch',
    tags: []
  },
  'Backgrounds/LightRays': {
    videoUrl: '/assets/videos/lightrays.webm',
    description: 'Volumetric light rays/beams with customizable direction.',
    category: 'Backgrounds',
    name: 'LightRays',
    docsUrl: 'https://vue-bits.dev/backgrounds/light-rays',
    tags: []
  },
  'Backgrounds/Lightning': {
    videoUrl: '/assets/videos/lightning.webm',
    description: 'Procedural lightning bolts with branching and glow flicker.',
    category: 'Backgrounds',
    name: 'Lightning',
    docsUrl: 'https://vue-bits.dev/backgrounds/lightning',
    tags: []
  },
  'Backgrounds/LiquidChrome': {
    videoUrl: '/assets/videos/liquidchrome.webm',
    description: 'Liquid metallic chrome shader with flowing reflective surface.',
    category: 'Backgrounds',
    name: 'LiquidChrome',
    docsUrl: 'https://vue-bits.dev/backgrounds/liquid-chrome',
    tags: []
  },
  'Backgrounds/Orb': {
    videoUrl: '/assets/videos/orb.webm',
    description: 'Floating energy orb with customizable hover effect.',
    category: 'Backgrounds',
    name: 'Orb',
    docsUrl: 'https://vue-bits.dev/backgrounds/orb',
    tags: []
  },
  'Backgrounds/Particles': {
    videoUrl: '/assets/videos/particles.webm',
    description: 'Configurable particle system.',
    category: 'Backgrounds',
    name: 'Particles',
    docsUrl: 'https://vue-bits.dev/backgrounds/particles',
    tags: []
  },
  'Backgrounds/PixelBlast': {
    videoUrl: '/assets/videos/pixelblast.webm',
    description: 'Exploding pixel particle bursts with optional liquid postprocessing.',
    category: 'Backgrounds',
    name: 'PixelBlast',
    docsUrl: 'https://vue-bits.dev/backgrounds/pixel-blast',
    tags: []
  },
  'Backgrounds/Plasma': {
    videoUrl: '/assets/videos/plasma.webm',
    description: 'Organic plasma gradients swirl + morph with smooth turbulence.',
    category: 'Backgrounds',
    name: 'Plasma',
    docsUrl: 'https://vue-bits.dev/backgrounds/plasma',
    tags: []
  },
  'Backgrounds/Prism': {
    videoUrl: '/assets/videos/prism.webm',
    description: 'Rotating prism with configurable intensity, size, and colors.',
    category: 'Backgrounds',
    name: 'Prism',
    docsUrl: 'https://vue-bits.dev/backgrounds/prism',
    tags: []
  },
  'Backgrounds/PrismaticBurst': {
    videoUrl: '/assets/videos/prismaticburst.webm',
    description: 'Burst of light rays with controllable color, distortion, amount.',
    category: 'Backgrounds',
    name: 'PrismaticBurst',
    docsUrl: 'https://vue-bits.dev/backgrounds/prismatic-burst',
    tags: []
  },
  'Backgrounds/RippleGrid': {
    videoUrl: '/assets/videos/ripplegrid.webm',
    description: 'A grid that continously animates with a ripple effect.',
    category: 'Backgrounds',
    name: 'RippleGrid',
    docsUrl: 'https://vue-bits.dev/backgrounds/ripple-grid',
    tags: []
  },
  'Backgrounds/Silk': {
    videoUrl: '/assets/videos/silk.webm',
    description: 'Smooth waves background with soft lighting.',
    category: 'Backgrounds',
    name: 'Silk',
    docsUrl: 'https://vue-bits.dev/backgrounds/silk',
    tags: []
  },
  'Backgrounds/Squares': {
    videoUrl: '/assets/videos/squares.webm',
    description: 'Animated squares with scaling + direction customization.',
    category: 'Backgrounds',
    name: 'Squares',
    docsUrl: 'https://vue-bits.dev/backgrounds/squares',
    tags: []
  },
  'Backgrounds/Threads': {
    videoUrl: '/assets/videos/threads.webm',
    description: 'Animated pattern of lines forming a fabric-like motion.',
    category: 'Backgrounds',
    name: 'Threads',
    docsUrl: 'https://vue-bits.dev/backgrounds/threads',
    tags: []
  },
  'Backgrounds/Waves': {
    videoUrl: '/assets/videos/waves.webm',
    description: 'Layered lines that form smooth wave patterns with animation.',
    category: 'Backgrounds',
    name: 'Waves',
    docsUrl: 'https://vue-bits.dev/backgrounds/waves',
    tags: []
  },
  'Backgrounds/LiquidEther': {
    videoUrl: '/assets/videos/liquidether.webm',
    description: 'Interactive liquid shader with flowing distortion and customizable colors.',
    category: 'Backgrounds',
    name: 'LiquidEther',
    docsUrl: 'https://vue-bits.dev/backgrounds/liquid-ether',
    tags: []
  },
  'Backgrounds/LightPillar': {
    videoUrl: '/assets/videos/lightpillar.webm',
    description: 'Vertical pillar of light with glow effects.',
    category: 'Backgrounds',
    name: 'LightPillar',
    docsUrl: 'https://vue-bits.dev/backgrounds/light-pillar',
    tags: []
  },
  'Backgrounds/PixelSnow': {
    videoUrl: '/assets/videos/pixelsnow.webm',
    description: 'Falling pixelated snow effect with customizable density and speed.',
    category: 'Backgrounds',
    name: 'PixelSnow',
    docsUrl: 'https://vue-bits.dev/backgrounds/pixel-snow',
    tags: []
  }
};
