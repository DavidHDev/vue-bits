---
name: vue-bits
description: Browse and install animated Vue 3 components from the Vue Bits library (vue-bits.dev) — animations, backgrounds, text effects, UI components, and micro-interactions. Use when the user asks to add/install a Vue Bits component, wants an animated background, text reveal, hover/cursor effect, or UI micro-interaction for a Vue app, or names a specific component (e.g. BlurText, Aurora, SplashCursor, CardSwap).
---

# Vue Bits component installer

This skill bundles the Vue Bits (https://vue-bits.dev) component registry: 203
components across 5 categories (Animations, Backgrounds, Components, Micro,
TextAnimations), each with full Vue 3 source and its exact npm dependencies.
Everything needed is local to this skill folder — no network access required.

Components are MIT + Commons Clause licensed (see upstream repo). That license
permits using them in a project, including commercially, but forbids
reselling or redistributing the component source as a bundle/template. Only
install components into the user's own project; don't repackage this skill's
`registry/` contents elsewhere.

## Workflow

1. **Find the component.** Run the list/search helper:
   ```
   node .claude/skills/vue-bits/scripts/list-components.mjs --search "<keywords>"
   node .claude/skills/vue-bits/scripts/list-components.mjs --category <Animations|Backgrounds|Components|Micro|TextAnimations>
   ```
   If the user already named an exact component, skip straight to installing it.
   If the search returns several plausible matches, ask the user which one
   they mean rather than guessing.

2. **Check the target project uses Tailwind CSS.** Most components are styled
   with Tailwind utility classes. Check for a Tailwind config/dependency in
   the user's project before installing; if it's missing, tell the user and
   ask whether to proceed anyway (classes will need manual adaptation) or
   set up Tailwind first.

3. **Install the component's files:**
   ```
   node .claude/skills/vue-bits/scripts/install-component.mjs <ComponentName> --dir src/components
   ```
   - Omit `--dir` to default to `src/components` (adjust to match the user's
     project layout, e.g. `src/components/ui`).
   - The script refuses to overwrite existing files unless you pass `--force`
     — if it reports skipped files, tell the user and ask before forcing.
   - It prints the exact npm dependency list (with version ranges) the
     component needs. It does not install them.

4. **Install the npm dependencies it printed**, using whichever package
   manager the project already uses (check for `pnpm-lock.yaml`,
   `yarn.lock`, or `package-lock.json` in the project root):
   ```
   pnpm add <deps>   # or: npm install <deps> / yarn add <deps>
   ```

5. **Wire it up.** Import the component from the path you installed it to and
   use it per its props. Use `node .claude/skills/vue-bits/scripts/list-components.mjs --name <ComponentName>`
   to see its description and docs link; open the installed `.vue` file to see
   its actual prop types/defaults (the source is the source of truth — this
   skill doesn't bundle separate prop documentation).

## Notes

- Some components (3D/WebGL-heavy ones) depend on `three`, `ogl`, or `vgpu`
  — these are real runtime dependencies, not devDependencies.
- A few components use `motion-v`, `gsap`, or `@hugeicons/vue` — same deal,
  install exactly what the script reports.
- Component names are PascalCase (e.g. `BlurText`, `SplashCursor`) and match
  the file/folder name installed.
- This skill's data can go stale as Vue Bits adds components; it reflects a
  snapshot of the registry at the time the skill was generated.
