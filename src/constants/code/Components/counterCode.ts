import code from '@content/Components/Counter/Counter.vue?raw';
import { createCodeObject } from '../../../types/code';

export const counter = createCodeObject(code, 'Components/Counter', {
  installation: `npm i motion-v`,
  usage: `import Counter from './Counter.vue'

<Counter
  :value="1"
  :places="[100, 10, 1]"
  :fontSize="80"
  :padding="5"
  :gap="10"
  textColor="white"
  :fontWeight="900"
/>`
});
