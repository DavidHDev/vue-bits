#!/usr/bin/env node
// Install one Vue Bits component into the current project from the bundled registry.
//
// Usage:
//   node install-component.mjs <ComponentName> [--dir src/components] [--force]
//
// Writes the component's files under <dir>/<ComponentName>/ (relative to the
// current working directory) and prints the npm dependencies it needs — this
// script does not install npm packages itself.
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.join(__dirname, '..');

const args = process.argv.slice(2);
const positional = args.filter(a => !a.startsWith('--'));
const flag = f => {
  const i = args.indexOf(f);
  return i === -1 ? undefined : args[i + 1];
};
const force = args.includes('--force');
const targetBase = flag('--dir') ?? 'src/components';

const requested = positional[0];
if (!requested) {
  console.error('Usage: node install-component.mjs <ComponentName> [--dir src/components] [--force]');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(path.join(skillDir, 'catalog.json'), 'utf8'));
const entry = catalog.find(c => c.name.toLowerCase() === requested.toLowerCase());

if (!entry) {
  console.error(`No component named "${requested}" in the catalog.`);
  console.error('List components with: node list-components.mjs --search "<keywords>"');
  process.exit(1);
}

const registryPath = path.join(skillDir, 'registry', `${entry.name}.json`);
const item = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const targetDir = path.resolve(process.cwd(), targetBase);
const written = [];
const skippedExisting = [];

for (const file of item.files) {
  const destPath = path.join(targetDir, file.path);

  if (fs.existsSync(destPath) && !force) {
    skippedExisting.push(path.relative(process.cwd(), destPath));
    continue;
  }

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, file.content);
  written.push(path.relative(process.cwd(), destPath));
}

console.log(`Component: ${entry.name} (${entry.category})`);
console.log(`Docs: ${entry.docsUrl}`);

if (written.length) {
  console.log(`\nWrote ${written.length} file(s):`);
  for (const f of written) console.log(`  ${f}`);
}

if (skippedExisting.length) {
  console.log(`\nSkipped (already exist, use --force to overwrite):`);
  for (const f of skippedExisting) console.log(`  ${f}`);
}

if (item.dependencies?.length) {
  console.log(`\nnpm dependencies required (not installed by this script):`);
  for (const d of item.dependencies) console.log(`  ${d}`);
} else {
  console.log(`\nNo extra npm dependencies required.`);
}
