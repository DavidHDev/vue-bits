#!/usr/bin/env node
// Browse the bundled Vue Bits catalog.
//
// Usage:
//   node list-components.mjs                          list categories + counts
//   node list-components.mjs --category Animations     list components in a category
//   node list-components.mjs --search "blur text"      fuzzy search name/description
//   node list-components.mjs --name BlurText            show full detail for one component
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'catalog.json'), 'utf8'));

const args = process.argv.slice(2);
const flag = f => {
  const i = args.indexOf(f);
  return i === -1 ? undefined : args[i + 1];
};

const category = flag('--category');
const search = flag('--search');
const name = flag('--name');

if (name) {
  const match = catalog.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (!match) {
    console.error(`No component named "${name}". Try --search "${name}".`);
    process.exit(1);
  }
  console.log(JSON.stringify(match, null, 2));
  process.exit(0);
}

let results = catalog;

if (category) {
  results = results.filter(c => c.category.toLowerCase() === category.toLowerCase());
  if (results.length === 0) {
    const categories = [...new Set(catalog.map(c => c.category))];
    console.error(`No category "${category}". Available categories: ${categories.join(', ')}`);
    process.exit(1);
  }
}

if (search) {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  results = results.filter(c => {
    const haystack = `${c.name} ${c.description}`.toLowerCase();
    return terms.every(t => haystack.includes(t));
  });
}

if (!category && !search) {
  const counts = {};
  for (const c of catalog) counts[c.category] = (counts[c.category] ?? 0) + 1;
  console.log('Vue Bits catalog — ' + catalog.length + ' components\n');
  for (const [cat, count] of Object.entries(counts).sort()) {
    console.log(`  ${cat} (${count})`);
  }
  console.log('\nList a category:  node list-components.mjs --category <name>');
  console.log('Search:            node list-components.mjs --search "<keywords>"');
  process.exit(0);
}

if (results.length === 0) {
  console.log('No matches.');
  process.exit(0);
}

for (const c of results) {
  console.log(`${c.name}  [${c.category}]`);
  console.log(`  ${c.description}`);
}
console.log(`\n${results.length} match(es). Show full detail: node list-components.mjs --name <ComponentName>`);
