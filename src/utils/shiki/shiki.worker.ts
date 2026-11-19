import { renderCode } from './render';

self.onmessage = async (event: MessageEvent) => {
  const { id, code, language } = event.data || {};
  try {
    self.postMessage({ id, html: await renderCode(code, language) });
  } catch (error) {
    self.postMessage({ id, error: String((error as Error)?.message || error) });
  }
};
