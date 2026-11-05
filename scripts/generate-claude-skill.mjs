// Generates the .claude/skills/vue-bits package from the built jsrepo registry
// (public/r/*.json) and the category layout under src/content/.
//
// Run `npm run build:registry` first so public/r/*.json is up to date, then:
//   node scripts/generate-claude-skill.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

const registryDir = path.join(root, 'public/r');
const contentDir = path.join(root, 'src/content');
const skillDir = path.join(root, '.claude/skills/vue-bits');
const skillRegistryDir = path.join(skillDir, 'registry');

if (!fs.existsSync(registryDir)) {
  console.error(`Registry not found at ${registryDir}. Run "npm run build:registry" first.`);
  process.exit(1);
}

// Map component name -> category, from the src/content/<Category>/<Name> layout.
const nameToCategory = {};
for (const category of fs.readdirSync(contentDir)) {
  const categoryDir = path.join(contentDir, category);
  if (!fs.statSync(categoryDir).isDirectory()) continue;
  for (const name of fs.readdirSync(categoryDir)) {
    if (fs.statSync(path.join(categoryDir, name)).isDirectory()) {
      nameToCategory[name] = category;
    }
  }
}

fs.mkdirSync(skillRegistryDir, { recursive: true });

const catalog = [];
const skipped = [];

for (const file of fs.readdirSync(registryDir)) {
  if (!file.endsWith('.json') || file === 'registry.json') continue;

  const item = JSON.parse(fs.readFileSync(path.join(registryDir, file), 'utf8'));
  const category = nameToCategory[item.name];

  if (!category) {
    skipped.push(item.name);
    continue;
  }

  fs.writeFileSync(path.join(skillRegistryDir, file), JSON.stringify(item, null, 2) + '\n');

  catalog.push({
    name: item.name,
    category,
    description: item.description,
    dependencies: item.dependencies ?? [],
    files: item.files.map(f => f.path),
    docsUrl: `https://vue-bits.dev/${slugifyCategory(category)}/${slugify(item.name)}`
  });
}

catalog.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

fs.writeFileSync(path.join(skillDir, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');

console.log(`Wrote ${catalog.length} components to ${path.relative(root, skillRegistryDir)} and catalog.json`);
if (skipped.length) {
  console.warn(`Skipped (no category match in src/content): ${skipped.join(', ')}`);
}

function slugify(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function slugifyCategory(category) {
  const map = {
    Animations: 'animations',
    Backgrounds: 'backgrounds',
    Components: 'components',
    Micro: 'micro-interactions',
    TextAnimations: 'text-animations'
  };
  return map[category] ?? slugify(category);
}
