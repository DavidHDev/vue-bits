import { defineConfig, type RegistryItem } from 'jsrepo';
import { distributed } from 'jsrepo/outputs';
import { componentMetadata } from './src/constants/Information';

export default defineConfig({
  registry: {
    name: '@vue-bits',
    description:
      'An open source collection of animated, interactive & fully customizable Vue components for building stunning, memorable user interfaces.',
    homepage: 'https://vue-bits.dev',
    authors: ['David Haz'],
    bugs: 'https://github.com/DavidHDev/vue-bits/issues',
    repository: 'https://github.com/DavidHDev/vue-bits',
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
      'components',
      'components-library'
    ],
    excludeDeps: ['vue'],
    outputs: [distributed({ dir: 'public/r' })],
    items: [
      ...Object.values(componentMetadata).map(component =>
        defineComponent({
          title: component.name,
          description: component.description,
          category: component.category
        })
      )
    ].flat()
  }
});

/**
 * Define a component to be exposed from the registry. Creates a single variant of the component.
 *
 * @param title The title of the component.
 * @param description The description of the component.
 * @param category The category of the component.
 * @returns An array with a single RegistryItem object.
 */
function defineComponent({
  title,
  description,
  category
}: {
  title: string;
  description: string;
  category: string;
}): RegistryItem[] {
  return [
    {
      name: title,
      title,
      description,
      type: 'registry:component',
      categories: [category],
      files: [
        {
          path: `src/content/${category}/${title}`
        }
      ]
    }
  ];
}