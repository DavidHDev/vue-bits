// Highlighted sidebar items
export const NEW = ['Dot Field', 'Shape Grid', 'Strands', 'Side Rays', 'Ferrofluid', 'Lightfall', 'Plasma Wave'];
export const UPDATED = [];

// Used for main sidebar navigation
export const CATEGORIES = [
  {
    name: 'Get Started',
    subcategories: ['Index']
  },
  {
    name: 'Text Animations',
    subcategories: [
      'ASCII Text',
      'Blur Text',
      'Circular Text',
      'Count Up',
      'Curved Loop',
      'Decrypted Text',
      'Falling Text',
      'Fuzzy Text',
      'Glitch Text',
      'Gradient Text',
      'Rotating Text',
      'Scramble Text',
      'Scroll Float',
      'Scroll Reveal',
      'Scroll Velocity',
      'Shiny Text',
      'Shuffle',
      'Split Text',
      'Text Cursor',
      'Text Pressure',
      'Text Type',
      'True Focus',
      'Variable Proximity'
    ]
  },
  {
    name: 'Animations',
    subcategories: [
      'Animated Content',
      'Antigravity',
      'Blob Cursor',
      'Click Spark',
      'Crosshair',
      'Cubes',
      'Electric Border',
      'Fade Content',
      'Ghost Cursor',
      'Glare Hover',
      'Gradual Blur',
      'Image Trail',
      'Laser Flow',
      'Logo Loop',
      'Magic Rings',
      'Magnet',
      'Magnet Lines',
      'Meta Balls',
      'Metallic Paint',
      'Noise',
      'Orbit Images',
      'Pixel Trail',
      'Pixel Transition',
      'Ribbons',
      'Shape Blur',
      'Splash Cursor',
      'Star Border',
      'Sticker Peel',
      'Strands',
      'Target Cursor'
    ]
  },
  {
    name: 'Components',
    subcategories: [
      'Animated List',
      'Border Glow',
      'Bounce Cards',
      'Bubble Menu',
      'Card Nav',
      'Card Swap',
      'Carousel',
      'Chroma Grid',
      'Circular Gallery',
      'Counter',
      'Decay Card',
      'Dock',
      'Dome Gallery',
      'Elastic Slider',
      'Flowing Menu',
      'Flying Posters',
      'Folder',
      'Glass Icons',
      'Glass Surface',
      'Gooey Nav',
      'Infinite Menu',
      'Magic Bento',
      'Masonry',
      'Pill Nav',
      'Pixel Card',
      'Profile Card',
      'Reflective Card',
      'Scroll Stack',
      'Spotlight Card',
      'Stack',
      'Staggered Menu',
      'Stepper',
      'Tilted Card'
    ]
  },
  {
    name: 'Backgrounds',
    subcategories: [
      'Aurora',
      'Balatro',
      'Ballpit',
      'Beams',
      'Color Bends',
      'Dark Veil',
      'Dither',
      'Dot Field',
      'Dot Grid',
      'Evil Eye',
      'Faulty Terminal',
      'Ferrofluid',
      'Floating Lines',
      'Galaxy',
      'Gradient Blinds',
      'Grainient',
      'Grid Distortion',
      'Grid Motion',
      'Grid Scan',
      'Hyperspeed',
      'Iridescence',
      'Letter Glitch',
      'Light Pillar',
      'Light Rays',
      'Lightfall',
      'Lightning',
      'Line Waves',
      'Liquid Chrome',
      'Liquid Ether',
      'Orb',
      'Particles',
      'Pixel Blast',
      'Pixel Snow',
      'Plasma',
      'Plasma Wave',
      'Prism',
      'Prismatic Burst',
      'Radar',
      'Ripple Grid',
      'Shape Grid',
      'Side Rays',
      'Silk',
      'Soft Aurora',
      'Threads',
      'Waves'
    ]
  }
];

// Slug helpers (kebab-case used in URLs).
export const slug = (s: string) => s.replace(/\s+/g, '-').toLowerCase();
export const decodeLabel = (s: string) =>
  s
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
