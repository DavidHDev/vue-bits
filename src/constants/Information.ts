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
      'Wrapper that animates any children on scroll or mount with configurable direction, distance, duration, easing and disappear options.',
    category: 'Animations',
    name: 'AnimatedContent',
    docsUrl: 'https://vue-bits.dev/animations/animated-content',
    tags: []
  },
  'Animations/Antigravity': {
    videoUrl: '/assets/videos/antigravity.webm',
    description: '3D antigravity particle field that repels from the cursor with smooth motion.',
    category: 'Animations',
    name: 'Antigravity',
    docsUrl: 'https://vue-bits.dev/animations/antigravity',
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
  'Animations/CursorGrid': {
    videoUrl: '/assets/videos/cursorgrid.webm',
    description:
      'Canvas grid whose cells light up around the cursor with configurable radius, falloff and click pulses.',
    category: 'Animations',
    name: 'CursorGrid',
    docsUrl: 'https://vue-bits.dev/animations/cursor-grid',
    tags: []
  },
  'Animations/ElasticMesh': {
    videoUrl: '/assets/videos/elasticmesh.webm',
    description: 'Spring-mesh surface that stretches under the pointer and settles back with damped physics.',
    category: 'Animations',
    name: 'ElasticMesh',
    docsUrl: 'https://vue-bits.dev/animations/elastic-mesh',
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
    description: 'Simple directional fade / slide entrance / exit wrapper with threshold-based activation.',
    category: 'Animations',
    name: 'FadeContent',
    docsUrl: 'https://vue-bits.dev/animations/fade-content',
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
  'Animations/GlareHover': {
    videoUrl: '/assets/videos/glarehover.webm',
    description: 'Adds a realistic moving glare highlight on hover over any element.',
    category: 'Animations',
    name: 'GlareHover',
    docsUrl: 'https://vue-bits.dev/animations/glare-hover',
    tags: []
  },
  'Animations/GlowCursor': {
    videoUrl: '/assets/videos/glowcursor.webm',
    description:
      'Shader-powered light trail that smoothly follows the pointer with customizable glow, color, taper and pulse.',
    category: 'Animations',
    name: 'GlowCursor',
    docsUrl: 'https://vue-bits.dev/animations/glow-cursor',
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
  'Animations/HalftoneReveal': {
    videoUrl: '/assets/videos/halftonereveal.webm',
    description: 'Print-style halftone dot matrix that resolves into sharp content around the cursor.',
    category: 'Animations',
    name: 'HalftoneReveal',
    docsUrl: 'https://vue-bits.dev/animations/halftone-reveal',
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
  'Animations/LaserFlow': {
    videoUrl: '/assets/videos/laserflow.webm',
    description: 'Dynamic laser light that flows onto a surface, customizable effect.',
    category: 'Animations',
    name: 'LaserFlow',
    docsUrl: 'https://vue-bits.dev/animations/laser-flow',
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
  'Animations/MagicRings': {
    videoUrl: '/assets/videos/magicrings.webm',
    description: 'Interactive magic rings effect with customizable parameters.',
    category: 'Animations',
    name: 'MagicRings',
    docsUrl: 'https://vue-bits.dev/animations/magic-rings',
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
  'Animations/OrbitImages': {
    videoUrl: '/assets/videos/orbitimages.webm',
    description: 'SVG Path customizable orbiting images effect',
    category: 'Animations',
    name: 'OrbitImages',
    docsUrl: 'https://vue-bits.dev/animations/orbit-images',
    tags: []
  },
  'Animations/PixelSwap': {
    videoUrl: '/assets/videos/pixelswap.webm',
    description:
      'Pixel fragments assemble into a full cover, swap arbitrary content, then dissolve away with reversible colors and triggers.',
    category: 'Animations',
    name: 'PixelSwap',
    docsUrl: 'https://vue-bits.dev/animations/pixel-swap',
    tags: []
  },
  'Animations/PixelTrail': {
    videoUrl: '/assets/videos/pixeltrail.webm',
    description: 'Pixelated cursor trail emitting fading squares with retro digital feel.',
    category: 'Animations',
    name: 'PixelTrail',
    docsUrl: 'https://vue-bits.dev/animations/pixel-trail',
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
  'Animations/RippleDistortion': {
    videoUrl: '/assets/videos/rippledistortion.webm',
    description: 'Pointer-driven water displacement that warps content and leaves a decaying wake.',
    category: 'Animations',
    name: 'RippleDistortion',
    docsUrl: 'https://vue-bits.dev/animations/ripple-distortion',
    tags: []
  },
  'Animations/ScrollExpand': {
    videoUrl: '/assets/videos/scrollexpand.webm',
    description: 'A rounded media frame that grows to full bleed as it scrolls through the viewport.',
    category: 'Animations',
    name: 'ScrollExpand',
    docsUrl: 'https://vue-bits.dev/animations/scroll-expand',
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
  'Animations/Strands': {
    videoUrl: '/assets/videos/strands.webm',
    description: 'Glowing ribbon-like strands that ripple and weave across a transparent canvas.',
    category: 'Animations',
    name: 'Strands',
    docsUrl: 'https://vue-bits.dev/animations/strands',
    tags: []
  },
  'Animations/SwarmCursor': {
    videoUrl: '/assets/videos/swarmcursor.webm',
    description: 'Flocking particle swarm that chases the pointer, jostles for space and drifts apart at rest.',
    category: 'Animations',
    name: 'SwarmCursor',
    docsUrl: 'https://vue-bits.dev/animations/swarm-cursor',
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

  //! Text Animations -------------------------------------------------------------------------------------------------------------------------------
  'TextAnimations/AsciiText': {
    videoUrl: '/assets/videos/asciitext.webm',
    description: 'Renders text with an animated ASCII background for a retro feel.',
    category: 'TextAnimations',
    name: 'ASCIIText',
    docsUrl: 'https://vue-bits.dev/text-animations/ascii-text',
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
  'TextAnimations/CountUp': {
    videoUrl: '/assets/videos/countup.webm',
    description: 'Animated number counter supporting formatting and decimals.',
    category: 'TextAnimations',
    name: 'CountUp',
    docsUrl: 'https://vue-bits.dev/text-animations/count-up',
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
  'TextAnimations/DepthText': {
    videoUrl: '/assets/videos/depthtext.webm',
    description: 'Layered extruded type with parallax that shifts against the pointer.',
    category: 'TextAnimations',
    name: 'DepthText',
    docsUrl: 'https://vue-bits.dev/text-animations/depth-text',
    tags: []
  },
  'TextAnimations/EchoText': {
    videoUrl: '/assets/videos/echotext.webm',
    description: 'Ghosted copies trail behind the text and settle into a single word.',
    category: 'TextAnimations',
    name: 'EchoText',
    docsUrl: 'https://vue-bits.dev/text-animations/echo-text',
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
  'TextAnimations/FoldText': {
    videoUrl: '/assets/videos/foldtext.webm',
    description: 'Lines unfold into place like creased paper opening flat.',
    category: 'TextAnimations',
    name: 'FoldText',
    docsUrl: 'https://vue-bits.dev/text-animations/fold-text',
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
  'TextAnimations/MaskedHeading': {
    videoUrl: '/assets/videos/maskedheading.webm',
    description:
      'A large headline with a drifting colour mesh or image showing through the glyphs, revealed word by word.',
    category: 'TextAnimations',
    name: 'MaskedHeading',
    docsUrl: 'https://vue-bits.dev/text-animations/masked-heading',
    tags: []
  },
  'TextAnimations/ParticleText': {
    videoUrl: '/assets/videos/particletext.webm',
    description: 'Text assembles from drifting particles that scatter and reform on demand.',
    category: 'TextAnimations',
    name: 'ParticleText',
    docsUrl: 'https://vue-bits.dev/text-animations/particle-text',
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
  'TextAnimations/Shuffle': {
    videoUrl: '/assets/videos/shuffle.webm',
    description: 'Animated text reveal where characters shuffle before settling.',
    category: 'TextAnimations',
    name: 'Shuffle',
    docsUrl: 'https://vue-bits.dev/text-animations/shuffle',
    tags: []
  },
  'TextAnimations/SplitFlapText': {
    videoUrl: '/assets/videos/splitflaptext.webm',
    description: 'Mechanical split-flap departure board that clacks through to each new phrase.',
    category: 'TextAnimations',
    name: 'SplitFlapText',
    docsUrl: 'https://vue-bits.dev/text-animations/split-flap-text',
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
  'TextAnimations/StrokeText': {
    videoUrl: '/assets/videos/stroketext.webm',
    description: 'Outlined letterforms draw themselves on, then flood with fill.',
    category: 'TextAnimations',
    name: 'StrokeText',
    docsUrl: 'https://vue-bits.dev/text-animations/stroke-text',
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
  'TextAnimations/TextLoop': {
    videoUrl: '/assets/videos/textloop.webm',
    description: 'A seamless text marquee that flows along curved SVG paths.',
    category: 'TextAnimations',
    name: 'TextLoop',
    docsUrl: 'https://vue-bits.dev/text-animations/text-loop',
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
  'TextAnimations/WarpText': {
    videoUrl: '/assets/videos/warptext.webm',
    description: 'WebGL warp that bends and refracts the text around the pointer.',
    category: 'TextAnimations',
    name: 'WarpText',
    docsUrl: 'https://vue-bits.dev/text-animations/warp-text',
    tags: []
  },

  //! Components -------------------------------------------------------------------------------------------------------------------------------
  'Components/AccordionGallery': {
    videoUrl: '/assets/videos/accordiongallery.webm',
    description: 'Panels expand on hover or focus, revealing parallax imagery and captions.',
    category: 'Components',
    name: 'AccordionGallery',
    docsUrl: 'https://vue-bits.dev/components/accordion-gallery',
    tags: []
  },
  'Components/AnimatedList': {
    videoUrl: '/assets/videos/animatedlist.webm',
    description: 'List items enter with staggered motion variants for polished reveals.',
    category: 'Components',
    name: 'AnimatedList',
    docsUrl: 'https://vue-bits.dev/components/animated-list',
    tags: []
  },
  'Components/BorderGlow': {
    videoUrl: '/assets/videos/borderglow.webm',
    description: 'Glowing mesh-gradient border that follows cursor direction and intensifies near edges.',
    category: 'Components',
    name: 'BorderGlow',
    docsUrl: 'https://vue-bits.dev/components/border-glow',
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
  'Components/CurvedInput': {
    videoUrl: '/assets/videos/curvedinput.webm',
    description: 'Arc-bent input bar with text, caret and submit button all following the curve.',
    category: 'Components',
    name: 'CurvedInput',
    docsUrl: 'https://vue-bits.dev/components/curved-input',
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
  'Components/DepthCarousel': {
    videoUrl: '/assets/videos/depthcarousel.webm',
    description: 'Cards recede into depth on a 3D rail, with drag, keyboard and auto-advance.',
    category: 'Components',
    name: 'DepthCarousel',
    docsUrl: 'https://vue-bits.dev/components/depth-carousel',
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
  'Components/DriftWall': {
    videoUrl: '/assets/videos/driftwall.webm',
    description: 'An endless perspective wall of tiles drifting past, lifting on hover.',
    category: 'Components',
    name: 'DriftWall',
    docsUrl: 'https://vue-bits.dev/components/drift-wall',
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
  'Components/InfiniteSpiral': {
    videoUrl: '/assets/videos/infinitespiral.webm',
    description: 'An endlessly looping 3D helix of images with customizable motion, depth, spacing and interaction.',
    category: 'Components',
    name: 'InfiniteSpiral',
    docsUrl: 'https://vue-bits.dev/components/infinite-spiral',
    tags: []
  },
  'Components/LineSidebar': {
    videoUrl: '/assets/videos/linesidebar.webm',
    description: 'Static list navigation with a cursor-proximity effect that shifts and highlights nearby items.',
    category: 'Components',
    name: 'LineSidebar',
    docsUrl: 'https://vue-bits.dev/components/line-sidebar',
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
  'Components/ModelViewer': {
    videoUrl: '/assets/videos/modelviewer.webm',
    name: 'ModelViewer',
    description: 'Interactive 3D model viewer with orbit zoom, parallax, hover rotation and lighting presets.',
    category: 'Components',
    docsUrl: 'https://vue-bits.dev/components/model-viewer',
    tags: []
  },
  'Components/MorphSlider': {
    videoUrl: '/assets/videos/morphslider.webm',
    description: 'WebGL slider that melts between images with a displacement transition.',
    category: 'Components',
    name: 'MorphSlider',
    docsUrl: 'https://vue-bits.dev/components/morph-slider',
    tags: []
  },
  'Components/OptionWheel': {
    videoUrl: '/assets/videos/optionwheel.webm',
    description:
      'Curved option picker that spins via scroll, drag, or arrow keys, fading and tilting items away from the selection.',
    category: 'Components',
    name: 'OptionWheel',
    docsUrl: 'https://vue-bits.dev/components/option-wheel',
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
  'Components/ReflectiveCard': {
    videoUrl: '/assets/videos/reflectivecard.webm',
    description: 'Metallic card with live webcam reflection and SVG displacement filter.',
    category: 'Components',
    name: 'ReflectiveCard',
    docsUrl: 'https://vue-bits.dev/components/reflective-card',
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
  'Components/SpecularButton': {
    videoUrl: '/assets/videos/specularbutton.webm',
    description:
      'Glass button with a shader-driven specular rim light that sweeps around the edge and follows the cursor.',
    category: 'Components',
    name: 'SpecularButton',
    docsUrl: 'https://vue-bits.dev/components/specular-button',
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
    description: 'Layered stack with swipe animations, autoplay and smooth transitions.',
    category: 'Components',
    name: 'Stack',
    docsUrl: 'https://vue-bits.dev/components/stack',
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

  //! Backgrounds -------------------------------------------------------------------------------------------------------------------------------
  'Backgrounds/AcidSquares': {
    videoUrl: '/assets/videos/acidsquares.webm',
    description: 'A crystalline corridor of stacked squares receding into depth.',
    category: 'Backgrounds',
    name: 'AcidSquares',
    docsUrl: 'https://vue-bits.dev/backgrounds/acid-squares',
    tags: []
  },
  'Backgrounds/AeroShards': {
    videoUrl: '/assets/videos/aeroshards.webm',
    description:
      'A GPU-driven wind sculpture of folded foil shards with crisp detail, content-safe placements, and responsive pointer interactions.',
    category: 'Backgrounds',
    name: 'AeroShards',
    docsUrl: 'https://vue-bits.dev/backgrounds/aero-shards',
    tags: ['webgpu', 'vgpu', 'particles', 'procedural', 'post-processing', 'interactive']
  },
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
  'Backgrounds/CRTWarp': {
    videoUrl: '/assets/videos/crtwarp.webm',
    description: 'Full-canvas CRT plasma with curved distortion, scanlines, bloom and pointer interaction.',
    category: 'Backgrounds',
    name: 'CRTWarp',
    docsUrl: 'https://vue-bits.dev/backgrounds/crt-warp',
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
  'Backgrounds/DotField': {
    videoUrl: '/assets/videos/dotfield.webm',
    description: 'Interactive dot grid with cursor bulge, glow, sparkle, and wave effects.',
    category: 'Backgrounds',
    name: 'DotField',
    docsUrl: 'https://vue-bits.dev/backgrounds/dot-field',
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
  'Backgrounds/EvilEye': {
    videoUrl: '/assets/videos/evileye.webm',
    description: 'Procedural evil eye shader with animated iris, slit pupil, and fiery outer glow.',
    category: 'Backgrounds',
    name: 'EvilEye',
    docsUrl: 'https://vue-bits.dev/backgrounds/evil-eye',
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
  'Backgrounds/Ferrofluid': {
    videoUrl: '/assets/videos/ferrofluid.webm',
    description: 'A churning magnetic fluid traced by glowing contour lines, with a cursor magnet.',
    category: 'Backgrounds',
    name: 'Ferrofluid',
    docsUrl: 'https://vue-bits.dev/backgrounds/ferrofluid',
    tags: []
  },
  'Backgrounds/FloatingLines': {
    videoUrl: '/assets/videos/floatinglines.webm',
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
  'Backgrounds/GhostFibers': {
    videoUrl: '/assets/videos/ghostfibers.webm',
    description: 'A deep-blue recursive fiber field with luminous bands, radial twisting and soft atmospheric glow.',
    category: 'Backgrounds',
    name: 'GhostFibers',
    docsUrl: 'https://vue-bits.dev/backgrounds/ghost-fibers',
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
  'Backgrounds/GradientWaves': {
    videoUrl: '/assets/videos/gradientwaves.webm',
    description: 'Raymarched sine waves rolling toward a soft, hazy horizon.',
    category: 'Backgrounds',
    name: 'GradientWaves',
    docsUrl: 'https://vue-bits.dev/backgrounds/gradient-waves',
    tags: []
  },
  'Backgrounds/Grainient': {
    videoUrl: '/assets/videos/grainient.webm',
    description: 'Grainy gradient swirls with soft wave distortion.',
    category: 'Backgrounds',
    name: 'Grainient',
    docsUrl: 'https://vue-bits.dev/backgrounds/grainient',
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
  'Backgrounds/GridScan': {
    videoUrl: '/assets/videos/gridscan.webm',
    description: 'Animated grid room 3D scan effect and cool interactions.',
    category: 'Backgrounds',
    name: 'GridScan',
    docsUrl: 'https://vue-bits.dev/backgrounds/grid-scan',
    tags: []
  },
  'Backgrounds/Hyperspeed': {
    videoUrl: '/assets/videos/hyperspeed.webm',
    description: 'Animated lines continuously moving to simulate hyperspace travel on click hold.',
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
  'Backgrounds/Lightfall': {
    videoUrl: '/assets/videos/lightfall.webm',
    description: 'Colorful light streaks raining down a glowing tunnel with a cursor light.',
    category: 'Backgrounds',
    name: 'Lightfall',
    docsUrl: 'https://vue-bits.dev/backgrounds/lightfall',
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
  'Backgrounds/LightPillar': {
    videoUrl: '/assets/videos/lightpillar.webm',
    description: 'Vertical pillar of light with glow effects.',
    category: 'Backgrounds',
    name: 'LightPillar',
    docsUrl: 'https://vue-bits.dev/backgrounds/light-pillar',
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
  'Backgrounds/LightTunnel': {
    videoUrl: '/assets/videos/lighttunnel.webm',
    description: 'A radial fibre-optic tunnel with light pulses racing into depth.',
    category: 'Backgrounds',
    name: 'LightTunnel',
    docsUrl: 'https://vue-bits.dev/backgrounds/light-tunnel',
    tags: []
  },
  'Backgrounds/LineWaves': {
    videoUrl: '/assets/videos/linewaves.webm',
    description: 'Animated line wave pattern with colorful warped distortion.',
    category: 'Backgrounds',
    name: 'LineWaves',
    docsUrl: 'https://vue-bits.dev/backgrounds/line-waves',
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
  'Backgrounds/LiquidEther': {
    videoUrl: '/assets/videos/liquidether.webm',
    description: 'Interactive liquid shader with flowing distortion and customizable colors.',
    category: 'Backgrounds',
    name: 'LiquidEther',
    docsUrl: 'https://vue-bits.dev/backgrounds/liquid-ether',
    tags: []
  },
  'Backgrounds/MoltenMetal': {
    videoUrl: '/assets/videos/moltenmetal.webm',
    description: 'Swirling caustic plasma filaments with molten, white-hot cores.',
    category: 'Backgrounds',
    name: 'MoltenMetal',
    docsUrl: 'https://vue-bits.dev/backgrounds/molten-metal',
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
  'Backgrounds/PlasmaWave': {
    videoUrl: '/assets/videos/plasmawave.webm',
    description: 'Raymarched plasma waves with dual-wave interference and OGL.',
    category: 'Backgrounds',
    name: 'PlasmaWave',
    docsUrl: 'https://vue-bits.dev/backgrounds/plasma-wave',
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
  'Backgrounds/Radar': {
    videoUrl: '/assets/videos/radar.webm',
    description: 'Radar sweep effect with concentric rings, radial spokes, and a rotating beam.',
    category: 'Backgrounds',
    name: 'Radar',
    docsUrl: 'https://vue-bits.dev/backgrounds/radar',
    tags: []
  },
  'Backgrounds/RippleGrid': {
    videoUrl: '/assets/videos/ripplegrid.webm',
    description: 'A grid that continuously animates with a ripple effect.',
    category: 'Backgrounds',
    name: 'RippleGrid',
    docsUrl: 'https://vue-bits.dev/backgrounds/ripple-grid',
    tags: []
  },
  'Backgrounds/ShapeGrid': {
    videoUrl: '/assets/videos/squares.webm',
    description: 'Animated grid with shape variants (square, hexagon, circle, triangle) + direction customization.',
    category: 'Backgrounds',
    name: 'ShapeGrid',
    docsUrl: 'https://vue-bits.dev/backgrounds/shape-grid',
    tags: []
  },
  'Backgrounds/ShapeWaves': {
    videoUrl: '/assets/videos/shapewaves.webm',
    description:
      'A WebGPU field of triangles, circles and squares that brighten and grow along rolling waves, with an optional text cutout the waves flow around.',
    category: 'Backgrounds',
    name: 'ShapeWaves',
    docsUrl: 'https://vue-bits.dev/backgrounds/shape-waves',
    tags: ['webgpu', 'vgpu', 'grid', 'shapes', 'text', 'procedural']
  },
  'Backgrounds/SideRays': {
    videoUrl: '/assets/videos/siderays.webm',
    description: 'Animated light rays emanating from the side with customizable colors and speed.',
    category: 'Backgrounds',
    name: 'SideRays',
    docsUrl: 'https://vue-bits.dev/backgrounds/side-rays',
    tags: []
  },
  'Backgrounds/Topography': {
    videoUrl: '/assets/videos/topography.webm',
    description: 'A living contour map with glowing, elevation-tinted lines.',
    category: 'Backgrounds',
    name: 'Topography',
    docsUrl: 'https://vue-bits.dev/backgrounds/topography',
    tags: []
  },
  'Backgrounds/WebThreads': {
    videoUrl: '/assets/videos/webthreads.webm',
    description: 'Glowing sine threads woven through a luminous convergence point.',
    category: 'Backgrounds',
    name: 'WebThreads',
    docsUrl: 'https://vue-bits.dev/backgrounds/web-threads',
    tags: []
  },

  //! Micro ------------------------------------------------------------------------------------------------------------------------------------
  'Micro/BellToggle': {
    videoUrl: '/assets/videos/belltoggle.webm',
    description:
      'Pill toggle that answers a press at three tempos: the bell rings on damped keyframes, the label blur-crossfades, and the pill unfurls to the longer label through a clip-path on a critically damped spring. The pressed state is the receipt.',
    category: 'Micro',
    name: 'BellToggle',
    docsUrl: 'https://vue-bits.dev/micro/bell-toggle',
    tags: ['toggle', 'button', 'bell', 'notify', 'press', 'spring']
  },
  'Micro/BranchedMenu': {
    videoUrl: '/assets/videos/branchedmenu.webm',
    description:
      'Collapsible menu whose sections unfold into a trunk with a curved branch to each child, and an accent line that travels down the trunk and around the curve to whatever you pick, while a marker glides to the open section.',
    category: 'Micro',
    name: 'BranchedMenu',
    docsUrl: 'https://vue-bits.dev/micro/branched-menu',
    tags: ['menu', 'navigation', 'sidebar', 'tree', 'collapsible', 'line', 'active']
  },
  'Micro/CallChip': {
    videoUrl: '/assets/videos/callchip.webm',
    description:
      'Inline tool-call chip whose fill wipes across while a live ms counter ticks, completing with a green wash on success or stopping short and shaking red with a retry glyph on error.',
    category: 'Micro',
    name: 'CallChip',
    docsUrl: 'https://vue-bits.dev/micro/call-chip',
    tags: ['chip', 'status', 'ai', 'agent', 'tool-call', 'progress', 'timer']
  },
  'Micro/CodeSlots': {
    videoUrl: '/assets/videos/codeslots.webm',
    description:
      'One-time-code input where a hidden overlay input owns focus, paste and SMS autofill while each slot lands its digit on one spring: the fill swells from the centre, the digit rises and the caret glides; a wrong code drains the slots in a cascade, a right one merges them into a single accent wash.',
    category: 'Micro',
    name: 'CodeSlots',
    docsUrl: 'https://vue-bits.dev/micro/code-slots',
    tags: ['input', 'otp', 'form', 'spring', 'code']
  },
  'Micro/CometDial': {
    videoUrl: '/assets/videos/cometdial.webm',
    description:
      'Tick-ring dial you flick by angle: the reading launches on a spring and a velocity-driven comet streaks behind the lit head, trailing the direction of travel and vanishing at rest.',
    category: 'Micro',
    name: 'CometDial',
    docsUrl: 'https://vue-bits.dev/micro/comet-dial',
    tags: ['dial', 'knob', 'gauge', 'drag', 'spring', 'input']
  },
  'Micro/DodgeField': {
    videoUrl: '/assets/videos/dodgefield.webm',
    description:
      'Wrapper that makes any child flee the pointer inside a bounded field, dodges once per approach, then relents after a few tries and glides home.',
    category: 'Micro',
    name: 'DodgeField',
    docsUrl: 'https://vue-bits.dev/micro/dodge-field',
    tags: ['hover', 'pointer', 'playful', 'wrapper', 'button', 'magnet']
  },
  'Micro/FlipCard': {
    videoUrl: '/assets/videos/flipcard.webm',
    description:
      'Two-faced card that flips in 3D on a click, a drag or a flick, settling on a spring that carries your release velocity, with an optional cursor tilt, a sheen that follows the pointer and a shadow that narrows as it turns edge on.',
    category: 'Micro',
    name: 'FlipCard',
    docsUrl: 'https://vue-bits.dev/micro/flip-card',
    tags: ['card', 'flip', '3d', 'tilt', 'drag', 'spring', 'hover', 'two-sided']
  },
  'Micro/FolderFloat': {
    videoUrl: '/assets/videos/folderfloat.webm',
    description:
      'Folder that opens on hover or press: the flap tilts toward you, a paper edge rises, and its notes spring out from behind the flap into a floating cloud to pick from, then sink back when the folder closes.',
    category: 'Micro',
    name: 'FolderFloat',
    docsUrl: 'https://vue-bits.dev/micro/folder-float',
    tags: ['folder', 'menu', 'hover', 'select', 'float', 'spring', 'files']
  },
  'Micro/FuseButton': {
    videoUrl: '/assets/videos/fusebutton.webm',
    description:
      'Action button whose done state carries its own undo on a burning fuse: press, the label crossfades to Undo, a hairline burns for the undo window, and Undo or Escape runs it back.',
    category: 'Micro',
    name: 'FuseButton',
    docsUrl: 'https://vue-bits.dev/micro/fuse-button',
    tags: ['button', 'undo', 'confirm', 'timer', 'press', 'fuse']
  },
  'Micro/GlideSelect': {
    videoUrl: '/assets/videos/glideselect.webm',
    description:
      'Select chip whose menu pops out of its own corner and whose single hover highlight glides between rows, remembering where you left it so re-entry slides from there instead of blinking in.',
    category: 'Micro',
    name: 'GlideSelect',
    docsUrl: 'https://vue-bits.dev/micro/glide-select',
    tags: ['select', 'dropdown', 'menu', 'popover', 'hover', 'form', 'keyboard']
  },
  'Micro/HoldButton': {
    videoUrl: '/assets/videos/holdbutton.webm',
    description:
      'Hold-to-confirm button whose liquid fill rises while pressed, snaps back on an early release and swaps its label through a blur when the hold completes.',
    category: 'Micro',
    name: 'HoldButton',
    docsUrl: 'https://vue-bits.dev/micro/hold-button',
    tags: ['button', 'confirm', 'hold', 'press', 'destructive']
  },
  'Micro/JellyRadio': {
    videoUrl: '/assets/videos/jellyradio.webm',
    description:
      'Radio group of labelled chips where the chosen one swells wide-then-tall on two springs and barges its neighbours outward with a travelling stagger, so a selection reads as a force moving through the row.',
    category: 'Micro',
    name: 'JellyRadio',
    docsUrl: 'https://vue-bits.dev/micro/jelly-radio',
    tags: ['radio', 'select', 'chips', 'spring', 'form', 'segmented']
  },
  'Micro/LatticeLoader': {
    videoUrl: '/assets/videos/latticeloader.webm',
    description:
      'Inline agent-status row: a 3x3 or 4x4 lattice whose cells brighten in a phase-offset wave beside a verb and a live stopwatch, resolving into a check or a cross when the task ends.',
    category: 'Micro',
    name: 'LatticeLoader',
    docsUrl: 'https://vue-bits.dev/micro/lattice-loader',
    tags: ['loader', 'status', 'ai', 'agent', 'timer', 'grid']
  },
  'Micro/PeekRating': {
    videoUrl: '/assets/videos/peekrating.webm',
    description:
      'Star rating you can try before you commit: sweeping the row lifts a trailing wave of stars up to the pointer while a tip hops along with the label; a click commits with a pop.',
    category: 'Micro',
    name: 'PeekRating',
    docsUrl: 'https://vue-bits.dev/micro/peek-rating',
    tags: ['rating', 'stars', 'hover', 'preview', 'feedback', 'form']
  },
  'Micro/PromptBar': {
    videoUrl: '/assets/videos/promptbar.webm',
    description:
      'Chat composer with an @ sources menu, a / commands menu, a model picker, dictation and attachments, whose send tile charges to ink the moment there is something to send and morphs its arrow into a stop square while busy.',
    category: 'Micro',
    name: 'PromptBar',
    docsUrl: 'https://vue-bits.dev/micro/prompt-bar',
    tags: ['composer', 'prompt', 'chat', 'ai', 'input', 'send', 'stop', 'menu', 'mention', 'command']
  },
  'Micro/PulseHeart': {
    videoUrl: '/assets/videos/pulseheart.webm',
    description:
      'Like button that contracts to a dot, flips colour at its smallest frame and pulses back while the count swaps one glyph.',
    category: 'Micro',
    name: 'PulseHeart',
    docsUrl: 'https://vue-bits.dev/micro/pulse-heart',
    tags: ['like', 'heart', 'button', 'reaction', 'counter', 'press']
  },
  'Micro/RefineFrame': {
    videoUrl: '/assets/videos/refineframe.webm',
    description:
      'Reserved-aspect frame that walks any media through queued, generating, refining and complete without layout shift: each stage is one blur, saturate, scale and opacity tween, a soft band sweeps while it works, a chip reports the stage, and an error dims the picture behind a retry pill.',
    category: 'Micro',
    name: 'RefineFrame',
    docsUrl: 'https://vue-bits.dev/micro/refine-frame',
    tags: ['ai', 'image', 'generation', 'loading', 'progressive', 'media', 'status']
  },
  'Micro/RubberSegment': {
    videoUrl: '/assets/videos/rubbersegment.webm',
    description:
      'Segmented control with a rubber thumb: taps stretch it across the gap and squash it onto the target, and you can grab, drag and flick it between slots.',
    category: 'Micro',
    name: 'RubberSegment',
    docsUrl: 'https://vue-bits.dev/micro/rubber-segment',
    tags: ['segmented', 'tabs', 'drag', 'spring', 'clip-path', 'radio']
  },
  'Micro/ScrubField': {
    videoUrl: '/assets/videos/scrubfield.webm',
    description:
      'Number chip you drag to scrub: the value follows the hand, pushes past the range on a rubber band, and a click without moving opens it for typing.',
    category: 'Micro',
    name: 'ScrubField',
    docsUrl: 'https://vue-bits.dev/micro/scrub-field',
    tags: ['input', 'number', 'drag', 'scrub', 'form', 'inspector']
  },
  'Micro/SlideCommit': {
    videoUrl: '/assets/videos/slidecommit.webm',
    description:
      'Slide-to-confirm handle that plants with a spinner while your action runs, unfurls into a done pill on success and springs home with a squash and shake on failure.',
    category: 'Micro',
    name: 'SlideCommit',
    docsUrl: 'https://vue-bits.dev/micro/slide-commit',
    tags: ['slide', 'confirm', 'async', 'gesture', 'drag', 'button']
  },
  'Micro/SlingButton': {
    videoUrl: '/assets/videos/slingbutton.webm',
    description:
      "Send button you pull back like a slingshot: the band stretches, a power arc arms it, and releasing fires the action with the flick's velocity.",
    category: 'Micro',
    name: 'SlingButton',
    docsUrl: 'https://vue-bits.dev/micro/sling-button',
    tags: ['button', 'send', 'slingshot', 'drag', 'gesture', 'spring']
  },
  'Micro/SloshGauge': {
    videoUrl: '/assets/videos/sloshgauge.webm',
    description:
      'Tank gauge whose liquid chases the value with mass, tilts with its own speed and splashes against the top when it slams full; optionally a vertical slider.',
    category: 'Micro',
    name: 'SloshGauge',
    docsUrl: 'https://vue-bits.dev/micro/slosh-gauge',
    tags: ['gauge', 'meter', 'progress', 'liquid', 'spring', 'physics', 'slider']
  },
  'Micro/SpringCheck': {
    videoUrl: '/assets/videos/springcheck.webm',
    description:
      'Checkbox row where a single spring fills the box, draws the tick, strikes the label and dims the words in one press.',
    category: 'Micro',
    name: 'SpringCheck',
    docsUrl: 'https://vue-bits.dev/micro/spring-check',
    tags: ['checkbox', 'toggle', 'form', 'spring', 'press', 'strikethrough']
  },
  'Micro/SquishSwitch': {
    videoUrl: '/assets/videos/squishswitch.webm',
    description:
      'Drag-scrubbable switch whose thumb stretches by how fast it moves, flips at the midpoint and squashes against the track end on a flick.',
    category: 'Micro',
    name: 'SquishSwitch',
    docsUrl: 'https://vue-bits.dev/micro/squish-switch',
    tags: ['switch', 'toggle', 'spring', 'drag', 'gesture', 'form']
  },
  'Micro/StatusMark': {
    videoUrl: '/assets/videos/statusmark.webm',
    description:
      'A 20px status glyph for agent task lists that morphs in place from a dashed idle ring to a spinning or real-progress arc, then draws a check or a cross, with an optional label strike.',
    category: 'Micro',
    name: 'StatusMark',
    docsUrl: 'https://vue-bits.dev/micro/status-mark',
    tags: ['status', 'progress', 'spinner', 'check', 'ai', 'agent', 'task', 'svg']
  },
  'Micro/SwipeRow': {
    videoUrl: '/assets/videos/swiperow.webm',
    description:
      'List row that swipes open to reveal actions, snaps by flick velocity, and deletes on a full swipe that stretches the action colour across the row.',
    category: 'Micro',
    name: 'SwipeRow',
    docsUrl: 'https://vue-bits.dev/micro/swipe-row',
    tags: ['swipe', 'list', 'gesture', 'delete', 'drag']
  },
  'Micro/SwipeToast': {
    videoUrl: '/assets/videos/swipetoast.webm',
    description:
      'Single toast that rises through its bottom edge, swipes down to dismiss on a flick or a distance, and burns a thin fuse for exactly its remaining time; hover pauses it and an inline mode keeps it inside any container.',
    category: 'Micro',
    name: 'SwipeToast',
    docsUrl: 'https://vue-bits.dev/micro/swipe-toast',
    tags: ['toast', 'notification', 'swipe', 'drag', 'timer', 'undo']
  },
  'Micro/TearTicket': {
    videoUrl: '/assets/videos/tearticket.webm',
    description:
      'Ticket whose perforated stub tears off by hand: paper bridges stretch into fibres and snap one by one from the far end, the torn edges are jagged and fit each other, the freed stub dangles and drops, and the body is stamped as used. The artwork tilts in 3D with parallax on hover.',
    category: 'Micro',
    name: 'TearTicket',
    docsUrl: 'https://vue-bits.dev/micro/tear-ticket',
    tags: ['ticket', 'tear', 'perforation', 'stub', 'coupon', 'pass', 'drag', 'parallax', 'tilt']
  },
  'Micro/ThoughtLine': {
    videoUrl: '/assets/videos/thoughtline.webm',
    description:
      'Reasoning-trace header: a glyph and a label breathe beside a live clock while steps appear beneath, then the line settles on one beat into "Thought for 4.2s" through a blur crossfade and the trace folds into it.',
    category: 'Micro',
    name: 'ThoughtLine',
    docsUrl: 'https://vue-bits.dev/micro/thought-line',
    tags: ['ai', 'agent', 'status', 'reasoning', 'timer', 'text', 'trace']
  },
  'Micro/VoicePill': {
    videoUrl: '/assets/videos/voicepill.webm',
    description:
      'Mic button that swells into a tinted capsule of level-driven equalizer bars and an elapsed clock while held or toggled, then relaxes back into the mic on release; simulated voice by default, real microphone as an opt-in.',
    category: 'Micro',
    name: 'VoicePill',
    docsUrl: 'https://vue-bits.dev/micro/voice-pill',
    tags: ['mic', 'voice', 'dictation', 'equalizer', 'press', 'ai']
  },
  'Micro/WakeSlider': {
    videoUrl: '/assets/videos/wakeslider.webm',
    description:
      'Range slider drawn as thin bars with no thumb: drag speed raises a wake that trails behind the handle and flattens again at rest.',
    category: 'Micro',
    name: 'WakeSlider',
    docsUrl: 'https://vue-bits.dev/micro/wake-slider',
    tags: ['slider', 'range', 'input', 'drag', 'bars', 'velocity']
  },
  'Micro/WarmTooltip': {
    videoUrl: '/assets/videos/warmtooltip.webm',
    description:
      'Tooltip group with one shared delay: the first label waits and pops from its trigger, then siblings open instantly while the group is warm, with an optional velocity lean.',
    category: 'Micro',
    name: 'WarmTooltip',
    docsUrl: 'https://vue-bits.dev/micro/warm-tooltip',
    tags: ['tooltip', 'hover', 'toolbar', 'delay', 'group', 'label']
  },
  'Micro/PaperCrumple': {
    videoUrl: '/assets/videos/papercrumple.webm',
    description:
      'An image that crumples into a textured 3D sheet while held and follows the grabbed point as you drag. Release it as a crumpled ball, unfold it flat, or leave the paper creased, with customizable folds, paper grain, lighting and shadows.',
    category: 'Micro',
    name: 'PaperCrumple',
    docsUrl: 'https://vue-bits.dev/micro/paper-crumple',
    tags: ['paper', 'crumple', '3d', 'three', 'image', 'drag', 'hold', 'fold', 'crease']
  }
};
