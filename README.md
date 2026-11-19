<div align="center">
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/assets/logos/vuebits-gh-white.svg">
    <source media="(prefers-color-scheme: light)" srcset="src/assets/logos/vuebits-gh-black.svg">
    <img src="src/assets/logos/vuebits-gh-black.svg" alt="Vue Bits" width="420">
  </picture>
  <br />
  <br />
  <h3>Animated Vue components for websites people remember.</h3>
  <p>217 free animated components and backgrounds for Vue.<br />Tune them yourself, or hand them to your agent.</p>
  <p>
    <a href="https://github.com/davidhdev/vue-bits/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/davidhdev/vue-bits?style=flat&logo=github&label=Stars"></a>
    <a href="https://github.com/davidhdev/vue-bits/blob/main/LICENSE.md"><img alt="License: MIT + Commons Clause" src="https://img.shields.io/badge/License-MIT%20%2B%20Commons%20Clause-green?style=flat"></a>
  </p>
  <p>
    <a href="https://vue-bits.dev/get-started/introduction">Documentation</a> ·
    <a href="https://vue-bits.dev/get-started/installation">Installation</a> ·
    <a href="https://vue-bits.dev/get-started/mcp">MCP</a> ·
    <a href="https://vue-bits.dev/get-started/index">Browse components</a>
  </p>
  <br />
</div>

## About

Vue Bits is the official Vue port of [React Bits](https://reactbits.dev): a free, open source library of animated Vue components and backgrounds that you copy into your project and make your own.

Each component is a single Vue file written in TypeScript, with its styles alongside it. It drops straight into any Vue 3 or Nuxt project.

## What's inside

Every component has a live demo with controls, works in light and dark mode on the docs site, and most backgrounds come with presets to start from. Search, favorites and a browse page help you find the effect you have in mind.

| Category                                                  | Count | What you'll find                                                              |
| --------------------------------------------------------- | ----: | ----------------------------------------------------------------------------- |
| [Text Animations](https://vue-bits.dev/c/text-animations) |    33 | Split, scramble, blur and morph text, from headlines to scroll-driven reveals |
| [Animations](https://vue-bits.dev/c/animations)           |    38 | Cursor effects, hover interactions and reveals that wrap around any element   |
| [Components](https://vue-bits.dev/c/components)           |    48 | Carousels, galleries, cards, menus and docks with the motion built in         |
| [Micro](https://vue-bits.dev/c/micro)                     |    34 | Small interactive pieces like toggles, sliders, buttons and loaders           |
| [Backgrounds](https://vue-bits.dev/c/backgrounds)         |    64 | Shader and canvas backgrounds for heroes and full pages, most with presets    |

## Installation

Add any component with the [shadcn](https://ui.shadcn.com/) CLI:

```bash
npx shadcn@latest add https://vue-bits.dev/r/SplitText.json
```

Or with [jsrepo](https://jsrepo.dev):

```bash
npx jsrepo add https://vue-bits.dev/r/SplitText.json
```

Swap `SplitText` for any component. On pnpm, yarn or bun, replace `npx` with `pnpm dlx`, `yarn dlx` or `bunx --bun`.

Prefer to copy by hand? Open a component's Code tab, paste the file into your project and install the dependencies it lists. The [installation guide](https://vue-bits.dev/get-started/installation) covers both.

## Usage

Render it like any other component:

```vue
<template>
  <SplitText text="Hello, you!" :delay="100" :duration="0.6" />
</template>

<script setup lang="ts">
import SplitText from './SplitText.vue';
</script>
```

The code is yours, so change the styles, props or behavior however you like.

### Use it with your agent

Vue Bits works with the shadcn MCP server, so Claude Code, Cursor, Codex, VS Code and Antigravity can find and add components for you. Add the registry to your `components.json`:

```json
{
  "registries": {
    "@vue-bits": "https://vue-bits.dev/r/{name}.json"
  }
}
```

Then connect your client, for example `npx shadcn@latest mcp init --client claude`, and ask for what you need. See the [MCP guide](https://vue-bits.dev/get-started/mcp) for every client.

## Community

**Contributing.** Ideas and fixes are welcome. Browse the [open issues](https://github.com/DavidHDev/vue-bits/issues), suggest something with the [feature request template](https://github.com/DavidHDev/vue-bits/issues/new?template=2-feature-request.yml), and read the [contribution guide](https://github.com/DavidHDev/vue-bits/blob/main/CONTRIBUTING.md) before opening a pull request.

**Official ports.** Vue Bits is a port of [React Bits](https://reactbits.dev), which is also available for [Svelte](https://sveltebits.xyz/).

**Contributors.** Thanks to everyone who has helped build Vue Bits.

<a href="https://github.com/davidhdev/vue-bits/graphs/contributors">
  <img src="https://contrib-circles.vercel.app/DavidHDev/vue-bits?padding=16&borders=none&transparent=true" alt="Vue Bits contributors">
</a>

<br />
<br />

![Repobeats analytics](https://repobeats.axiom.co/api/embed/02689c621a09cc5b492ccc1b4bb2f764e32500b7.svg 'Repobeats analytics image')

## Sponsorship

You can support the project with the Sponsor button on the repository page. Donations go strictly towards hosting costs.

## Credit

Vue Bits occasionally draws inspiration from publicly available code examples. These are rewritten as full-fledged, customizable components. If you recognize your work, [open an issue](https://github.com/DavidHDev/vue-bits/issues) to request credit.

## License

[MIT + Commons Clause](https://github.com/davidhdev/vue-bits/blob/main/LICENSE.md), free for personal and commercial use. Created and maintained by [David Haz](https://github.com/DavidHDev).
