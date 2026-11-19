import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import * as prettier from 'prettier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const reactBits = path.resolve(root, process.argv[2] || '../react-bits');
const source = path.join(reactBits, 'src/constants/pro-summary.generated.json');
const target = path.join(root, 'src/constants/pro-summary.generated.json');
const SITE = 'https://reactbits.dev';

if (!fs.existsSync(source)) {
  console.error(`Could not find ${path.relative(root, source)}. Pass the react-bits checkout path as an argument.`);
  process.exit(1);
}

const absolute = value => {
  if (Array.isArray(value)) return value.map(absolute);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, absolute(entry)]));
  }
  if (typeof value === 'string' && /^\/(rbp|assets)\//.test(value)) return `${SITE}${value}`;
  return value;
};

const summary = absolute(JSON.parse(fs.readFileSync(source, 'utf8')));
const config = (await prettier.resolveConfig(target)) ?? {};
const output = await prettier.format(JSON.stringify(summary), { ...config, filepath: target });
const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';

if (output === previous) {
  console.log('pro-summary.generated.json is already up to date.');
} else {
  fs.writeFileSync(target, output);
  console.log(`Updated ${path.relative(root, target)} from ${path.relative(root, source)}.`);
}
