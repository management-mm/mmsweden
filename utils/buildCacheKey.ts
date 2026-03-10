export const buildCacheKey = (base: Record<string, unknown>) => {
  const sortedKeys = Object.keys(base).sort();
  const normalized: Record<string, unknown> = {};

  for (const k of sortedKeys) {
    const v = base[k];
    normalized[k] = Array.isArray(v) ? [...v].sort() : v;
  }

  return `products:${JSON.stringify(normalized)}`;
};
