import { describe, expect, it } from 'vitest';

import { buildCacheKey } from '../../utils/buildCacheKey';

describe('buildCacheKey', () => {
  it('returns the same key for the same data in different order', () => {
    const a = {
      manufacturer: 'bosch',
      categories: ['meat', 'fruit'],
      page: 2,
    };

    const b = {
      page: 2,
      categories: ['fruit', 'meat'],
      manufacturer: 'bosch',
    };

    expect(buildCacheKey(a)).toBe(buildCacheKey(b));
    expect(buildCacheKey(a)).toBe(
      'products:{"categories":["fruit","meat"],"manufacturer":"bosch","page":2}'
    );
  });
});
