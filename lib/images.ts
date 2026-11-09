// next/image may only optimize hosts allowed in next.config.js (our Supabase storage).
// Any other host, e.g. an image pasted from Higgsfield's CDN, would get a 400 from the
// image service, so those are served as-is instead.
const OPTIMIZABLE_PREFIX = 'https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/';

export function isOptimizableImage(src: string | null | undefined): boolean {
  return !!src && src.startsWith(OPTIMIZABLE_PREFIX);
}
