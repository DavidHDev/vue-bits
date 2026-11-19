type Job = { code: string; language: string; resolve: (html: string) => void; reject: (error: Error) => void };
type Entry = { html: string; promise: Promise<string> };

const LIMIT = 40;
const cache = new Map<string, Entry>();
const waiting = new Map<number, Job>();
let worker: Worker | null = null;
let broken = typeof Worker === 'undefined';
let count = 0;

const direct = (code: string, language: string) => import('./render').then(module => module.renderCode(code, language));

const fail = () => {
  broken = true;
  worker?.terminate();
  worker = null;
  waiting.forEach(job => direct(job.code, job.language).then(job.resolve, job.reject));
  waiting.clear();
};

const connect = () => {
  if (worker || broken) return worker;
  try {
    worker = new Worker(new URL('./shiki.worker.ts', import.meta.url), { type: 'module' });
  } catch {
    broken = true;
    return null;
  }
  worker.onmessage = event => {
    const { id, html, error } = event.data || {};
    const job = waiting.get(id);
    if (!job) return;
    waiting.delete(id);
    if (error) job.reject(new Error(error));
    else job.resolve(html);
  };
  worker.onerror = fail;
  worker.onmessageerror = fail;
  return worker;
};

const render = (code: string, language: string) => {
  const target = connect();
  if (!target) return direct(code, language);
  return new Promise<string>((resolve, reject) => {
    count += 1;
    waiting.set(count, { code, language, resolve, reject });
    target.postMessage({ id: count, code, language });
  });
};

const keyOf = (code: string, language: string) => `${language}\u0000${code}`;

export const peekHighlight = (code: string, language = 'vue') => cache.get(keyOf(String(code), language))?.html || '';

export const highlightCode = (code: string, language = 'vue') => {
  const source = String(code);
  const key = keyOf(source, language);
  const known = cache.get(key);
  if (known) {
    cache.delete(key);
    cache.set(key, known);
    return known.promise;
  }
  const entry: Entry = { html: '', promise: Promise.resolve('') };
  entry.promise = render(source, language).then(
    html => {
      entry.html = html;
      return html;
    },
    error => {
      if (cache.get(key) === entry) cache.delete(key);
      throw error;
    }
  );
  cache.set(key, entry);
  if (cache.size > LIMIT) cache.delete(cache.keys().next().value as string);
  return entry.promise;
};
