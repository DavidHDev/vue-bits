export const PRO_ORIGIN = 'https://pro.reactbits.dev';
export const REACT_BITS_ORIGIN = 'https://reactbits.dev';

const UTM_SOURCE = 'vue-bits.dev';
const UTM_CAMPAIGN = 'port-to-pro';

type Extra = Record<string, string | number | null | undefined>;

interface LinkOptions {
  extra?: Extra;
  sameTab?: boolean;
}

const taggedUrl = (origin: string, path: string, placement: string, extra: Extra = {}) => {
  const url = new URL(/^https?:\/\//.test(path) ? path : path || '/', origin);

  url.searchParams.set('utm_source', UTM_SOURCE);
  url.searchParams.set('utm_medium', placement);
  url.searchParams.set('utm_campaign', UTM_CAMPAIGN);
  url.searchParams.set('utm_content', placement);

  for (const [key, value] of Object.entries(extra)) {
    if (value != null) url.searchParams.set(key, String(value));
  }

  return url.toString();
};

const linkProps = (href: string, sameTab: boolean) =>
  sameTab ? { href } : { href, target: '_blank', rel: 'noopener noreferrer' };

export const proUrl = (path = '/', placement = 'unknown', extra: Extra = {}) =>
  taggedUrl(PRO_ORIGIN, path, placement, extra);

export const toolsUrl = (path = '/tools', placement = 'unknown', extra: Extra = {}) =>
  taggedUrl(REACT_BITS_ORIGIN, path, placement, extra);

export const proLinkProps = (path: string, placement: string, { extra, sameTab = false }: LinkOptions = {}) =>
  linkProps(proUrl(path, placement, extra), sameTab);

export const toolsLinkProps = (path: string, placement: string, { extra, sameTab = false }: LinkOptions = {}) =>
  linkProps(toolsUrl(path, placement, extra), sameTab);
