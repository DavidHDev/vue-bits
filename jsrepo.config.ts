import { defineConfig } from 'jsrepo';
import { distributed } from 'jsrepo/outputs';
import fs from 'fs';
import path from 'path';

function getItems(cwd: string) {
  const contentDir = path.join(cwd, 'src/content');
  const categories = fs.readdirSync(contentDir).filter((f) => {
    return fs.statSync(path.join(contentDir, f)).isDirectory();
  });

  const items: Array<{
    name: string;
    type: string;
    files: Array<{ path: string }>;
  }> = [];

  for (const category of categories) {
    const categoryPath = path.join(contentDir, category);
    const components = fs.readdirSync(categoryPath).filter((f) => {
      return fs.statSync(path.join(categoryPath, f)).isDirectory();
    });

    for (const component of components) {
      items.push({
        name: `${category}/${component}`,
        type: category,
        files: [{ path: `src/content/${category}/${component}` }]
      });
    }
  }

  return items;
}

export default defineConfig({
  registry: ({ cwd }) => ({
    name: 'vue-bits',
    description:
      'An open source collection of animated, interactive & fully customizable Vue components for building stunning, memorable user interfaces.',
    authors: ['David Haz'],
    homepage: 'https://vue-bits.dev',
    repository: 'https://github.com/DavidHDev/vue-bits',
    bugs: 'https://github.com/DavidHDev/vue-bits/issues',
    tags: [
      'vue',
      'javascript',
      'components',
      'web',
      'vuejs',
      'css-animations',
      'component-library',
      'ui-components',
      '3d',
      'ui-library',
      'tailwind',
      'tailwindcss',
      'components-library'
    ],
    outputs: [distributed({ dir: './public/ui' })],
    excludeDeps: ['vue'],
    defaultPaths: {
      Animations: 'src/components/Animations',
      Backgrounds: 'src/components/Backgrounds',
      Components: 'src/components/Components',
      TextAnimations: 'src/components/TextAnimations'
    },
    items: getItems(cwd)
  })
});
