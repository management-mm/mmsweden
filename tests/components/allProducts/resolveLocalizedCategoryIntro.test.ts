import { describe, expect, it } from 'vitest';

import { resolveLocalizedCategoryIntro } from '../../../components/allProducts/resolveLocalizedCategoryIntro';

describe('resolveLocalizedCategoryIntro', () => {
  it('renders only the matching locale, preserving its authored HTML', () => {
    expect(
      resolveLocalizedCategoryIntro(
        { en: '<p>Equipment details</p>', sv: '  <p>Maskiner</p>  ' },
        'sv'
      )
    ).toBe('<p>Maskiner</p>');
  });

  it('returns empty text when no intro exists', () => {
    expect(resolveLocalizedCategoryIntro(undefined, 'en')).toBe('');
    expect(resolveLocalizedCategoryIntro({}, 'en')).toBe('');
    expect(resolveLocalizedCategoryIntro({ en: '   ' }, 'en')).toBe('');
  });

  it('never displays another language when the requested intro is missing', () => {
    expect(
      resolveLocalizedCategoryIntro(
        { en: '<p>Cheese machines</p>', de: '<p>Maschinen</p>' },
        'fr'
      )
    ).toBe('');
  });

  it('does not replace an intentionally blank translation with English', () => {
    expect(
      resolveLocalizedCategoryIntro({ en: 'English content', pl: '' }, 'pl')
    ).toBe('');
  });
});
