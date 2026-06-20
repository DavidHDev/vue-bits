import code from '@/content/TextAnimations/ScrambleText/ScrambleText.vue?raw';
import { createCodeObject } from '@/types/code';

export const scrambleText = createCodeObject(code, 'TextAnimations/ScrambleText', {
  installation: `npm install gsap`,
  usage: `// Component inspired by Tom Miller from the GSAP community
// https://codepen.io/creativeocean/pen/NPWLwJM

import ScrambledText from './ScrambledText';
  
<ScrambledText
  className="scrambled-text-demo"
  radius={100}
  duration={1.2}
  speed={0.5}
  scrambleChars={.:}
>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
  Similique pariatur dignissimos porro eius quam doloremque 
  et enim velit nobis maxime.
</ScrambledText>`
});
