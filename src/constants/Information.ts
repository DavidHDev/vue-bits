export type ComponentMetadata = Record<
  string,
  {
    videoUrl: string;
    description: string;
    category: string;
    name: string;
    docsUrl: string;
    tags: string[];
    added?: string;
    hidden?: boolean;
    updates?: { date: string; note: string }[];
    meta?: Record<string, unknown>;
  }
>;

export const componentMetadata: ComponentMetadata = {
  'TextAnimations/TechText': {
    videoUrl: '/assets/videos/techtext.webm',
    description: 'A wordmark whose letters turn into dashed vector paths under the cursor.',
    category: 'TextAnimations',
    name: 'TechText',
    docsUrl: 'https://vue-bits.dev/text-animations/tech-text',
    tags: [],
    added: '2026-09-24',
    updates: [
      {
        date: '2026-10-13',
        note: 'Click a letter to ripple the word, play a typed, assembled or font metrics intro, and show the font’s guide lines.'
      },
      {
        date: '2026-11-08',
        note: 'Keeps glyph motion and selection stable and prevents canvas flicker while resizing.'
      }
    ]
  },
  'TextAnimations/TextLoop': {
    videoUrl: '/assets/videos/textloop.webm',
    description: 'A seamless text marquee that flows along curved SVG paths.',
    category: 'TextAnimations',
    name: 'TextLoop',
    docsUrl: 'https://vue-bits.dev/text-animations/text-loop',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Add a second band that crosses the first in an X with a soft shadow, drag or fling the loop, and let page scrolling speed it up or reverse it. Letters can now be drawn as outlines.'
      }
    ]
  },
  'TextAnimations/MaskedHeading': {
    videoUrl: '/assets/videos/maskedheading.webm',
    description: 'A headline with a drifting colour mesh or image showing through, revealed word by word.',
    category: 'TextAnimations',
    name: 'MaskedHeading',
    docsUrl: 'https://vue-bits.dev/text-animations/masked-heading',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Two new entrances, letters growing in one by one and a focus pull, plus a soft light that follows the cursor and brings back full color. Letters can also be drawn as thin strokes that the image fills as it arrives.'
      },
      { date: '2026-11-08', note: 'Fixes resize observer loops.' }
    ]
  },
  'TextAnimations/ParticleText': {
    videoUrl: '/assets/videos/particletext.webm',
    description: 'Text assembles from drifting particles that scatter and reform on demand.',
    category: 'TextAnimations',
    name: 'ParticleText',
    docsUrl: 'https://vue-bits.dev/text-animations/particle-text',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Text can now rain in, swirl into place or print behind a sweeping line, and particles can be drawn as squares or short strokes. Click to blow the particles apart and watch them spring back.'
      }
    ]
  },
  'TextAnimations/SplitFlapText': {
    videoUrl: '/assets/videos/splitflaptext.webm',
    description: 'Mechanical split-flap departure board that clacks through to each new phrase.',
    category: 'TextAnimations',
    name: 'SplitFlapText',
    docsUrl: 'https://vue-bits.dev/text-animations/split-flap-text',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Boards can now cascade from the right, from the middle or in random order, with a soft sheen across falling flaps and adjustable depth. A new minimal style drops the tiles and flips bare characters split by a hinge line.'
      }
    ]
  },
  'TextAnimations/WarpText': {
    videoUrl: '/assets/videos/warptext.webm',
    description: 'WebGL warp that bends and refracts the text around the pointer.',
    category: 'TextAnimations',
    name: 'WarpText',
    docsUrl: 'https://vue-bits.dev/text-animations/warp-text',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Clicking now sends a shockwave through the text, and the lens can keep wandering across the words when the cursor leaves. Adds glass-like color fringing inside the lens, with smoother fringe edges in light and dark mode.'
      },
      { date: '2026-11-08', note: 'Keeps text visible while resizing and rebuilding its layout.' }
    ]
  },
  'TextAnimations/StrokeText': {
    videoUrl: '/assets/videos/stroketext.webm',
    description: 'Outlined letterforms draw themselves on, then flood with fill.',
    category: 'TextAnimations',
    name: 'StrokeText',
    docsUrl: 'https://vue-bits.dev/text-animations/stroke-text',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Outlines can now be dashed or dotted and keep flowing around the letters, and they redraw when hovered. Filled letters can also lift off the page with a soft offset shadow.'
      }
    ]
  },
  'TextAnimations/DepthText': {
    videoUrl: '/assets/videos/depthtext.webm',
    description: 'Layered extruded type with parallax that shifts against the pointer.',
    category: 'TextAnimations',
    name: 'DepthText',
    docsUrl: 'https://vue-bits.dev/text-animations/depth-text',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'The extrusion can now fade into the page, and the word presses in on hover and springs back. It can also float gently while idle.'
      }
    ]
  },
  'TextAnimations/FoldText': {
    videoUrl: '/assets/videos/foldtext.webm',
    description: 'Lines unfold into place like creased paper opening flat.',
    category: 'TextAnimations',
    name: 'FoldText',
    docsUrl: 'https://vue-bits.dev/text-animations/fold-text',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Letters can now open like blinds or flip over like cards, and fold away near the cursor as it passes. Looping text can hold as long as you like before folding back up.'
      }
    ]
  },
  'TextAnimations/EchoText': {
    videoUrl: '/assets/videos/echotext.webm',
    description: 'Ghosted copies trail behind the text and settle into a single word.',
    category: 'TextAnimations',
    name: 'EchoText',
    docsUrl: 'https://vue-bits.dev/text-animations/echo-text',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Click the text to send out a burst of echoes, or let the echoes drift on their own or trail behind page scrolling. Echoes can also fade between two colors.'
      }
    ]
  },
  'TextAnimations/SplitText': {
    videoUrl: '/assets/videos/splittext.webm',
    description: 'Splits text into characters / words for staggered entrance animation.',
    category: 'TextAnimations',
    name: 'SplitText',
    docsUrl: 'https://vue-bits.dev/text-animations/split-text',
    tags: [],
    added: '2024-08-06',
    updates: [
      {
        date: '2026-10-13',
        note: 'Text can now flip, pop, blur, skew or wave into place, loop, and replay on hover or click. Pieces can arrive in an accent color, and letters lift or ripple under the cursor.'
      }
    ]
  },
  'TextAnimations/BlurText': {
    videoUrl: '/assets/videos/blurtext.webm',
    description: 'Text starts blurred then crisply resolves for a soft-focus reveal effect.',
    category: 'TextAnimations',
    name: 'BlurText',
    docsUrl: 'https://vue-bits.dev/text-animations/blur-text',
    tags: [],
    added: '2024-08-06',
    updates: [
      {
        date: '2026-10-13',
        note: 'Text can now zoom, tilt in 3D, pull into focus or drift in, starting from the middle, the end or at random. It can also loop, replay on hover or click, start in a second color and keep the hovered word sharp.'
      }
    ]
  },
  'TextAnimations/CircularText': {
    videoUrl: '/assets/videos/circulartext.webm',
    description: 'Layouts characters around a circle with optional rotation animation.',
    category: 'TextAnimations',
    name: 'CircularText',
    docsUrl: 'https://vue-bits.dev/text-animations/circular-text',
    tags: [],
    added: '2025-02-14',
    updates: [
      {
        date: '2026-10-13',
        note: 'Fling the ring and it coasts back to its cruising speed, leans toward the cursor in 3D and can sit back like a planet’s orbit. Add an icon in the middle, an inner circle and natural spacing with gaps.'
      }
    ]
  },
  'TextAnimations/TextType': {
    videoUrl: '/assets/videos/texttype.webm',
    description: 'Typewriter effect with blinking cursor and adjustable typing cadence.',
    category: 'TextAnimations',
    name: 'TextType',
    docsUrl: 'https://vue-bits.dev/text-animations/text-type',
    tags: [],
    added: '2025-07-20',
    updates: [
      {
        date: '2026-10-13',
        note: 'Pick a bar, block or underscore cursor that glides and blinks softly, and let letters fade, blur or rise in as they type. Add occasional typos that get corrected, or a fixed lead-in before rotating words.'
      }
    ]
  },
  'TextAnimations/Shuffle': {
    videoUrl: '/assets/videos/shuffle.webm',
    description: 'Animated text reveal where characters shuffle before settling.',
    category: 'TextAnimations',
    name: 'Shuffle',
    docsUrl: 'https://vue-bits.dev/text-animations/shuffle',
    tags: [],
    added: '2025-09-06',
    updates: [
      {
        date: '2026-10-13',
        note: 'Letters can now flip like cards in 3D or spin in place with motion blur, and hovering can reshuffle just the letters near the cursor. Adds text and accent colors and a motion blur for sliding letters, and up or left shuffles no longer land on random symbols.'
      }
    ]
  },
  'TextAnimations/ShinyText': {
    videoUrl: '/assets/videos/shinytext.webm',
    description: 'A sheen of light that sweeps across text, from soft bands to chrome-like reflections.',
    category: 'TextAnimations',
    name: 'ShinyText',
    docsUrl: 'https://vue-bits.dev/text-animations/shiny-text',
    tags: [],
    added: '2024-08-12',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt with more control over the shine, a travelling glow and new ways to play it, like on hover or scroll.'
      }
    ]
  },
  'TextAnimations/TextPressure': {
    videoUrl: '/assets/videos/textpressure.webm',
    description: 'Characters scale / warp interactively based on pointer pressure zone.',
    category: 'TextAnimations',
    name: 'TextPressure',
    docsUrl: 'https://vue-bits.dev/text-animations/text-pressure',
    tags: [],
    added: '2025-01-17',
    updates: [
      {
        date: '2026-10-13',
        note: 'Click to send a ripple of pressure through the letters, and let the word keep rolling or breathing while the cursor is away. Letters can warm toward an accent color as they swell, and you can set how softly they follow.'
      }
    ]
  },
  'TextAnimations/CurvedLoop': {
    videoUrl: '/assets/videos/curvedloop.webm',
    description: 'Flowing looping text path along a customizable curve with drag interaction.',
    category: 'TextAnimations',
    name: 'CurvedLoop',
    docsUrl: 'https://vue-bits.dev/text-animations/curved-loop',
    tags: [],
    added: '2025-07-06',
    updates: [
      {
        date: '2026-10-13',
        note: 'Text can now travel along a wave, a closed ring or a straight line, with outlined letters and an accent mark between repeats. Scrolling the page gives the loop a burst of speed that eases off.'
      }
    ]
  },
  'TextAnimations/FuzzyText': {
    videoUrl: '/assets/videos/fuzzytext.webm',
    description: 'Vibrating fuzzy text with controllable hover intensity.',
    category: 'TextAnimations',
    name: 'FuzzyText',
    docsUrl: 'https://vue-bits.dev/text-animations/fuzzy-text',
    tags: [],
    added: '2025-02-18',
    updates: [
      {
        date: '2026-10-13',
        note: 'Text can now resolve out of heavy static when it first appears and tear into soft color fringes. The fuzz can follow the cursor, run all the time or fire in bursts on click.'
      }
    ]
  },
  'TextAnimations/GradientText': {
    videoUrl: '/assets/videos/gradienttext.webm',
    description: 'Living gradients inside your text: a sliding sweep, a drifting mesh or a swinging conic fan.',
    category: 'TextAnimations',
    name: 'GradientText',
    docsUrl: 'https://vue-bits.dev/text-animations/gradient-text',
    tags: [],
    added: '2024-08-12',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt with new flow and conic styles, a soft glow and colors that drift toward the cursor.'
      }
    ]
  },
  'TextAnimations/FallingText': {
    videoUrl: '/assets/videos/fallingtext.webm',
    description:
      'Text that breaks apart and tumbles into a pile you can drag, throw and swipe, then flies back into place.',
    category: 'TextAnimations',
    name: 'FallingText',
    docsUrl: 'https://vue-bits.dev/text-animations/falling-text',
    tags: [],
    added: '2025-01-22',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt with smoother physics. Words or single letters knock each other loose as they fall, can be thrown and swept around, and fly back into place, with a new tiles style and light mode.'
      }
    ]
  },
  'TextAnimations/TextCursor': {
    videoUrl: '/assets/videos/textcursor.webm',
    description: 'Text or emoji that trails your cursor as stamped copies, a following chain or a ribbon of letters.',
    category: 'TextAnimations',
    name: 'TextCursor',
    docsUrl: 'https://vue-bits.dev/text-animations/text-cursor',
    tags: [],
    added: '2025-03-18',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with a smoother trail that pops in, tapers and pulls back when you stop, plus chain and ribbon modes.'
      }
    ]
  },
  'TextAnimations/DecryptedText': {
    videoUrl: '/assets/videos/decryptedtext.webm',
    description: 'Hacker-style decryption cycling random glyphs until resolving to real text.',
    category: 'TextAnimations',
    name: 'DecryptedText',
    docsUrl: 'https://vue-bits.dev/text-animations/decrypted-text',
    tags: [],
    added: '2025-01-06',
    updates: [
      {
        date: '2026-10-13',
        note: 'Letters can now roll in like a flip board or brighten out of faint glyphs, with an accent color that settles as they decode. Text can loop, and hovering can scramble just the letters near the cursor.'
      }
    ]
  },
  'TextAnimations/TrueFocus': {
    videoUrl: '/assets/videos/truefocus.webm',
    description: 'Applies dynamic blur / clarity based over a series of words in order.',
    category: 'TextAnimations',
    name: 'TrueFocus',
    docsUrl: 'https://vue-bits.dev/text-animations/true-focus',
    tags: [],
    added: '2025-01-07',
    updates: [
      {
        date: '2026-10-13',
        note: 'Mark the focused word with a box, an underline or a soft highlight, and let it scale up slightly. The frame can spring between words and visit them in random order.'
      }
    ]
  },
  'TextAnimations/ScrollFloat': {
    videoUrl: '/assets/videos/scrollfloat.webm',
    description: 'Text gently floats / parallax shifts on scroll.',
    category: 'TextAnimations',
    name: 'ScrollFloat',
    docsUrl: 'https://vue-bits.dev/text-animations/scroll-float',
    tags: [],
    added: '2025-02-17',
    updates: [
      {
        date: '2026-10-13',
        note: 'Letters can now flip, scatter, blur or wave into place, by letter or by word, from above or below. Pick which go first and let them arrive in an accent color.'
      }
    ]
  },
  'TextAnimations/ScrollReveal': {
    videoUrl: '/assets/videos/scrollreveal.webm',
    description: 'Text gently unblurs and reveals on scroll.',
    category: 'TextAnimations',
    name: 'ScrollReveal',
    docsUrl: 'https://vue-bits.dev/text-animations/scroll-reveal',
    tags: [],
    added: '2025-02-17',
    updates: [
      {
        date: '2026-10-13',
        note: 'Text can now reveal by word, letter or line, rising, flipping or popping into place, and light up in an accent color as it appears. It can also play once on entering view.'
      }
    ]
  },
  'TextAnimations/AsciiText': {
    videoUrl: '/assets/videos/asciitext.webm',
    description: 'Waving ASCII text that tilts toward the pointer, scrambles on hover and ripples on click.',
    category: 'TextAnimations',
    name: 'ASCIIText',
    docsUrl: 'https://vue-bits.dev/text-animations/ascii-text',
    tags: [],
    added: '2025-01-20',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt so the layers never slip apart on load, with a scramble on hover, click ripples and custom characters.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'TextAnimations/ScrambledText': {
    videoUrl: '/assets/videos/scrambledtext.webm',
    description: 'Detects cursor position and applies a distortion effect to text.',
    category: 'TextAnimations',
    name: 'ScrambledText',
    docsUrl: 'https://vue-bits.dev/text-animations/scrambled-text',
    tags: [],
    added: '2025-05-23',
    updates: [
      {
        date: '2026-10-13',
        note: 'Letters near the cursor can now rise, blur or swell like a lens, and a click sends a scramble wave through the text. Works with any typeface without the layout jumping.'
      }
    ]
  },
  'TextAnimations/RotatingText': {
    videoUrl: '/assets/videos/rotatingtext.webm',
    description: 'Cycles through multiple phrases with 3D rotate / flip transitions.',
    category: 'TextAnimations',
    name: 'RotatingText',
    docsUrl: 'https://vue-bits.dev/text-animations/rotating-text',
    tags: [],
    added: '2025-02-02',
    updates: [
      {
        date: '2026-10-13',
        note: 'Words can now flip, blur, zoom or drop in with a small bounce, rolling up or down. A highlight block smoothly resizes to fit each word and keeps the text readable on any color.'
      }
    ]
  },
  'TextAnimations/GlitchText': {
    videoUrl: '/assets/videos/glitchtext.webm',
    description: 'RGB split and distortion glitch effect with jitter effects.',
    category: 'TextAnimations',
    name: 'GlitchText',
    docsUrl: 'https://vue-bits.dev/text-animations/glitch-text',
    tags: [],
    added: '2025-02-18',
    updates: [
      {
        date: '2026-10-13',
        note: 'Pick from four glitch styles: sliced bands, a jittering color split, a scanning tear or swapped glyphs. Set how hard it glitches, add skew and flicker, and play short bursts on click.'
      }
    ]
  },
  'TextAnimations/ScrollVelocity': {
    videoUrl: '/assets/videos/scrollvelocity.webm',
    description: "Text marquee animatio - speed and distortion scale with user's scroll velocity.",
    category: 'TextAnimations',
    name: 'ScrollVelocity',
    docsUrl: 'https://vue-bits.dev/text-animations/scroll-velocity',
    tags: [],
    added: '2025-02-14',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rows can lean and stretch with scroll speed, be grabbed and thrown with inertia, and alternate with outlined text. Set the text size, weight, color and spacing directly.'
      }
    ]
  },
  'TextAnimations/VariableProximity': {
    videoUrl: '/assets/videos/variableproximity.webm',
    description: 'Letter styling changes continuously with pointer distance mapping.',
    category: 'TextAnimations',
    name: 'VariableProximity',
    docsUrl: 'https://vue-bits.dev/text-animations/variable-proximity',
    tags: [],
    added: '2025-01-07',
    updates: [
      {
        date: '2026-10-13',
        note: 'Letters can now shift toward an accent color, grow and rise as the cursor gets close, and a gentle wave of weight runs through the text while idle. Adds a font size setting, and lines no longer rewrap while letters change weight.'
      }
    ]
  },
  'TextAnimations/CountUp': {
    videoUrl: '/assets/videos/countup.webm',
    description: 'Animated number counter supporting formatting and decimals.',
    category: 'TextAnimations',
    name: 'CountUp',
    docsUrl: 'https://vue-bits.dev/text-animations/count-up',
    tags: [],
    added: '2024-08-13',
    updates: [
      {
        date: '2026-10-13',
        note: 'Numbers can roll into place like an odometer, settle with a spring, shorten to 1.2K or 3.4M and replay on hover.'
      }
    ]
  },
  'Animations/CrystalizedBall': {
    videoUrl: '/assets/videos/crystalizedball.webm',
    description: 'A glass ball with a crackling electric rim and glowing dust that swirls with the cursor.',
    category: 'Animations',
    name: 'CrystalizedBall',
    docsUrl: 'https://vue-bits.dev/animations/crystalized-ball',
    tags: ['webgl', 'ogl', 'orb', 'electric', 'particles', 'glow', 'interactive'],
    added: '2026-10-06',
    updates: [{ date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }]
  },
  'Animations/ElectricLogo': {
    videoUrl: '/assets/videos/electriclogo.webm',
    description: 'Turns any logo into a living lightning outline, with arcs that leap off its edges.',
    category: 'Animations',
    name: 'ElectricLogo',
    docsUrl: 'https://vue-bits.dev/animations/electric-logo',
    tags: [],
    added: '2026-09-25',
    updates: [
      { date: '2026-09-28', note: 'Added an onRender callback for capturing live frames and reflection effects.' },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Animations/DitherVeil': {
    videoUrl: '/assets/videos/ditherveil.webm',
    description: 'A 1-bit dithered photo the cursor burns through to full colour, knitting back cell by cell.',
    category: 'Animations',
    name: 'DitherVeil',
    docsUrl: 'https://vue-bits.dev/animations/dither-veil',
    tags: [],
    added: '2026-09-23',
    updates: [{ date: '2026-11-08', note: 'Preserves reveal trails and prevents flicker while resizing.' }]
  },
  'Animations/GlowCursor': {
    videoUrl: '/assets/videos/glowcursor.webm',
    description: 'Light that pours from the cursor, drifts softly through the air and cools as it fades.',
    category: 'Animations',
    name: 'GlowCursor',
    docsUrl: 'https://vue-bits.dev/animations/glow-cursor',
    tags: [],
    added: '2026-08-26',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt as light that pours from the cursor and drifts softly as it fades, with a burst on click and a light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Animations/ScrollExpand': {
    videoUrl: '/assets/videos/scrollexpand.webm',
    description: 'A rounded media frame that grows to full bleed as it scrolls through the viewport.',
    category: 'Animations',
    name: 'ScrollExpand',
    docsUrl: 'https://vue-bits.dev/animations/scroll-expand',
    tags: [],
    added: '2026-08-04'
  },
  'Animations/RippleDistortion': {
    videoUrl: '/assets/videos/rippledistortion.webm',
    description: 'Pointer-driven water displacement that warps content and leaves a decaying wake.',
    category: 'Animations',
    name: 'RippleDistortion',
    docsUrl: 'https://vue-bits.dev/animations/ripple-distortion',
    tags: [],
    added: '2026-08-04',
    updates: [{ date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }]
  },
  'Animations/ElasticMesh': {
    videoUrl: '/assets/videos/elasticmesh.webm',
    description: 'Turns text or any logo into a puffy inflated shape you can press, poke and stretch like jelly.',
    category: 'Animations',
    name: 'ElasticMesh',
    docsUrl: 'https://vue-bits.dev/animations/elastic-mesh',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt as inflated, squishy type and logos that dent, stretch and snap back with a jiggle.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Animations/SwarmCursor': {
    videoUrl: '/assets/videos/swarmcursor.webm',
    description:
      'A liquid swarm of particles that flows after the cursor, curls into eddies and pours around hovered buttons.',
    category: 'Animations',
    name: 'SwarmCursor',
    docsUrl: 'https://vue-bits.dev/animations/swarm-cursor',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt as a liquid swarm that flows after the cursor, curls into eddies when you stop, pours around hovered buttons and splashes on click. No extra dependencies.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Animations/HalftoneReveal': {
    videoUrl: '/assets/videos/halftonereveal.webm',
    description: 'A halftone print of an image whose dots swell into the real photo under the cursor.',
    category: 'Animations',
    name: 'HalftoneReveal',
    docsUrl: 'https://vue-bits.dev/animations/halftone-reveal',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt as a print on the page in mono, duotone or full color, with dots that swell into the photo.'
      },
      { date: '2026-11-08', note: 'Preserves reveal trails and prevents flicker while resizing.' }
    ]
  },
  'Animations/PixelSwap': {
    videoUrl: '/assets/videos/pixelswap.webm',
    description: 'New content builds in pixel by pixel in a springy wave that starts wherever the cursor enters.',
    category: 'Animations',
    name: 'PixelSwap',
    docsUrl: 'https://vue-bits.dev/animations/pixel-swap',
    tags: [],
    added: '2026-08-12',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt to be fast and seamless, with pixels that spring in from wherever the cursor enters and retreat the moment it leaves. New dot and spin styles and a pixel intro.'
      }
    ]
  },
  'Animations/CursorGrid': {
    videoUrl: '/assets/videos/cursorgrid.webm',
    description:
      'A crisp grid whose cells light up and fade behind the cursor, with grid styles, tiles and click pulses.',
    category: 'Animations',
    name: 'CursorGrid',
    docsUrl: 'https://vue-bits.dev/animations/cursor-grid',
    tags: [],
    added: '2026-07-14',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt as a crisp, minimal grid with a soft spotlight, single cell or area highlights, tiles, dashed, dot and mark styles, clean click rings, an intro and a light mode.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Animations/AnimatedContent': {
    videoUrl: '/assets/videos/animatedcontent.webm',
    description:
      'Wrapper that reveals its content on scroll with slides, blur, 3D tilts, soft wipes and staggered children.',
    category: 'Animations',
    name: 'AnimatedContent',
    docsUrl: 'https://vue-bits.dev/animations/animated-content',
    tags: [],
    added: '2025-01-05',
    updates: [
      {
        date: '2026-10-12',
        note: 'Now with blur-in, rotate, 3D tilt and soft wipe reveals, staggered children for lists and grids, scroll-linked progress, replay on scroll and a mount trigger.'
      }
    ]
  },
  'Animations/FadeContent': {
    videoUrl: '/assets/videos/fadecontent.webm',
    description:
      'Wrapper that fades content in on scroll, plain or out of focus, from washed-out gray, or through grain, mist and pixel blocks.',
    category: 'Animations',
    name: 'FadeContent',
    docsUrl: 'https://vue-bits.dev/animations/fade-content',
    tags: [],
    added: '2024-08-07',
    updates: [
      {
        date: '2026-10-12',
        note: 'Now fades in out of focus, from washed-out gray, or through grain, mist and pixel blocks, with staggered children and scroll-linked fades in and out.'
      }
    ]
  },
  'Animations/ElectricBorder': {
    videoUrl: '/assets/videos/electricborder.webm',
    description: 'Wraps any element in crackling strands of current that surge near the cursor and leap off in sparks.',
    category: 'Animations',
    name: 'ElectricBorder',
    docsUrl: 'https://vue-bits.dev/animations/electric-border',
    tags: [],
    added: '2025-08-21',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt with layered lightning strands, sparks and a soft glow. The current races around the edge as it powers on, surges near the cursor and jolts around on click, and now works in light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Animations/OrbitImages': {
    videoUrl: '/assets/videos/orbitimages.webm',
    description: 'SVG Path customizable orbiting images effect',
    category: 'Animations',
    name: 'OrbitImages',
    docsUrl: 'https://vue-bits.dev/animations/orbit-images',
    tags: [],
    added: '2026-02-12',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt with real depth, so photos pass behind and in front of whatever sits in the middle, and it now fits any container. Drag to spin it, click a photo to bring it forward, and style the tiles, shadows and path.'
      }
    ]
  },
  'Animations/PixelTransition': {
    videoUrl: '/assets/videos/pixeltransition.webm',
    description:
      'Retro pixel dissolve that covers a card in solid pixels, swaps the content underneath and clears again.',
    category: 'Animations',
    name: 'PixelTransition',
    docsUrl: 'https://vue-bits.dev/animations/pixel-transition',
    tags: [],
    added: '2025-01-21',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt to stay smooth on quick hovers, with new reveal patterns, pixel shapes and a choppy retro mode.'
      }
    ]
  },
  'Animations/GlareHover': {
    videoUrl: '/assets/videos/glarehover.webm',
    description: 'A glossy light streak that sweeps across any element in the direction the cursor moves.',
    category: 'Animations',
    name: 'GlareHover',
    docsUrl: 'https://vue-bits.dev/animations/glare-hover',
    tags: [],
    added: '2025-05-30',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with a more realistic glare that follows the cursor direction, a glinting edge and new shapes and modes.'
      }
    ]
  },
  'Animations/LogoLoop': {
    videoUrl: '/assets/videos/logoloop.webm',
    description: 'Continuously looping marquee of brand or tech logos with seamless repeat and hover pause.',
    category: 'Animations',
    name: 'LogoLoop',
    docsUrl: 'https://vue-bits.dev/animations/logo-loop',
    tags: [],
    added: '2025-08-18',
    updates: [
      {
        date: '2026-10-13',
        note: 'Now draggable with a soft fade that works on any background and an intro. Adds wave, arc and 3D orbit paths, a center lens, dock-style magnify, stepping, labels and perspective tilt.'
      }
    ]
  },
  'Animations/TargetCursor': {
    videoUrl: '/assets/videos/targetcursor.webm',
    description: 'A reticle cursor whose corner brackets snap around targets, matching their shape.',
    category: 'Animations',
    name: 'TargetCursor',
    docsUrl: 'https://vue-bits.dev/animations/target-cursor',
    tags: [],
    added: '2025-07-18',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt without dependencies. The brackets now follow rounded corners, react to clicks, show labels and can stay inside one area.'
      }
    ]
  },
  'Animations/LaserFlow': {
    videoUrl: '/assets/videos/laserflow.webm',
    description: 'A beam of light that splashes onto your content and pours over its corners.',
    category: 'Animations',
    name: 'LaserFlow',
    docsUrl: 'https://vue-bits.dev/animations/laser-flow',
    tags: [],
    added: '2025-09-09',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt as a waterfall of light that lands on your content, pours over its corners and can reveal your UI around the cursor.'
      },
      {
        date: '2026-11-10',
        note: 'Loads without freezing the page while its effect starts up, and frees graphics memory when removed.'
      }
    ]
  },
  'Animations/GhostCursor': {
    videoUrl: '/assets/videos/ghostcursor.webm',
    description: 'A ghost of glowing smoke that floats after the cursor and curls away as it rises.',
    category: 'Animations',
    name: 'GhostCursor',
    docsUrl: 'https://vue-bits.dev/animations/ghost-cursor',
    tags: [],
    added: '2025-10-27',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt as real drifting smoke that stays sharp on any screen, many times faster and with no extra dependencies. Clicks release a puff, and it works on light pages too.'
      },
      {
        date: '2026-11-10',
        note: 'Loads without freezing the page while its effect starts up, and frees graphics memory when removed.'
      }
    ]
  },
  'Animations/GradualBlur': {
    videoUrl: '/assets/videos/gradualblur.webm',
    description:
      'Progressive edge blur for headers, footers, captions and carousels, with an optional fade to color that hides at the ends of a scroll.',
    category: 'Animations',
    name: 'GradualBlur',
    docsUrl: 'https://vue-bits.dev/animations/gradual-blur',
    tags: [],
    added: '2025-08-26',
    updates: [
      {
        date: '2026-10-12',
        note: 'Smoother blur with no visible steps, plus a fade to any color, a color boost, hover to clear, and a blur that hides itself at the ends of a scroll.'
      }
    ]
  },
  'Animations/ClickSpark': {
    videoUrl: '/assets/videos/clickspark.webm',
    description: 'Bursts of sparks at every click, as dashes, comets, dots or stars, that can spill around buttons.',
    category: 'Animations',
    name: 'ClickSpark',
    docsUrl: 'https://vue-bits.dev/animations/click-spark',
    tags: [],
    added: '2025-01-16',
    updates: [
      {
        date: '2026-10-12',
        note: 'Sharper sparks with new shapes, colors, gravity and glow. Bursts can now spill past small buttons, appear behind your content, and fire from code.'
      }
    ]
  },
  'Animations/Magnet': {
    videoUrl: '/assets/videos/magnet.webm',
    description: 'Elements magnetically ease toward the cursor then settle back with spring physics.',
    category: 'Animations',
    name: 'Magnet',
    docsUrl: 'https://vue-bits.dev/animations/magnet',
    tags: [],
    added: '2024-08-08',
    updates: [
      {
        date: '2026-10-12',
        note: 'Now moves on a real spring with a smooth pull at the edge of its range, and only the nearest magnet reacts when several overlap. Adds tilt, scale, axis locking and a movement cap.'
      }
    ]
  },
  'Animations/Strands': {
    videoUrl: '/assets/videos/strands.webm',
    description:
      'Spectral strands that twist inside a frosted glass orb and swell into a smooth bulge where they come together, like the new Siri.',
    category: 'Animations',
    name: 'Strands',
    docsUrl: 'https://vue-bits.dev/animations/strands',
    tags: [],
    added: '2026-06-10',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt to match the new Siri orb: spectral strands twist inside frosted glass and swell into one smooth bulge where they come together. It livens up with a voice, a click or the cursor.'
      }
    ]
  },
  'Animations/StickerPeel': {
    videoUrl: '/assets/videos/stickerpeel.webm',
    description:
      'A die-cut sticker you can peel at any edge, drag, throw and swing, in gloss, matte or holographic finishes.',
    category: 'Animations',
    name: 'StickerPeel',
    docsUrl: 'https://vue-bits.dev/animations/sticker-peel',
    tags: [],
    added: '2025-07-21',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt with a real curl, soft shadows and no extra dependencies. The edge nearest the cursor lifts, thrown stickers swing, slide and bounce, and there are gloss, matte and holographic finishes.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Animations/PixelTrail': {
    videoUrl: '/assets/videos/pixeltrail.webm',
    description: 'Glossy pixels melt into a fluid goo trail behind the cursor, with color shifts and drips.',
    category: 'Animations',
    name: 'PixelTrail',
    docsUrl: 'https://vue-bits.dev/animations/pixel-trail',
    tags: [],
    added: '2025-02-01',
    updates: [
      {
        date: '2026-10-10',
        note: 'The same fluid trail, now crisp and glossy, with visible pixels, depth and glow. New options add color shifts, drips, sparkle, click bursts, dither and image reveals.'
      }
    ]
  },
  'Animations/Cubes': {
    videoUrl: '/assets/videos/cubes.webm',
    description: 'A grid of outlined 3D cubes that turn to face the cursor, spin when swept and ripple on click.',
    category: 'Animations',
    name: 'Cubes',
    docsUrl: 'https://vue-bits.dev/animations/cubes',
    tags: [],
    added: '2025-06-17',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with springy cubes that face the cursor, spin when you sweep past and ripple on click, plus new edge styles, shading and depth.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Animations/MetallicPaint': {
    videoUrl: '/assets/videos/metallicpaint.webm',
    description: "Liquid chrome that flows over your logo or text, adapted from Paper's Liquid Metal shader.",
    category: 'Animations',
    name: 'MetallicPaint',
    docsUrl: 'https://vue-bits.dev/animations/metallic-paint',
    tags: [],
    added: '2025-02-22',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt as liquid metal with reflections that bend around the edges. It now paints text as well as logos, tilts with the cursor and pours in on load.'
      },
      { date: '2026-11-10', note: 'Loads without freezing the page while its effect starts up.' }
    ]
  },
  'Animations/Noise': {
    videoUrl: '/assets/videos/noise.webm',
    description: 'Film grain overlay for photos and pages, from fine 35mm grain to dust, paper and TV static.',
    category: 'Animations',
    name: 'Noise',
    docsUrl: 'https://vue-bits.dev/animations/noise',
    tags: [],
    added: '2025-01-06',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt to be much lighter, with film dust, scratches, scanlines and flicker for a real film look.'
      }
    ]
  },
  'Animations/ShapeBlur': {
    videoUrl: '/assets/videos/shapeblur.webm',
    description: 'A crisp logo or shape that drifts out of focus under the pointer like a camera lens.',
    category: 'Animations',
    name: 'ShapeBlur',
    docsUrl: 'https://vue-bits.dev/animations/shape-blur',
    tags: [],
    added: '2025-01-26',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt as a real lens blur that follows the cursor. Use any SVG or PNG as the shape, or switch to focus mode.'
      }
    ]
  },
  'Animations/Crosshair': {
    videoUrl: '/assets/videos/crosshair.webm',
    description: 'Crosshair cursor with live coordinates that locks onto links and buttons and measures them.',
    category: 'Animations',
    name: 'Crosshair',
    docsUrl: 'https://vue-bits.dev/animations/crosshair',
    tags: [],
    added: '2024-08-12',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt from scratch. It frames what you hover with measuring brackets, with new line styles and a click pulse.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Animations/ImageTrail': {
    videoUrl: '/assets/videos/imagetrail.webm',
    description: 'Cursor-based image trail with several built-in variants.',
    category: 'Animations',
    name: 'ImageTrail',
    docsUrl: 'https://vue-bits.dev/animations/image-trail',
    tags: [],
    added: '2025-01-30',
    updates: [
      {
        date: '2026-10-13',
        note: 'The eight fixed variants are now one trail you can tune: size, timing, zoom, flash, drift, tilt, rotation and a stacking pile. Four presets recreate the favourite looks.'
      }
    ]
  },
  'Animations/Ribbons': {
    videoUrl: '/assets/videos/ribbons.webm',
    description: 'Springy ribbons that trail the cursor, in lens, comet or even shapes with an optional wave.',
    category: 'Animations',
    name: 'Ribbons',
    docsUrl: 'https://vue-bits.dev/animations/ribbons',
    tags: [],
    added: '2025-02-09',
    updates: [
      {
        date: '2026-10-10',
        note: 'Smoother, crisper ribbons that move the same at any frame rate. New shapes, a rolling wave, soft edges and more control over how they follow the cursor.'
      },
      {
        date: '2026-11-10',
        note: 'Loads without freezing the page, applies setting changes without an extra redraw and frees graphics memory when removed.'
      }
    ]
  },
  'Animations/SplashCursor': {
    videoUrl: '/assets/videos/splashcursor.webm',
    description: 'A fluid simulation that trails the cursor in swirling ink and bursts into a splash on click.',
    category: 'Animations',
    name: 'SplashCursor',
    docsUrl: 'https://vue-bits.dev/animations/splash-cursor',
    tags: [],
    added: '2025-01-03',
    updates: [
      {
        date: '2026-10-13',
        note: 'Strokes now flow unbroken with smoothly shifting colors, clicks burst into a real splash, and it rests when idle. New ink, smoke, lava and silk looks, a soft glow and a light theme.'
      },
      {
        date: '2026-11-10',
        note: 'Loads without freezing the page while its effect starts up, and frees graphics memory when removed.'
      }
    ]
  },
  'Animations/MetaBalls': {
    videoUrl: '/assets/videos/metaballs.webm',
    description: 'Liquid metaballs that merge, stretch and pinch apart, with a cursor blob that pushes through them.',
    category: 'Animations',
    name: 'MetaBalls',
    docsUrl: 'https://vue-bits.dev/animations/meta-balls',
    tags: [],
    added: '2025-02-12',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt without dependencies. Blobs now cling, stretch and wobble as they merge, the cursor pushes through them, clicks splash them apart, and there are new outline, contour and lava lamp styles.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Animations/BlobCursor': {
    videoUrl: '/assets/videos/blobcursor.webm',
    description:
      'Liquid metal blob cursor that stretches, sloshes and bursts into droplets, in chrome, jelly, pearl or ink.',
    category: 'Animations',
    name: 'BlobCursor',
    docsUrl: 'https://vue-bits.dev/animations/blob-cursor',
    tags: [],
    added: '2024-08-06',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt as a smooth 3D liquid that stretches as it moves, with new looks, drips and a splashy click burst.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Animations/StarBorder': {
    videoUrl: '/assets/videos/starborder.webm',
    description:
      'A twinkling star that travels the exact outline of any button, pill or card, trailing light and stardust.',
    category: 'Animations',
    name: 'StarBorder',
    docsUrl: 'https://vue-bits.dev/animations/star-border',
    tags: [],
    added: '2024-08-18',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt from scratch. The star glides evenly around any shape with a soft trail, hover laps and a click pulse.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Components/HoloCard': {
    videoUrl: '/assets/videos/holocard.webm',
    description: 'Collectible trading card with a real holographic foil and glitter that sparkles as it tilts.',
    category: 'Components',
    name: 'HoloCard',
    docsUrl: 'https://vue-bits.dev/components/holo-card',
    tags: [],
    added: '2026-10-08'
  },
  'Components/CircularCarousel': {
    videoUrl: '/assets/videos/circularcarousel.webm',
    description: 'A 3D ring of images with bendable cards, momentum drag, snapping and click to focus.',
    category: 'Components',
    name: 'CircularCarousel',
    docsUrl: 'https://vue-bits.dev/components/circular-carousel',
    tags: [],
    added: '2026-09-29'
  },
  'Components/FlexCarousel': {
    videoUrl: '/assets/videos/flexcarousel.webm',
    description: 'An infinite image row that flows through invisible liquid glass at its edges.',
    category: 'Components',
    name: 'FlexCarousel',
    docsUrl: 'https://vue-bits.dev/components/flex-carousel',
    tags: [],
    added: '2026-09-26',
    updates: [{ date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }]
  },
  'Components/InfiniteSpiral': {
    videoUrl: '/assets/videos/infinitespiral.webm',
    description: 'An endlessly looping 3D helix of images with adjustable motion, depth and spacing.',
    category: 'Components',
    name: 'InfiniteSpiral',
    docsUrl: 'https://vue-bits.dev/components/infinite-spiral',
    tags: [],
    added: '2026-08-29'
  },
  'Components/DepthCarousel': {
    videoUrl: '/assets/videos/depthcarousel.webm',
    description: 'Cards recede into depth on a 3D rail, with drag, keyboard and auto-advance.',
    category: 'Components',
    name: 'DepthCarousel',
    docsUrl: 'https://vue-bits.dev/components/depth-carousel',
    tags: [],
    added: '2026-08-04'
  },
  'Components/MorphSlider': {
    videoUrl: '/assets/videos/morphslider.webm',
    description: 'WebGL slider that melts between images with a displacement transition.',
    category: 'Components',
    name: 'MorphSlider',
    docsUrl: 'https://vue-bits.dev/components/morph-slider',
    tags: [],
    added: '2026-08-04',
    updates: [{ date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }]
  },
  'Components/DriftWall': {
    videoUrl: '/assets/videos/driftwall.webm',
    description: 'An endless perspective wall of tiles drifting past, lifting on hover.',
    category: 'Components',
    name: 'DriftWall',
    docsUrl: 'https://vue-bits.dev/components/drift-wall',
    tags: [],
    added: '2026-08-04'
  },
  'Components/AccordionGallery': {
    videoUrl: '/assets/videos/accordiongallery.webm',
    description: 'Panels expand on hover or focus, revealing parallax imagery and captions.',
    category: 'Components',
    name: 'AccordionGallery',
    docsUrl: 'https://vue-bits.dev/components/accordion-gallery',
    tags: [],
    added: '2026-08-04'
  },
  'Components/SpecularButton': {
    videoUrl: '/assets/videos/specularbutton.webm',
    description: 'Glass button whose edge catches the light, with a highlight that glides toward the cursor.',
    category: 'Components',
    name: 'SpecularButton',
    docsUrl: 'https://vue-bits.dev/components/specular-button',
    tags: [],
    added: '2026-07-14',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with a crisp glass edge whose light glides around the rim toward the cursor, rests softly when idle and flashes on press.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Components/OptionWheel': {
    videoUrl: '/assets/videos/optionwheel.webm',
    description: 'Curved option picker that spins with scroll, drag or arrow keys, tilting items away.',
    category: 'Components',
    name: 'OptionWheel',
    docsUrl: 'https://vue-bits.dev/components/option-wheel',
    tags: [],
    added: '2026-07-14'
  },
  'Components/CurvedInput': {
    videoUrl: '/assets/videos/curvedinput.webm',
    description: 'Arc-bent input bar with text, caret and submit button all following the curve.',
    category: 'Components',
    name: 'CurvedInput',
    docsUrl: 'https://vue-bits.dev/components/curved-input',
    tags: [],
    added: '2026-07-12'
  },
  'Components/LineSidebar': {
    videoUrl: '/assets/videos/linesidebar.webm',
    description: 'Static list navigation with a cursor-proximity effect that shifts and highlights nearby items.',
    category: 'Components',
    name: 'LineSidebar',
    docsUrl: 'https://vue-bits.dev/components/line-sidebar',
    tags: [],
    added: '2026-07-07'
  },
  'Components/AnimatedList': {
    videoUrl: '/assets/videos/animatedlist.webm',
    description: 'A scrolling list whose rows spring into view, with a gliding selection and arrow keys.',
    category: 'Components',
    name: 'AnimatedList',
    docsUrl: 'https://vue-bits.dev/components/animated-list',
    tags: [],
    added: '2025-02-23',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt so rows spring in from the edge they scroll in from and the selection glides between them. Rows can now show icons, images and labels, in both themes.'
      }
    ]
  },
  'Components/ScrollStack': {
    videoUrl: '/assets/videos/scrollstack.webm',
    description: 'Cards pin and stack as you scroll, settling back into a dimmed deck with smooth, jitter-free motion.',
    category: 'Components',
    name: 'ScrollStack',
    docsUrl: 'https://vue-bits.dev/components/scroll-stack',
    tags: [],
    added: '2025-07-15',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with native pinning that never jitters, its own smooth scrolling, snapping and new depth styles. The demo is now a minimal photo deck with presets.'
      }
    ]
  },
  'Components/BubbleMenu': {
    videoUrl: '/assets/videos/bubblemenu.webm',
    description: 'Floating circular expanding menu with staggered item reveal.',
    category: 'Components',
    name: 'BubbleMenu',
    docsUrl: 'https://vue-bits.dev/components/bubble-menu',
    tags: [],
    added: '2025-08-22'
  },
  'Components/MagicBento': {
    videoUrl: '/assets/videos/magicbento.webm',
    description:
      'A bento grid of feature cards with live artwork, edge light that follows the cursor and a click wave.',
    category: 'Components',
    name: 'MagicBento',
    docsUrl: 'https://vue-bits.dev/components/magic-bento',
    tags: [],
    added: '2025-07-13',
    updates: [
      {
        date: '2026-10-12',
        note: 'Redesigned with animated artwork in every card, smoother cursor light and a click wave across the grid. Cards now take your own content, photos and links, with dark and light themes.'
      }
    ]
  },
  'Components/CircularGallery': {
    videoUrl: '/assets/videos/circulargallery.webm',
    description: 'A curved image gallery you can drag, scroll or tab through, with cards that open to the full image.',
    category: 'Components',
    name: 'CircularGallery',
    docsUrl: 'https://vue-bits.dev/components/circular-gallery',
    tags: [],
    added: '2025-02-03',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt with crisp, smooth edges and no extra dependencies. Cards now open to the full image, respond to hover and the keyboard, and the gallery can drift, snap, fade and change shape.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Components/ReflectiveCard': {
    videoUrl: '/assets/videos/reflectivecard.webm',
    description: 'A metal ID card that reflects your camera or a looping video and catches the light as it tilts.',
    category: 'Components',
    name: 'ReflectiveCard',
    docsUrl: 'https://vue-bits.dev/components/reflective-card',
    tags: [],
    added: '2025-12-11',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt as a satin metal card that reflects a looping video until you turn the camera on. It tilts toward the cursor, catches a sweeping light and comes in dark and light themes.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Components/CardNav': {
    videoUrl: '/assets/videos/cardnav.webm',
    description: 'A navigation bar that springs open into a row of cards, each with its own links.',
    category: 'Components',
    name: 'CardNav',
    docsUrl: 'https://vue-bits.dev/components/card-nav',
    tags: [],
    added: '2025-08-16',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt with a springy open, cards that rise, unfold or fade in, sliding link arrows, open on hover, a stacked layout for small screens and a light mode.'
      }
    ]
  },
  'Components/Stack': {
    videoUrl: '/assets/videos/stack.webm',
    description: 'Pile of cards you can drag, flick or click through, with thrown cards tucking underneath.',
    category: 'Components',
    name: 'Stack',
    docsUrl: 'https://vue-bits.dev/components/stack',
    tags: [],
    added: '2024-08-07',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt so cards never jump mid-drag. Throws carry momentum, with four new layouts and keyboard support.'
      }
    ]
  },
  'Components/FluidGlass': {
    videoUrl: '/assets/videos/fluidglass.webm',
    description:
      'A 3D glass object that refracts your headline, image or video, follows the cursor and melts between shapes.',
    category: 'Components',
    name: 'FluidGlass',
    docsUrl: 'https://vue-bits.dev/components/fluid-glass',
    tags: [],
    added: '2025-06-15',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt as a real glass object that bends your own text, image or video, with no 3D models or extra dependencies. Seven shapes that melt into each other on click, plus frost, tint, dispersion and shadows.'
      },
      {
        date: '2026-10-15',
        note: 'Same look with less than half the GPU work. On high refresh rate screens it also draws fewer frames while the glass is at rest.'
      },
      {
        date: '2026-11-08',
        note: 'Prevents resize flicker and ignores font or image loads that finish after unmounting.'
      }
    ]
  },
  'Components/PillNav': {
    videoUrl: '/assets/videos/pillnav.webm',
    description:
      'A pill navigation bar where a fill rises through each link as its label rolls over, with a sliding active dot.',
    category: 'Components',
    name: 'PillNav',
    docsUrl: 'https://vue-bits.dev/components/pill-nav',
    tags: [],
    added: '2025-08-13',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt with a smoother rising fill and rolling labels, a sliding active dot, a gliding pill option, a menu that folds in on small screens, and a light mode.'
      }
    ]
  },
  'Components/TiltedCard': {
    videoUrl: '/assets/videos/tiltedcard.webm',
    description: 'A 3D card that tilts toward the cursor, with glare, a soft shadow, floating layers and a flip side.',
    category: 'Components',
    name: 'TiltedCard',
    docsUrl: 'https://vue-bits.dev/components/tilted-card',
    tags: [],
    added: '2025-01-22',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt with springy motion, glare, a soft shadow and floating depth layers, and no extra dependencies. Cards now flip to a back side, work with touch and phone tilt, and come with album, gallery and ticket demos.'
      },
      { date: '2026-11-08', note: 'Holding Enter or Space now activates the card only once per key press.' }
    ]
  },
  'Components/Masonry': {
    videoUrl: '/assets/videos/masonry.webm',
    description: 'A masonry gallery that springs into place, reflows as it resizes and opens images in a lightbox.',
    category: 'Components',
    name: 'Masonry',
    docsUrl: 'https://vue-bits.dev/components/masonry',
    tags: [],
    added: '2024-08-08',
    updates: [
      {
        date: '2026-10-13',
        note: "Rebuilt with springy reflow, tiles that appear as you scroll, hover zoom, lift and tilt, captions, a lightbox and drag to reorder. Columns now follow the container and tiles keep each image's shape."
      }
    ]
  },
  'Components/GlassSurface': {
    videoUrl: '/assets/videos/glasssurface.webm',
    description: 'Apple-style liquid glass that bends what is behind it, in a rounded panel or any logo shape.',
    category: 'Components',
    name: 'GlassSurface',
    docsUrl: 'https://vue-bits.dev/components/glass-surface',
    tags: [],
    added: '2025-07-19',
    updates: [
      {
        date: '2026-10-10',
        note: 'Turn any SVG logo into glass, and get real refraction in Safari and Firefox by passing in the image behind it. The new demo glass follows your cursor and can be dragged.'
      }
    ]
  },
  'Components/DomeGallery': {
    videoUrl: '/assets/videos/domegallery.webm',
    description: 'Immersive 3D dome gallery projecting images on a hemispheric surface.',
    category: 'Components',
    name: 'DomeGallery',
    docsUrl: 'https://vue-bits.dev/components/dome-gallery',
    tags: [],
    added: '2025-08-29'
  },
  'Components/ChromaGrid': {
    videoUrl: '/assets/videos/chromagrid.webm',
    description: 'A grid of grayscale photo cards where a spotlight follows the cursor and brings back color.',
    category: 'Components',
    name: 'ChromaGrid',
    docsUrl: 'https://vue-bits.dev/components/chroma-grid',
    tags: [],
    added: '2025-05-30',
    updates: [
      {
        date: '2026-10-10',
        note: 'Redesigned with responsive cards in both themes, a smoother color spotlight and borders that light up near the cursor.'
      }
    ]
  },
  'Components/Folder': {
    videoUrl: '/assets/videos/folder.webm',
    description: 'Folder that drops its flap open or swings open like a book, with pages you can pick.',
    category: 'Components',
    name: 'Folder',
    docsUrl: 'https://vue-bits.dev/components/folder',
    tags: [],
    added: '2025-02-28',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt from scratch. It can now also lie flat and open like a book, in solid, glass or matte, and its pages rise under the cursor.'
      }
    ]
  },
  'Components/StaggeredMenu': {
    videoUrl: '/assets/videos/staggeredmenu.webm',
    description: 'Menu with staggered item animations and smooth transitions on open/close.',
    category: 'Components',
    name: 'StaggeredMenu',
    docsUrl: 'https://vue-bits.dev/components/staggered-menu',
    tags: [],
    added: '2025-09-04'
  },
  'Components/ModelViewer': {
    videoUrl: '/assets/videos/modelviewer.webm',
    description: 'A product-style 3D model viewer that frames itself and floats over a soft shadow.',
    category: 'Components',
    name: 'ModelViewer',
    docsUrl: 'https://vue-bits.dev/components/model-viewer',
    tags: [],
    added: '2025-06-13',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with automatic framing, studio lighting, momentum dragging, intros and many new options. New demo models.'
      }
    ]
  },
  'Components/Lanyard': {
    videoUrl: '/assets/videos/lanyard.webm',
    description: 'Swinging 3D badge on a stretchy woven band that you can drag, throw or click to flip.',
    category: 'Components',
    name: 'Lanyard',
    docsUrl: 'https://vue-bits.dev/components/lanyard',
    tags: [],
    added: '2025-02-15',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt with no setup needed. Pass any image and the card swings with real momentum and flips on click.'
      }
    ]
  },
  'Components/ProfileCard': {
    videoUrl: '/assets/videos/profilecard.webm',
    description:
      'A framed profile card that tilts toward the cursor, with holographic foil shining through a tiled pattern.',
    category: 'Components',
    name: 'ProfileCard',
    docsUrl: 'https://vue-bits.dev/components/profile-card',
    tags: [],
    added: '2025-06-01',
    updates: [
      {
        date: '2026-10-10',
        note: 'Redesigned in the Carousel style, with smoother tilt, a light theme and holo that shows only through the pattern.'
      }
    ]
  },
  'Components/Dock': {
    videoUrl: '/assets/videos/dock.webm',
    description: 'macOS style dock with smooth magnification, launch bounce, badges and context menus.',
    category: 'Components',
    name: 'Dock',
    docsUrl: 'https://vue-bits.dev/components/dock',
    tags: [],
    added: '2024-08-08',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt with smoother magnification, a right-click menu, badges, auto hide and placement on any edge.'
      }
    ]
  },
  'Components/GooeyNav': {
    videoUrl: '/assets/videos/gooeynav.webm',
    description: 'A navigation bar whose active pill breaks into goo that flows over to the item you pick.',
    category: 'Components',
    name: 'GooeyNav',
    docsUrl: 'https://vue-bits.dev/components/gooey-nav',
    tags: [],
    added: '2025-03-14',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt so the active pill melts into droplets that flow to the new item, with a light theme, icons and sizes.'
      }
    ]
  },
  'Components/PixelCard': {
    videoUrl: '/assets/videos/pixelcard.webm',
    description: 'A card that fills with twinkling pixels on hover, rippling out from the center or the cursor.',
    category: 'Components',
    name: 'PixelCard',
    docsUrl: 'https://vue-bits.dev/components/pixel-card',
    tags: [],
    added: '2025-01-20',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt with crisp pixels and a glowing reveal wave that can start from the cursor. It can run on hover, click or always on, with an edge fade that keeps card content readable.'
      }
    ]
  },
  'Components/Carousel': {
    videoUrl: '/assets/videos/carousel.webm',
    description:
      'Swipeable cards for feature tours, stories and galleries, with five transitions and an autoplay timer.',
    category: 'Components',
    name: 'Carousel',
    docsUrl: 'https://vue-bits.dev/components/carousel',
    tags: [],
    added: '2025-02-13',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt with momentum swiping, five transitions, photo cards, an autoplay timer and a cleaner frame in both themes.'
      }
    ]
  },
  'Components/SpotlightCard': {
    videoUrl: '/assets/videos/spotlightcard.webm',
    description: 'Card lit by a soft spotlight that follows the pointer, catches its edge and reaches nearby cards.',
    category: 'Components',
    name: 'SpotlightCard',
    docsUrl: 'https://vue-bits.dev/components/spotlight-card',
    tags: [],
    added: '2024-08-14',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt with a smoother light that follows the cursor, glows along the edge and can be shared across a grid.'
      }
    ]
  },
  'Components/BorderGlow': {
    videoUrl: '/assets/videos/borderglow.webm',
    description: 'Glowing mesh-gradient border that follows cursor direction and intensifies near edges.',
    category: 'Components',
    name: 'BorderGlow',
    docsUrl: 'https://vue-bits.dev/components/border-glow',
    tags: [],
    added: '2026-03-17',
    updates: [
      {
        date: '2026-11-08',
        note: 'Stops the intro sweep when disabled or unmounted and prevents overlapping sweeps when restarted.'
      }
    ]
  },
  'Components/FlyingPosters': {
    videoUrl: '/assets/videos/flyingposters.webm',
    description: '3D posters that twist and flip as you scroll or drag through an endless column.',
    category: 'Components',
    name: 'FlyingPosters',
    docsUrl: 'https://vue-bits.dev/components/flying-posters',
    tags: [],
    added: '2025-01-29',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt so it only scrolls when you use it, with optional columns and a camera you can pull back or push in.'
      }
    ]
  },
  'Components/CardSwap': {
    videoUrl: '/assets/videos/cardswap.webm',
    description: 'A 3D stack of cards that sends the front card to the back on a timer, or when you fling it.',
    category: 'Components',
    name: 'CardSwap',
    docsUrl: 'https://vue-bits.dev/components/card-swap',
    tags: [],
    added: '2025-06-02',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with springy swaps you can drag or fling, depth that follows the cursor, cleaner cards in both themes and a layout that fits any container.'
      }
    ]
  },
  'Components/GlassIcons': {
    videoUrl: '/assets/videos/glassicons.webm',
    description: 'Liquid glass icons that bend the color behind them, for app grids, docks and social links.',
    category: 'Components',
    name: 'GlassIcons',
    docsUrl: 'https://vue-bits.dev/components/glass-icons',
    tags: [],
    added: '2025-02-18',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt with real liquid glass that bends light at its edges, a smooth entrance, new card styles and presets.'
      }
    ]
  },
  'Components/DecayCard': {
    videoUrl: '/assets/videos/decaycard.webm',
    description: 'An image card that tears and melts as the pointer moves, then pulls itself back together.',
    category: 'Components',
    name: 'DecayCard',
    docsUrl: 'https://vue-bits.dev/components/decay-card',
    tags: [],
    added: '2024-08-20',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt to run smoother. The decay now shows at normal speeds, spreads evenly and frays gently when idle.'
      }
    ]
  },
  'Components/FlowingMenu': {
    videoUrl: '/assets/videos/flowingmenu.webm',
    description:
      'A full-height menu with a liquid band that glides between rows and reveals a scrolling marquee of each item.',
    category: 'Components',
    name: 'FlowingMenu',
    docsUrl: 'https://vue-bits.dev/components/flowing-menu',
    tags: [],
    added: '2025-01-31',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt around one liquid band that glides and stretches between rows and leans toward the cursor, with an intro sweep. New capsule and slab shapes, an editorial layout, notes per row and keyboard support.'
      }
    ]
  },
  'Components/ElasticSlider': {
    videoUrl: '/assets/videos/elasticslider.webm',
    description:
      'A slider that grows under your cursor and stretches like rubber when pulled past either end, then springs back.',
    category: 'Components',
    name: 'ElasticSlider',
    docsUrl: 'https://vue-bits.dev/components/elastic-slider',
    tags: [],
    added: '2024-08-18',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt with smoother springs and a rubber-band pull at both ends. Adds vertical and pill styles, icons and values inside the track, ticks, a handle, centered fills, and keyboard and scroll control.'
      }
    ]
  },
  'Components/Counter': {
    videoUrl: '/assets/videos/counter.webm',
    description:
      'An odometer-style number whose digits roll to every new value, with currency, separators and locales.',
    category: 'Components',
    name: 'Counter',
    docsUrl: 'https://vue-bits.dev/components/counter',
    tags: [],
    added: '2025-02-15',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt with springy rolling digits, motion blur and a spin-in intro. Formats currency, percentages, separators and locales, and digits slide in and out as the number grows or shrinks.'
      }
    ]
  },
  'Components/InfiniteMenu': {
    videoUrl: '/assets/videos/infinitemenu.webm',
    description: 'A draggable sphere of image tiles that snaps the nearest one forward and shows its title.',
    category: 'Components',
    name: 'InfiniteMenu',
    docsUrl: 'https://vue-bits.dev/components/infinite-menu',
    tags: [],
    added: '2025-01-28',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt to be lighter, with more ways to shape the tiles, autoplay, keyboard support and click to select.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Components/Stepper': {
    videoUrl: '/assets/videos/stepper.webm',
    description:
      'A multi-step flow with a gliding step indicator, spring transitions and horizontal or vertical layouts.',
    category: 'Components',
    name: 'Stepper',
    docsUrl: 'https://vue-bits.dev/components/stepper',
    tags: [],
    added: '2025-02-04',
    updates: [
      {
        date: '2026-10-10',
        note: 'Redesigned with a frosted panel in both themes and smoother transitions. Steps can now show titles, descriptions and icons, with dot, bar and vertical layouts.'
      }
    ]
  },
  'Components/BounceCards': {
    videoUrl: '/assets/videos/bouncecards.webm',
    description: 'A fan of photo cards that bounce in, then spread apart and straighten the one you hover.',
    category: 'Components',
    name: 'BounceCards',
    docsUrl: 'https://vue-bits.dev/components/bounce-cards',
    tags: [],
    added: '2025-01-02',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt on springs, so hovering no longer flickers. The fan is easier to shape and cards can now be clicked.'
      }
    ]
  },
  'Micro/Shredder': {
    videoUrl: '/assets/videos/shredder.webm',
    description: 'A list with a paper shredder at the bottom that cuts dragged rows into curling strips.',
    category: 'Micro',
    name: 'Shredder',
    docsUrl: 'https://vue-bits.dev/micro/shredder',
    tags: ['shredder', 'delete', 'drag', 'list', 'strips', 'paper', 'physics', 'remove'],
    added: '2026-09-22'
  },
  'Micro/PaperCrumple': {
    videoUrl: '/assets/videos/papercrumple.webm',
    description: 'An image that crumples into a textured 3D sheet while you hold and drag it.',
    category: 'Micro',
    name: 'PaperCrumple',
    docsUrl: 'https://vue-bits.dev/micro/paper-crumple',
    tags: ['paper', 'crumple', '3d', 'three', 'image', 'drag', 'hold', 'fold', 'crease'],
    added: '2026-09-20',
    updates: [{ date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }]
  },
  'Micro/TearTicket': {
    videoUrl: '/assets/videos/tearticket.webm',
    description: 'Ticket whose perforated stub tears off by hand, fibre by fibre, and drops away.',
    category: 'Micro',
    name: 'TearTicket',
    docsUrl: 'https://vue-bits.dev/micro/tear-ticket',
    tags: ['ticket', 'tear', 'perforation', 'stub', 'coupon', 'pass', 'drag', 'parallax', 'tilt'],
    added: '2026-09-19'
  },
  'Micro/FlipCard': {
    videoUrl: '/assets/videos/flipcard.webm',
    description: 'Two-faced card that flips in 3D on a click, drag or flick and settles on a spring.',
    category: 'Micro',
    name: 'FlipCard',
    docsUrl: 'https://vue-bits.dev/micro/flip-card',
    tags: ['card', 'flip', '3d', 'tilt', 'drag', 'spring', 'hover', 'two-sided'],
    added: '2026-09-19'
  },
  'Micro/BranchedMenu': {
    videoUrl: '/assets/videos/branchedmenu.webm',
    description: 'Collapsible menu that branches each section from a trunk and traces a line to your pick.',
    category: 'Micro',
    name: 'BranchedMenu',
    docsUrl: 'https://vue-bits.dev/micro/branched-menu',
    tags: ['menu', 'navigation', 'sidebar', 'tree', 'collapsible', 'line', 'active'],
    added: '2026-09-18'
  },
  'Micro/FolderFloat': {
    videoUrl: '/assets/videos/folderfloat.webm',
    description: 'Folder whose notes spring out into a floating cloud when it opens on hover or press.',
    category: 'Micro',
    name: 'FolderFloat',
    docsUrl: 'https://vue-bits.dev/micro/folder-float',
    tags: ['folder', 'menu', 'hover', 'select', 'float', 'spring', 'files'],
    added: '2026-09-18'
  },
  'Micro/RefineFrame': {
    videoUrl: '/assets/videos/refineframe.webm',
    description: 'Media frame that steps an image through generation stages without any layout shift.',
    category: 'Micro',
    name: 'RefineFrame',
    docsUrl: 'https://vue-bits.dev/micro/refine-frame',
    tags: ['ai', 'image', 'generation', 'loading', 'progressive', 'media', 'status'],
    added: '2026-09-18'
  },
  'Micro/ThoughtLine': {
    videoUrl: '/assets/videos/thoughtline.webm',
    description: 'Reasoning trace header with a live clock that folds its steps into one line when done.',
    category: 'Micro',
    name: 'ThoughtLine',
    docsUrl: 'https://vue-bits.dev/micro/thought-line',
    tags: ['ai', 'agent', 'status', 'reasoning', 'timer', 'text', 'trace'],
    added: '2026-09-18'
  },
  'Micro/VoicePill': {
    videoUrl: '/assets/videos/voicepill.webm',
    description: 'Mic button that swells into a capsule of live equalizer bars and a timer while recording.',
    category: 'Micro',
    name: 'VoicePill',
    docsUrl: 'https://vue-bits.dev/micro/voice-pill',
    tags: ['mic', 'voice', 'dictation', 'equalizer', 'press', 'ai'],
    added: '2026-09-18'
  },
  'Micro/SloshGauge': {
    videoUrl: '/assets/videos/sloshgauge.webm',
    description: 'Tank gauge whose liquid chases the value, tilts as it moves and splashes when it fills.',
    category: 'Micro',
    name: 'SloshGauge',
    docsUrl: 'https://vue-bits.dev/micro/slosh-gauge',
    tags: ['gauge', 'meter', 'progress', 'liquid', 'spring', 'physics', 'slider'],
    added: '2026-09-18'
  },
  'Micro/PromptBar': {
    videoUrl: '/assets/videos/promptbar.webm',
    description: 'Chat composer with @ sources, / commands, a model picker, dictation and attachments.',
    category: 'Micro',
    name: 'PromptBar',
    docsUrl: 'https://vue-bits.dev/micro/prompt-bar',
    tags: ['composer', 'prompt', 'chat', 'ai', 'input', 'send', 'stop', 'menu', 'mention', 'command'],
    added: '2026-09-18',
    updates: [{ date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }]
  },
  'Micro/SwipeToast': {
    videoUrl: '/assets/videos/swipetoast.webm',
    description: 'Toast that swipes down to dismiss and burns a thin fuse for its remaining time.',
    category: 'Micro',
    name: 'SwipeToast',
    docsUrl: 'https://vue-bits.dev/micro/swipe-toast',
    tags: ['toast', 'notification', 'swipe', 'drag', 'timer', 'undo'],
    added: '2026-09-18'
  },
  'Micro/SlingButton': {
    videoUrl: '/assets/videos/slingbutton.webm',
    description: 'Send button you pull back like a slingshot and release to fire.',
    category: 'Micro',
    name: 'SlingButton',
    docsUrl: 'https://vue-bits.dev/micro/sling-button',
    tags: ['button', 'send', 'slingshot', 'drag', 'gesture', 'spring'],
    added: '2026-09-18'
  },
  'Micro/BellToggle': {
    videoUrl: '/assets/videos/belltoggle.webm',
    description: 'Pill toggle where a press rings the bell, crossfades the label and unfurls the pill.',
    category: 'Micro',
    name: 'BellToggle',
    docsUrl: 'https://vue-bits.dev/micro/bell-toggle',
    tags: ['toggle', 'button', 'bell', 'notify', 'press', 'spring'],
    added: '2026-09-18'
  },
  'Micro/CallChip': {
    videoUrl: '/assets/videos/callchip.webm',
    description: 'Tool-call chip whose fill wipes across as a live timer ticks, ending green or shaking red.',
    category: 'Micro',
    name: 'CallChip',
    docsUrl: 'https://vue-bits.dev/micro/call-chip',
    tags: ['chip', 'status', 'ai', 'agent', 'tool-call', 'progress', 'timer'],
    added: '2026-09-18'
  },
  'Micro/StatusMark': {
    videoUrl: '/assets/videos/statusmark.webm',
    description: 'Agent task status glyph that morphs from an idle ring to a progress arc, then a check.',
    category: 'Micro',
    name: 'StatusMark',
    docsUrl: 'https://vue-bits.dev/micro/status-mark',
    tags: ['status', 'progress', 'spinner', 'check', 'ai', 'agent', 'task', 'svg'],
    added: '2026-09-18'
  },
  'Micro/GlideSelect': {
    videoUrl: '/assets/videos/glideselect.webm',
    description: 'Select chip whose menu pops from its corner and whose highlight glides between rows.',
    category: 'Micro',
    name: 'GlideSelect',
    docsUrl: 'https://vue-bits.dev/micro/glide-select',
    tags: ['select', 'dropdown', 'menu', 'popover', 'hover', 'form', 'keyboard'],
    added: '2026-09-18'
  },
  'Micro/SwipeRow': {
    videoUrl: '/assets/videos/swiperow.webm',
    description: 'List row that swipes open to reveal actions and deletes on a full swipe.',
    category: 'Micro',
    name: 'SwipeRow',
    docsUrl: 'https://vue-bits.dev/micro/swipe-row',
    tags: ['swipe', 'list', 'gesture', 'delete', 'drag'],
    added: '2026-09-18'
  },
  'Micro/JellyRadio': {
    videoUrl: '/assets/videos/jellyradio.webm',
    description: 'Radio group of chips where the chosen one swells and barges its neighbours outward.',
    category: 'Micro',
    name: 'JellyRadio',
    docsUrl: 'https://vue-bits.dev/micro/jelly-radio',
    tags: ['radio', 'select', 'chips', 'spring', 'form', 'segmented'],
    added: '2026-09-18'
  },
  'Micro/CometDial': {
    videoUrl: '/assets/videos/cometdial.webm',
    description: 'Tick-ring dial you flick by angle, with a comet that streaks behind the lit head.',
    category: 'Micro',
    name: 'CometDial',
    docsUrl: 'https://vue-bits.dev/micro/comet-dial',
    tags: ['dial', 'knob', 'gauge', 'drag', 'spring', 'input'],
    added: '2026-09-18'
  },
  'Micro/WakeSlider': {
    videoUrl: '/assets/videos/wakeslider.webm',
    description: 'Thumbless range slider of thin bars where drag speed raises a wake behind the handle.',
    category: 'Micro',
    name: 'WakeSlider',
    docsUrl: 'https://vue-bits.dev/micro/wake-slider',
    tags: ['slider', 'range', 'input', 'drag', 'bars', 'velocity'],
    added: '2026-09-18'
  },
  'Micro/CodeSlots': {
    videoUrl: '/assets/videos/codeslots.webm',
    description: 'One-time code input whose digits spring into their slots, with paste and SMS autofill.',
    category: 'Micro',
    name: 'CodeSlots',
    docsUrl: 'https://vue-bits.dev/micro/code-slots',
    tags: ['input', 'otp', 'form', 'spring', 'code'],
    added: '2026-09-18'
  },
  'Micro/DodgeField': {
    videoUrl: '/assets/videos/dodgefield.webm',
    description: 'Wrapper that makes any child dodge the pointer until it relents and glides home.',
    category: 'Micro',
    name: 'DodgeField',
    docsUrl: 'https://vue-bits.dev/micro/dodge-field',
    tags: ['hover', 'pointer', 'playful', 'wrapper', 'button', 'magnet'],
    added: '2026-09-18'
  },
  'Micro/LatticeLoader': {
    videoUrl: '/assets/videos/latticeloader.webm',
    description: 'Agent status row with a lattice of cells that brighten in a wave beside a live stopwatch.',
    category: 'Micro',
    name: 'LatticeLoader',
    docsUrl: 'https://vue-bits.dev/micro/lattice-loader',
    tags: ['loader', 'status', 'ai', 'agent', 'timer', 'grid'],
    added: '2026-09-18'
  },
  'Micro/ScrubField': {
    videoUrl: '/assets/videos/scrubfield.webm',
    description: 'Number chip you drag to scrub, with rubber-band limits and click to type.',
    category: 'Micro',
    name: 'ScrubField',
    docsUrl: 'https://vue-bits.dev/micro/scrub-field',
    tags: ['input', 'number', 'drag', 'scrub', 'form', 'inspector'],
    added: '2026-09-18'
  },
  'Micro/FuseButton': {
    videoUrl: '/assets/videos/fusebutton.webm',
    description: 'Action button whose done state carries an undo on a burning fuse.',
    category: 'Micro',
    name: 'FuseButton',
    docsUrl: 'https://vue-bits.dev/micro/fuse-button',
    tags: ['button', 'undo', 'confirm', 'timer', 'press', 'fuse'],
    added: '2026-09-18'
  },
  'Micro/WarmTooltip': {
    videoUrl: '/assets/videos/warmtooltip.webm',
    description: 'Tooltip group where the first label waits, then its siblings open instantly while warm.',
    category: 'Micro',
    name: 'WarmTooltip',
    docsUrl: 'https://vue-bits.dev/micro/warm-tooltip',
    tags: ['tooltip', 'hover', 'toolbar', 'delay', 'group', 'label'],
    added: '2026-09-18'
  },
  'Micro/SlideCommit': {
    videoUrl: '/assets/videos/slidecommit.webm',
    description: 'Slide-to-confirm handle that spins while your action runs and unfurls into a done pill.',
    category: 'Micro',
    name: 'SlideCommit',
    docsUrl: 'https://vue-bits.dev/micro/slide-commit',
    tags: ['slide', 'confirm', 'async', 'gesture', 'drag', 'button'],
    added: '2026-09-18'
  },
  'Micro/RubberSegment': {
    videoUrl: '/assets/videos/rubbersegment.webm',
    description: 'Segmented control whose rubber thumb stretches across the gap and squashes into place.',
    category: 'Micro',
    name: 'RubberSegment',
    docsUrl: 'https://vue-bits.dev/micro/rubber-segment',
    tags: ['segmented', 'tabs', 'drag', 'spring', 'clip-path', 'radio'],
    added: '2026-09-18'
  },
  'Micro/PulseHeart': {
    videoUrl: '/assets/videos/pulseheart.webm',
    description: 'Like button that contracts to a dot, flips colour and pulses back as the count ticks over.',
    category: 'Micro',
    name: 'PulseHeart',
    docsUrl: 'https://vue-bits.dev/micro/pulse-heart',
    tags: ['like', 'heart', 'button', 'reaction', 'counter', 'press'],
    added: '2026-09-18'
  },
  'Micro/SpringCheck': {
    videoUrl: '/assets/videos/springcheck.webm',
    description: 'Checkbox row where one spring fills the box, draws the tick and strikes through the label.',
    category: 'Micro',
    name: 'SpringCheck',
    docsUrl: 'https://vue-bits.dev/micro/spring-check',
    tags: ['checkbox', 'toggle', 'form', 'spring', 'press', 'strikethrough'],
    added: '2026-09-18'
  },
  'Micro/PeekRating': {
    videoUrl: '/assets/videos/peekrating.webm',
    description: 'Star rating that lifts a wave of stars up to the pointer, then commits with a pop on click.',
    category: 'Micro',
    name: 'PeekRating',
    docsUrl: 'https://vue-bits.dev/micro/peek-rating',
    tags: ['rating', 'stars', 'hover', 'preview', 'feedback', 'form'],
    added: '2026-09-18'
  },
  'Micro/HoldButton': {
    videoUrl: '/assets/videos/holdbutton.webm',
    description: 'Hold-to-confirm button whose liquid fill rises while pressed and snaps back if you let go.',
    category: 'Micro',
    name: 'HoldButton',
    docsUrl: 'https://vue-bits.dev/micro/hold-button',
    tags: ['button', 'confirm', 'hold', 'press', 'destructive'],
    added: '2026-09-18'
  },
  'Micro/SquishSwitch': {
    videoUrl: '/assets/videos/squishswitch.webm',
    description: 'Switch whose thumb stretches with speed and squashes against the end when you flick it.',
    category: 'Micro',
    name: 'SquishSwitch',
    docsUrl: 'https://vue-bits.dev/micro/squish-switch',
    tags: ['switch', 'toggle', 'spring', 'drag', 'gesture', 'form'],
    added: '2026-09-18'
  },
  'Backgrounds/HoloMosaic': {
    videoUrl: '/assets/videos/holomosaic.webm',
    description:
      'Holographic tiles that split light into sweeping color as it moves, with glitter, a flip-in intro and click waves.',
    category: 'Backgrounds',
    name: 'HoloMosaic',
    docsUrl: 'https://vue-bits.dev/backgrounds/holo-mosaic',
    tags: [],
    added: '2026-11-16'
  },
  'Backgrounds/GradientASCII': {
    videoUrl: '/assets/videos/gradientascii.webm',
    description: 'Soft gradient glows drawn in ASCII characters that scramble under the cursor.',
    category: 'Backgrounds',
    name: 'GradientASCII',
    docsUrl: 'https://vue-bits.dev/backgrounds/gradient-ascii',
    tags: [],
    added: '2026-10-15',
    updates: [{ date: '2026-11-10', note: 'Loads without freezing the page while its effect starts up.' }]
  },
  'Backgrounds/FluxLines': {
    videoUrl: '/assets/videos/fluxlines.webm',
    description: 'Glowing flux lines tracing a churning magnetic fluid. The cursor magnet reveals and curls them.',
    category: 'Backgrounds',
    name: 'FluxLines',
    docsUrl: 'https://vue-bits.dev/backgrounds/flux-lines',
    tags: ['webgl', 'lines', 'flow', 'glow', 'magnetic', 'interactive'],
    added: '2026-10-11',
    updates: [
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/PatternWaves': {
    videoUrl: '/assets/videos/patternwaves.webm',
    description: 'A lit halftone surface of dots, lines or glyphs that moves like draped silk.',
    category: 'Backgrounds',
    name: 'PatternWaves',
    docsUrl: 'https://vue-bits.dev/backgrounds/pattern-waves',
    tags: ['webgl', 'ogl', 'halftone', 'pattern', 'waves', 'ascii', 'interactive', 'procedural'],
    added: '2026-09-30',
    updates: [{ date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }]
  },
  'Backgrounds/MicroSlats': {
    videoUrl: '/assets/videos/microslats.webm',
    description: 'A wall of tiny slats that becomes a rolling sea in perspective, with glinting crests.',
    category: 'Backgrounds',
    name: 'MicroSlats',
    docsUrl: 'https://vue-bits.dev/backgrounds/micro-slats',
    tags: ['webgl', 'ogl', 'grid', 'waves', 'interactive', 'procedural'],
    added: '2026-09-27',
    updates: [{ date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }]
  },
  'Backgrounds/ShapeWaves': {
    videoUrl: '/assets/videos/shapewaves.webm',
    description: 'A field of triangles, circles and squares that brighten and grow along rolling waves.',
    category: 'Backgrounds',
    name: 'ShapeWaves',
    docsUrl: 'https://vue-bits.dev/backgrounds/shape-waves',
    tags: ['webgpu', 'vgpu', 'grid', 'shapes', 'text', 'procedural'],
    added: '2026-09-15',
    updates: [{ date: '2026-10-06', note: 'Centered text cutouts using actual glyph bounds.' }]
  },
  'Backgrounds/AeroShards': {
    videoUrl: '/assets/videos/aeroshards.webm',
    description:
      'Silk ribbons of thick glass shards streaming on layered depths among survey markers, catching light along their edges.',
    category: 'Backgrounds',
    name: 'AeroShards',
    docsUrl: 'https://vue-bits.dev/backgrounds/aero-shards',
    tags: ['webgpu', 'vgpu', 'particles', 'procedural', 'post-processing', 'interactive'],
    added: '2026-08-31',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt as silk ribbons of thick glass shards that stream smoothly on layered depths, light up along their edges and soften into the distance. Adds a chrome finish, survey markers, a cursor that parts the shards, a light wave on click, presets and an edge fade.'
      },
      { date: '2026-11-10', note: 'Starts up several times faster without blocking the page.' }
    ]
  },
  'Backgrounds/GhostFibers': {
    videoUrl: '/assets/videos/ghostfibers.webm',
    description: 'Layered ribbons of fine glowing fibers that twist, fold and drift through soft depth of field.',
    category: 'Backgrounds',
    name: 'GhostFibers',
    docsUrl: 'https://vue-bits.dev/backgrounds/ghost-fibers',
    tags: [],
    added: '2026-08-29',
    updates: [
      {
        date: '2026-10-09',
        note: 'Sharper fibers with crisp cores and a cleaner glow, plus a light mode that matches the dark one.'
      },
      {
        date: '2026-10-14',
        note: 'Rebuilt as layered ribbons of fine glowing fibers with soft depth of field, bright folds and new looks to pick from.'
      }
    ]
  },
  'Backgrounds/CRTWarp': {
    videoUrl: '/assets/videos/crtwarp.webm',
    description:
      'A blocky plasma glowing on a curved CRT, with real scanlines, a phosphor mask, afterglow and a power-on intro.',
    category: 'Backgrounds',
    name: 'CRTWarp',
    docsUrl: 'https://vue-bits.dev/backgrounds/crt-warp',
    tags: [],
    added: '2026-08-26',
    updates: [
      {
        date: '2026-10-13',
        note: 'Rebuilt as a real CRT that warms up into view, with true scanlines, phosphor masks, afterglow and bloom. The cursor bends the picture like a magnet, clicks flip the channel, and presets add amber, green and arcade looks.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/MoltenMetal': {
    videoUrl: '/assets/videos/moltenmetal.webm',
    description: 'Swirling caustic filaments with white-hot cores that heat up under the cursor and flare on click.',
    category: 'Backgrounds',
    name: 'MoltenMetal',
    docsUrl: 'https://vue-bits.dev/backgrounds/molten-metal',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'The metal now ignites from its white-hot cores, the cursor heats the filaments it passes and clicks flare them white-hot. Adds filament width, haze, rotation and position controls, more colors, crisper fine detail, a richer light mode and no dependencies.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/GradientWaves': {
    videoUrl: '/assets/videos/gradientwaves.webm',
    description:
      'Lit satin waves rolling in from a hazy horizon, with a light that follows the cursor and swells on click.',
    category: 'Backgrounds',
    name: 'GradientWaves',
    docsUrl: 'https://vue-bits.dev/backgrounds/gradient-waves',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Waves are now lit with soft light and shadow, rise from calm water on load, catch a light that follows the cursor and roll a swell in on click. Adds light direction, presets, a light mode and no dependencies.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/WebThreads': {
    videoUrl: '/assets/videos/webthreads.webm',
    description:
      'Glowing threads woven through luminous pinch points that light up under the cursor and carry light on click.',
    category: 'Backgrounds',
    name: 'WebThreads',
    docsUrl: 'https://vue-bits.dev/backgrounds/web-threads',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-13',
        note: 'Threads now draw in one after another, the strand under the cursor lights up while the rest recede, and clicks send light into the pinch. Adds braids, a 3D twist, traveling pulses, rotation, soft ends, more threads and colors, and a cleaner light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/Topography': {
    videoUrl: '/assets/videos/topography.webm',
    description:
      'A 3D landscape drawn in glowing contour lines that rises under the cursor, with light pulses on click.',
    category: 'Backgrounds',
    name: 'Topography',
    docsUrl: 'https://vue-bits.dev/backgrounds/topography',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt as a 3D landscape of glowing contour lines that rises from a flat map, with land that lifts under the cursor, click pulses, optional survey markers and glitches, and a light mode.'
      },
      { date: '2026-11-10', note: 'Loads without freezing the page and recovers after a graphics reset.' }
    ]
  },
  'Backgrounds/LightTunnel': {
    videoUrl: '/assets/videos/lighttunnel.webm',
    description: 'A swirling fibre-optic tunnel where comets of light race into depth, steered by the cursor.',
    category: 'Backgrounds',
    name: 'LightTunnel',
    docsUrl: 'https://vue-bits.dev/backgrounds/light-tunnel',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-11',
        note: 'Redesigned with fine glowing fibres and comet-like pulses, and no extra dependencies. The cursor steers the tunnel, a click sends a ring of light down it, and light mode draws it in ink.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/SlicedWaves': {
    videoUrl: '/assets/videos/slicedwaves.webm',
    description: 'Waves of colored light sliced into glowing bars, seen in depth with a focus that follows the cursor.',
    category: 'Backgrounds',
    name: 'SlicedWaves',
    docsUrl: 'https://vue-bits.dev/backgrounds/sliced-waves',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt as waves of light sliced into glowing bars, seen in depth with a focus that follows the cursor.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/AcidSquares': {
    videoUrl: '/assets/videos/acidsquares.webm',
    description: 'A rolling field of glossy squares that ripples under two drifting colored lights.',
    category: 'Backgrounds',
    name: 'AcidSquares',
    docsUrl: 'https://vue-bits.dev/backgrounds/acid-squares',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-09',
        note: 'Crisp glass edges, travelling rings of light and twinkling squares, plus a clean light mode.'
      },
      {
        date: '2026-10-14',
        note: 'Rebuilt as a rolling field of glossy squares under two drifting colored lights, with square ripples, film grain and an intro that switches the squares on from the center.'
      }
    ]
  },
  'Backgrounds/Scanner': {
    videoUrl: '/assets/videos/scanner.webm',
    description: 'Glowing interference lines swept by a scan beam, with a CRT finish, cursor lensing and click pings.',
    category: 'Backgrounds',
    name: 'Scanner',
    docsUrl: 'https://vue-bits.dev/backgrounds/scanner',
    tags: [],
    added: '2026-08-04',
    updates: [
      {
        date: '2026-10-12',
        note: 'Crisper glowing lines and a scan head with an afterglow trail, plus lines that part around the cursor, click pings, a power-on intro and a light mode.'
      },
      { date: '2026-11-13', note: 'Fixed a blank canvas (lost WebGL context) when the component remounts quickly.' }
    ]
  },
  'Backgrounds/Ferrofluid': {
    videoUrl: '/assets/videos/ferrofluid.webm',
    description: 'A glossy sea of magnetic fluid where swells of spikes roll in and the cursor raises a crown.',
    category: 'Backgrounds',
    name: 'Ferrofluid',
    docsUrl: 'https://vue-bits.dev/backgrounds/ferrofluid',
    tags: [],
    added: '2026-06-02',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt as a glossy ferrofluid sea with no extra dependencies. Swells of spikes roll across it, the cursor raises a crown and clicks send out a ring of spikes.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/Lightfall': {
    videoUrl: '/assets/videos/lightfall.webm',
    description:
      'Streaks of light falling down a curved tunnel, bending around the cursor and stretching into warp trails on hold.',
    category: 'Backgrounds',
    name: 'Lightfall',
    docsUrl: 'https://vue-bits.dev/backgrounds/lightfall',
    tags: [],
    added: '2026-06-02',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt with crisp, steady streaks and round glowing heads. The light now warps in on load, bends around the cursor and stretches into warp trails while you hold.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/LiquidEther': {
    videoUrl: '/assets/videos/liquidether.webm',
    description: 'A glowing liquid that swirls under the cursor, colored by how fast it flows.',
    category: 'Backgrounds',
    name: 'LiquidEther',
    docsUrl: 'https://vue-bits.dev/backgrounds/liquid-ether',
    tags: [],
    added: '2025-09-05',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt with smoother, glowing swirls, a sweeping intro and puffs on click. Runs several times faster and adds presets and a light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/Prism': {
    videoUrl: '/assets/videos/prism.webm',
    description: 'Rotating prism of glowing spectral light with configurable shape, colors and motion.',
    category: 'Backgrounds',
    name: 'Prism',
    docsUrl: 'https://vue-bits.dev/backgrounds/prism',
    tags: [],
    added: '2025-08-20',
    updates: [
      {
        date: '2026-10-12',
        note: 'Same glowing prism, now several times faster with no extra dependencies. It tilts toward the cursor, fades in, takes custom colors, and has a cleaner light mode and a working 3D rotation.'
      },
      { date: '2026-11-10', note: 'No longer stays blank when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/DarkVeil': {
    videoUrl: '/assets/videos/darkveil.webm',
    description: 'A silky veil of light that drifts in the dark and bends around the cursor.',
    category: 'Backgrounds',
    name: 'DarkVeil',
    docsUrl: 'https://vue-bits.dev/backgrounds/dark-veil',
    tags: [],
    added: '2025-07-16',
    updates: [
      {
        date: '2026-10-10',
        note: 'Now reacts to the cursor, with a soft glow, any color and new shapes. Faster, and refined in light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/LightPillar': {
    videoUrl: '/assets/videos/lightpillar.webm',
    description: 'A swirling pillar of light that ignites on load, leans toward the cursor and surges on click.',
    category: 'Backgrounds',
    name: 'LightPillar',
    docsUrl: 'https://vue-bits.dev/backgrounds/light-pillar',
    tags: [],
    added: '2025-12-03',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt to run about four times faster with the same look. It now ignites on load, follows the cursor, surges on click and has a soft glow, presets and more controls.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/Antigravity': {
    videoUrl: '/assets/videos/antigravity.webm',
    description: 'A field of particles that lifts into a glowing ring around the cursor and bursts outward on click.',
    category: 'Backgrounds',
    name: 'Antigravity',
    docsUrl: 'https://vue-bits.dev/backgrounds/antigravity',
    tags: [],
    added: '2025-12-08',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt with crisp, colorful particles that swirl into a ring with springy motion and streak when they move fast. Hold to charge and release to burst, plus presets, a liftoff intro and a light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      {
        date: '2026-11-10',
        note: 'Loads without freezing the page while its effect starts up, and frees graphics memory when removed.'
      }
    ]
  },
  'Backgrounds/Silk': {
    videoUrl: '/assets/videos/silk.webm',
    description: 'Flowing satin folds with glossy highlights that turn toward the cursor and ripple on click.',
    category: 'Backgrounds',
    name: 'Silk',
    docsUrl: 'https://vue-bits.dev/backgrounds/silk',
    tags: [],
    added: '2025-05-22',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt on the same folds with deeper shading, glossy satin highlights and a soft glow. The light follows the cursor, clicks ripple through the fabric, and the folds rise in on load.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/FloatingLines': {
    videoUrl: '/assets/videos/floatinglines.webm',
    description: 'Ribbons of fine glowing lines that drift in waves, part around the cursor and curl when clicked.',
    category: 'Backgrounds',
    name: 'FloatingLines',
    docsUrl: 'https://vue-bits.dev/backgrounds/floating-lines',
    tags: [],
    added: '2025-11-14',
    updates: [
      {
        date: '2026-10-11',
        note: 'Redrawn with crisp, finely glowing lines and no extra dependencies. The lines part smoothly around the cursor, curl when clicked, and come in dotted and dashed styles with a clean ink light mode.'
      },
      { date: '2026-11-10', note: 'Loads without freezing the page and frees graphics memory when removed.' }
    ]
  },
  'Backgrounds/SideRays': {
    videoUrl: '/assets/videos/siderays.webm',
    description: 'Shafts of light that fan in from a corner or side, shimmer slowly and lean toward the cursor.',
    category: 'Backgrounds',
    name: 'SideRays',
    docsUrl: 'https://vue-bits.dev/backgrounds/side-rays',
    tags: [],
    added: '2026-06-02',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt with soft, shimmering light shafts that grow in from the corner and lean toward the cursor. Adds presets, side origins, drifting dust and a light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/LightRays': {
    videoUrl: '/assets/videos/lightrays.webm',
    description:
      'Volumetric light rays from any edge, with source glow and haze. The cursor steers the beam and casts a shadow.',
    category: 'Backgrounds',
    name: 'LightRays',
    docsUrl: 'https://vue-bits.dev/backgrounds/light-rays',
    tags: [],
    added: '2025-07-21',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt on the same rays with a glowing source, drifting haze and crisper shafts, at a fraction of the cost. The cursor now casts a soft shadow and clicks send a wave of light down the beam.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/PixelBlast': {
    videoUrl: '/assets/videos/pixelblast.webm',
    description:
      'Dithered pixel clouds that drift, shimmer and light up under the cursor, with ripples, shapes and a perspective floor.',
    category: 'Backgrounds',
    name: 'PixelBlast',
    docsUrl: 'https://vue-bits.dev/backgrounds/pixel-blast',
    tags: [],
    added: '2025-08-31',
    updates: [
      {
        date: '2026-10-12',
        note: 'Same pixel clouds, now smoother and softer, with drift, shimmer, glow, an accent color, a blast intro and a cursor that lights pixels up. New shapes and a perspective floor, much faster, no dependencies.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/ColorBends': {
    videoUrl: '/assets/videos/colorbends.webm',
    description: 'Vibrant color bends with smooth flowing animation.',
    category: 'Backgrounds',
    name: 'ColorBends',
    docsUrl: 'https://vue-bits.dev/backgrounds/color-bends',
    tags: [],
    added: '2025-10-27',
    updates: [
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      {
        date: '2026-11-10',
        note: 'Settings now update without restarting the animation, the full warp range draws, and it pauses while off screen.'
      }
    ]
  },
  'Backgrounds/LineWaves': {
    videoUrl: '/assets/videos/linewaves.webm',
    description: 'Fine lines that flow in silky waves while a band of light drifts through them.',
    category: 'Backgrounds',
    name: 'LineWaves',
    docsUrl: 'https://vue-bits.dev/backgrounds/line-waves',
    tags: [],
    added: '2026-03-17',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt with crisp, smoothly flowing lines and a soft band of light that drifts through them. Adds presets, a cursor spotlight, click ripples and a light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/Radar': {
    videoUrl: '/assets/videos/radar.webm',
    description: 'A radar scope whose sweep leaves a phosphor afterglow and picks up moving contacts.',
    category: 'Backgrounds',
    name: 'Radar',
    docsUrl: 'https://vue-bits.dev/backgrounds/radar',
    tags: [],
    added: '2026-03-17',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt as a detailed radar scope with a glowing sweep, contacts that ping and fade, a sonar mode and a tilted floor view.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/SoftAurora': {
    videoUrl: '/assets/videos/softaurora.webm',
    description: 'Soft aurora borealis shader with 3D Perlin noise and cosine gradient palettes.',
    category: 'Backgrounds',
    name: 'SoftAurora',
    docsUrl: 'https://vue-bits.dev/backgrounds/soft-aurora',
    tags: [],
    added: '2026-03-17',
    updates: [
      {
        date: '2026-10-12',
        note: 'The band now reaches toward a nearby cursor, clicks send a pulse of light along it, and it blooms in from a thin line. New presets, a tilt and a cleaner light mode, with no extra dependencies.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/MagicRings': {
    videoUrl: '/assets/videos/magicrings.webm',
    description: 'Glowing rings that pulse outward in a wave, swell toward the cursor and flare on click.',
    category: 'Backgrounds',
    name: 'MagicRings',
    docsUrl: 'https://vue-bits.dev/backgrounds/magic-rings',
    tags: [],
    added: '2026-03-11',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt from scratch and moved to Backgrounds, lighter and about three times faster, with crisper lines and glow. Rings can now ripple, breathe, spin or lean in 3D, react to hover and clicks, split into prism fringes, and work in light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      {
        date: '2026-11-10',
        note: 'Loads without freezing the page, switches looks without stalling and frees graphics memory when removed.'
      }
    ]
  },
  'Backgrounds/Aurora': {
    videoUrl: '/assets/videos/aurora.webm',
    description: 'A soft, calm aurora that flows across the top of the page and drifts toward the cursor.',
    category: 'Backgrounds',
    name: 'Aurora',
    docsUrl: 'https://vue-bits.dev/backgrounds/aurora',
    tags: [],
    added: '2025-02-05',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt with smoother, richer color blending and a softer edge that never bands. It reaches gently toward the cursor, fades in on load, and can rise from the bottom or stack extra layers.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/Plasma': {
    videoUrl: '/assets/videos/plasma.webm',
    description: 'Folds of satin light twisting slowly through the dark, turning to follow the cursor.',
    category: 'Backgrounds',
    name: 'Plasma',
    docsUrl: 'https://vue-bits.dev/backgrounds/plasma',
    tags: [],
    added: '2025-08-18',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt as soft folds of satin light with bright highlights, a cursor that turns them in 3D and a new light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/PlasmaWave': {
    videoUrl: '/assets/videos/plasmawave.webm',
    description: 'Two ribbons of plasma curling through each other, with soft glow and white-hot cores.',
    category: 'Backgrounds',
    name: 'PlasmaWave',
    docsUrl: 'https://vue-bits.dev/backgrounds/plasma-wave',
    tags: [],
    added: '2026-04-14',
    updates: [
      {
        date: '2026-10-10',
        note: 'Smoother, faster plasma with soft glow, white-hot cores and a cursor that stirs it, plus a new light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/Particles': {
    videoUrl: '/assets/videos/particles.webm',
    description: 'A drifting 3D field of particles with glow, twinkle, constellation lines and cursor interaction.',
    category: 'Backgrounds',
    name: 'Particles',
    docsUrl: 'https://vue-bits.dev/backgrounds/particles',
    tags: [],
    added: '2025-02-10',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt with the same floating motion, now crisp and far faster with thousands of particles. New shapes, glow, twinkle, bokeh, constellation lines, drifting and cursor effects.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/GradientBlinds': {
    videoUrl: '/assets/videos/gradientblinds.webm',
    description:
      'Satin gradient blinds lit by a spotlight that follows the cursor, swaying and turning toward the light.',
    category: 'Backgrounds',
    name: 'GradientBlinds',
    docsUrl: 'https://vue-bits.dev/backgrounds/gradient-blinds',
    tags: [],
    added: '2025-08-23',
    updates: [
      {
        date: '2026-10-12',
        note: 'Same blinds with satin shading that turns with the light, a soft glow, a gentle sway and a cleaner light mode. A click sends a wave of light through them, with no extra dependencies.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/Grainient': {
    videoUrl: '/assets/videos/grainient.webm',
    description: 'Flowing grainy gradients you can stir with the cursor.',
    category: 'Backgrounds',
    name: 'Grainient',
    docsUrl: 'https://vue-bits.dev/backgrounds/grainient',
    tags: [],
    added: '2026-02-03',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt with richer colors, flowing waves and no extra dependencies. Drag the colors around or click to swirl them, and try stripes, rings, crisp poster edges or a satin sheen.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/GridScan': {
    videoUrl: '/assets/videos/gridscan.webm',
    description: 'A 3D grid room swept by a scanning light that follows your view.',
    category: 'Backgrounds',
    name: 'GridScan',
    docsUrl: 'https://vue-bits.dev/backgrounds/grid-scan',
    tags: [],
    added: '2025-11-03',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt as a lit 3D room with crisp lines, a glossy floor and sparkling scan points, with no extra dependencies. The view shifts like a window as you move, and clicks send a ping across the walls.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/Beams': {
    videoUrl: '/assets/videos/beams.webm',
    description: 'Glossy ribbons that ripple in the dark and catch the light, which follows your cursor.',
    category: 'Backgrounds',
    name: 'Beams',
    docsUrl: 'https://vue-bits.dev/backgrounds/beams',
    tags: [],
    added: '2025-05-27',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with brighter, glowing glints, a light that follows the cursor, a light theme and simpler controls, with no 3D library needed.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/PixelSnow': {
    videoUrl: '/assets/videos/pixelsnow.webm',
    description: 'Pixel-art snowflakes drifting down in layers of depth, brushed aside by the cursor.',
    category: 'Backgrounds',
    name: 'PixelSnow',
    docsUrl: 'https://vue-bits.dev/backgrounds/pixel-snow',
    tags: [],
    added: '2025-12-20',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with crisp pixel-art flakes in layers of depth, a soft glow, wind and cursor play, snow that can pile up, and a light mode.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/Lightning': {
    videoUrl: '/assets/videos/lightning.webm',
    description: 'Crackling, branching lightning that bends toward the cursor and strikes wherever you click.',
    category: 'Backgrounds',
    name: 'Lightning',
    docsUrl: 'https://vue-bits.dev/backgrounds/lightning',
    tags: [],
    added: '2025-02-25',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with cleaner bolts that loop seamlessly, more options, a light mode, and strikes that land where you click.'
      }
    ]
  },
  'Backgrounds/PrismaticBurst': {
    videoUrl: '/assets/videos/prismaticburst.webm',
    description:
      'A burst of prismatic light rays that leans toward the cursor and sends a wave of light outward on click.',
    category: 'Backgrounds',
    name: 'PrismaticBurst',
    docsUrl: 'https://vue-bits.dev/backgrounds/prismatic-burst',
    tags: [],
    added: '2025-08-26',
    updates: [
      {
        date: '2026-10-11',
        note: 'Runs up to four times faster with the same look, and adds spirals, flowing color and finer control over the rays. The burst now ignites on load, leans toward the cursor and sends a wave of light outward on click.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/Galaxy': {
    videoUrl: '/assets/videos/galaxy.webm',
    description: 'Endless flight through a twinkling starfield with warp jumps, cursor repulsion and star palettes.',
    category: 'Backgrounds',
    name: 'Galaxy',
    docsUrl: 'https://vue-bits.dev/backgrounds/galaxy',
    tags: [],
    added: '2025-07-20',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt with no extra dependencies. Stars now glide away from the cursor, a click jumps to warp speed and it arrives from hyperspace. New star colors, flares, depth and a cleaner light mode.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/Dither': {
    videoUrl: '/assets/videos/dither.webm',
    description: 'Retro dithered waves with Bayer, halftone, line and noise patterns, palettes and cursor trails.',
    category: 'Backgrounds',
    name: 'Dither',
    docsUrl: 'https://vue-bits.dev/backgrounds/dither',
    tags: [],
    added: '2025-02-19',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt on the same waves with crisp pixels and no extra dependencies. New dither patterns, retro palettes, cursor trails and click ripples, and an intro that sharpens into place.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/FaultyTerminal': {
    videoUrl: '/assets/videos/faultyterminal.webm',
    description:
      'A flickering CRT terminal of glowing glyphs, with phosphor trails under the cursor and glitches on click.',
    category: 'Backgrounds',
    name: 'FaultyTerminal',
    docsUrl: 'https://vue-bits.dev/backgrounds/faulty-terminal',
    tags: [],
    added: '2025-07-23',
    updates: [
      {
        date: '2026-10-12',
        note: 'Same terminal, now with phosphor glow, trails under the cursor, glitches on click, a cleaner light mode and new dot and character glyphs. Around 4x faster.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/RippleGrid': {
    videoUrl: '/assets/videos/ripplegrid.webm',
    description: 'A crisp grid that ripples like water, bending and lighting up as waves pass through it.',
    category: 'Backgrounds',
    name: 'RippleGrid',
    docsUrl: 'https://vue-bits.dev/backgrounds/ripple-grid',
    tags: [],
    added: '2025-07-14',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with crisp lines, real traveling waves from the cursor and clicks, dot and cross styles, and a perspective floor.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/DotField': {
    videoUrl: '/assets/videos/dotfield.webm',
    description:
      'A gradient dot field seen through a lens that follows the cursor, magnifying, pinching or swirling the dots.',
    category: 'Backgrounds',
    name: 'DotField',
    docsUrl: 'https://vue-bits.dev/backgrounds/dot-field',
    tags: [],
    added: '2026-04-14',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt around a smooth magnifying lens that stays under the cursor and zooms closer while you hold. New dot layouts, swirl and pinch lenses, and an intro that pulls into focus.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/DotGrid': {
    videoUrl: '/assets/videos/dotgrid.webm',
    description: 'A springy dot grid that the cursor flicks and drags through like jelly, with click shockwaves.',
    category: 'Backgrounds',
    name: 'DotGrid',
    docsUrl: 'https://vue-bits.dev/backgrounds/dot-grid',
    tags: [],
    added: '2025-05-23',
    updates: [
      {
        date: '2026-10-10',
        note: 'Rebuilt with springy physics, so the dots wobble back, streak as they move and pass ripples to their neighbours.'
      }
    ]
  },
  'Backgrounds/Threads': {
    videoUrl: '/assets/videos/threads.webm',
    description: 'Flowing threads that fray apart and part around the cursor, from fine silk to contour lines.',
    category: 'Backgrounds',
    name: 'Threads',
    docsUrl: 'https://vue-bits.dev/backgrounds/threads',
    tags: [],
    added: '2025-02-18',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt to run several times faster, with presets, much more control over the threads and a cursor that parts them.'
      }
    ]
  },
  'Backgrounds/Hyperspeed': {
    videoUrl: '/assets/videos/hyperspeed.webm',
    description: 'Night highway of glowing light trails on a winding road that warps into hyperspace while you hold.',
    category: 'Backgrounds',
    name: 'Hyperspeed',
    docsUrl: 'https://vue-bits.dev/backgrounds/hyperspeed',
    tags: [],
    added: '2024-08-14',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt with a real glow and a transparent background. Every part of the road and lights is now customizable.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/Iridescence': {
    videoUrl: '/assets/videos/iridescence.webm',
    description: 'Liquid iridescent surface with shifting folds that you can stir with the cursor.',
    category: 'Backgrounds',
    name: 'Iridescence',
    docsUrl: 'https://vue-bits.dev/backgrounds/iridescence',
    tags: [],
    added: '2025-02-05',
    updates: [
      {
        date: '2026-10-09',
        note: 'Rebuilt with full control over color, folds and motion, a liquid stir under the cursor, a swirl on click and presets.'
      }
    ]
  },
  'Backgrounds/Waves': {
    videoUrl: '/assets/videos/waves.webm',
    description: 'Dense flowing lines that sway like silk, bend around the cursor and spring back into place.',
    category: 'Backgrounds',
    name: 'Waves',
    docsUrl: 'https://vue-bits.dev/backgrounds/waves',
    tags: [],
    added: '2025-01-03',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt with perfectly smooth, crisp lines. They bend around the cursor and spring back, part in a soft ripple on click, and now come dashed, rotated or in light mode, with an intro.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/MagnetLines': {
    videoUrl: '/assets/videos/magnetlines.webm',
    description: 'A field of magnetic lines that swing toward the cursor, ripple outward and spin with every click.',
    category: 'Backgrounds',
    name: 'MagnetLines',
    docsUrl: 'https://vue-bits.dev/backgrounds/magnet-lines',
    tags: [],
    added: '2025-01-03',
    updates: [
      {
        date: '2026-10-12',
        note: 'Now a background that fills its container, with the square still available. Lines swing on springs, ripple out from the cursor and spin with each click, with new field modes, arrow and compass shapes, and a 3D tilt.'
      },
      {
        date: '2026-11-10',
        note: 'Loads without freezing the page, rebuilds its grid up to four times faster and frees graphics memory when removed.'
      }
    ]
  },
  'Backgrounds/GridDistortion': {
    videoUrl: '/assets/videos/griddistortion.webm',
    description: 'Image background that breaks into a grid of blocks under the cursor and settles back into place.',
    category: 'Backgrounds',
    name: 'GridDistortion',
    docsUrl: 'https://vue-bits.dev/backgrounds/grid-distortion',
    tags: [],
    added: '2025-01-25',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt to be lighter. Images no longer stretch, and new modes range from crisp blocks to a liquid warp.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/Ballpit': {
    videoUrl: '/assets/videos/ballpit.webm',
    description: 'A soft-lit pit of physics balls you can shove with the cursor, grab, throw and blast apart.',
    category: 'Backgrounds',
    name: 'Ballpit',
    docsUrl: 'https://vue-bits.dev/backgrounds/ballpit',
    tags: [],
    added: '2025-01-07',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt for smooth physics that handles thousands of balls, with soft modern finishes, and you can now grab, throw and blast them apart.'
      },
      {
        date: '2026-11-10',
        note: 'Physics runs about 20% faster, and it no longer shows a blank canvas when it remounts quickly during development.'
      }
    ]
  },
  'Backgrounds/Orb': {
    videoUrl: '/assets/videos/orb.webm',
    description:
      'A glowing ring of swirling color that breathes, trails an orbiting light and reaches toward the cursor.',
    category: 'Backgrounds',
    name: 'Orb',
    docsUrl: 'https://vue-bits.dev/backgrounds/orb',
    tags: [],
    added: '2025-02-07',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt with a crisper, more luminous ring that reaches toward the cursor and lights up where you hover. It pulses on click, powers on with an intro, and can tilt in 3D with custom colors, size and glow.'
      },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/LetterGlitch': {
    videoUrl: '/assets/videos/letterglitch.webm',
    description:
      'A calm field of letters that flicker, scramble and glitch in color, stirred by the cursor and torn by clicks.',
    category: 'Backgrounds',
    name: 'LetterGlitch',
    docsUrl: 'https://vue-bits.dev/backgrounds/letter-glitch',
    tags: [],
    added: '2025-01-24',
    updates: [
      {
        date: '2026-10-12',
        note: 'Redesigned as a crisp, calm field of letters that glitch in color, now much lighter to run. The cursor scrambles nearby letters, a click tears through the rows, and fonts, spacing and character sets are all adjustable.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' },
      { date: '2026-11-14', note: 'No longer shows a blank canvas when it remounts quickly during development.' }
    ]
  },
  'Backgrounds/GridMotion': {
    videoUrl: '/assets/videos/gridmotion.webm',
    description: 'A tilted wall of drifting tiles that slides with the pointer and lights up where it rests.',
    category: 'Backgrounds',
    name: 'GridMotion',
    docsUrl: 'https://vue-bits.dev/backgrounds/grid-motion',
    tags: [],
    added: '2024-08-18',
    updates: [
      {
        date: '2026-10-08',
        note: 'Rebuilt to fit its container, with drift, parallax, a 3D tilt and a spotlight that follows the cursor.'
      }
    ]
  },
  'Backgrounds/ShapeGrid': {
    videoUrl: '/assets/videos/squares.webm',
    description: 'A drifting grid of shapes that lights up under the cursor, with perspective tilt and rainbow trails.',
    category: 'Backgrounds',
    name: 'ShapeGrid',
    docsUrl: 'https://vue-bits.dev/backgrounds/shape-grid',
    tags: [],
    added: '2026-03-15',
    updates: [
      {
        date: '2026-10-11',
        note: 'Rebuilt with eight cell shapes, a glowing cursor trail and click ripples. The grid can now tilt into perspective and light up in rainbow colors.'
      }
    ]
  },
  'Backgrounds/LiquidChrome': {
    videoUrl: '/assets/videos/liquidchrome.webm',
    description:
      'Soft ribbons of liquid chrome that swirl through a dark pool, ripple under the cursor and catch the light as it moves.',
    category: 'Backgrounds',
    name: 'LiquidChrome',
    docsUrl: 'https://vue-bits.dev/backgrounds/liquid-chrome',
    tags: [],
    added: '2025-02-07',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt as soft, glossy liquid chrome whose reflections follow the cursor, with a liquid wake and ripples on click. Adds presets, a light mode and a faster renderer.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/Balatro': {
    videoUrl: '/assets/videos/balatro.webm',
    description:
      'The swirling Balatro paint shader, with crisp pixels, a cursor that stirs the paint and click whirlpools.',
    category: 'Backgrounds',
    name: 'Balatro',
    docsUrl: 'https://vue-bits.dev/backgrounds/balatro',
    tags: [],
    added: '2025-02-16',
    updates: [
      {
        date: '2026-10-12',
        note: 'Rebuilt on the same swirl with crisp pixels and no extra dependencies. The cursor now stirs the paint, clicks spin up whirlpools, and an intro spins it into place.'
      },
      { date: '2026-11-08', note: 'Prevents canvas flicker while resizing the container.' }
    ]
  },
  'Backgrounds/EvilEye': {
    videoUrl: '/assets/videos/evileye.webm',
    description: 'Procedural evil eye shader with animated iris, slit pupil, and fiery outer glow.',
    category: 'Backgrounds',
    name: 'EvilEye',
    docsUrl: 'https://vue-bits.dev/backgrounds/evil-eye',
    tags: [],
    added: '2026-03-17',
    hidden: true,
    updates: [
      { date: '2026-11-08', note: 'Responds to container size changes and prevents canvas flicker while resizing.' }
    ]
  }
};
