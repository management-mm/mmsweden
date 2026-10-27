import { describe, expect, it } from 'vitest';

import { getSeoRedirectTarget } from '../../lib/seoLegacyRedirects';

describe('getSeoRedirectTarget', () => {
  it.each([
    ['/engelska.html', '/en'],
    ['/nyinkommit.html', '/sv/new-arrivals'],
    ['/begagnade-maskiner1.html', '/sv/all-products'],
    ['/bakery-machinery', '/sv/all-products/bakery-machinery'],
    [
      '/fish-processing-machinery',
      '/sv/all-products/fish-processing-machinery',
    ],
    [
      '/all-products/meat-processing-machinery/meat-grinders',
      '/sv/all-products/meat-processing-machinery/meat-grinders',
    ],
    [
      '/all-products/bakery-machinery/dough-mixers',
      '/sv/all-products/bakery-machinery/dough-mixers',
    ],
    ['/all-products', '/sv/all-products'],
    ['/new-arrivals', '/sv/new-arrivals'],
    ['/about-us', '/sv/about-us'],
    ['/', '/en'],
  ])('redirects old path %s to %s', (source, path) => {
    const target = getSeoRedirectTarget(
      new URL(`https://www.mmsweden.se${source}`),
      'www.mmsweden.se'
    );

    expect(target?.href).toBe(`https://www.mmsweden.se${path}`);
  });

  it('combines the apex domain and legacy URL changes in one redirect', () => {
    const target = getSeoRedirectTarget(
      new URL('https://mmsweden.se/bakery-machinery?ref=old'),
      'mmsweden.se'
    );

    expect(target?.href).toBe(
      'https://www.mmsweden.se/sv/all-products/bakery-machinery?ref=old'
    );
  });

  it('preserves pagination, filters and repeated query parameters', () => {
    const target = getSeoRedirectTarget(
      new URL(
        'https://www.mmsweden.se/all-products/meat-processing-machinery/meat-grinders?page=2&brand=A&brand=B'
      ),
      'www.mmsweden.se'
    );

    expect(target?.href).toBe(
      'https://www.mmsweden.se/sv/all-products/meat-processing-machinery/meat-grinders?page=2&brand=A&brand=B'
    );
  });

  it('redirects the apex homepage directly to /en', () => {
    const target = getSeoRedirectTarget(
      new URL('https://mmsweden.se/'),
      'mmsweden.se'
    );
    expect(target?.href).toBe('https://www.mmsweden.se/en');
  });

  it('retains locale, path and parameters on already-localized apex URLs', () => {
    const target = getSeoRedirectTarget(
      new URL('https://mmsweden.se/sv/all-products?page=2'),
      'mmsweden.se'
    );
    expect(target?.href).toBe('https://www.mmsweden.se/sv/all-products?page=2');
  });

  it('uses canonical public host without exposing internal proxy port', () => {
    const target = getSeoRedirectTarget(
      new URL('http://internal:3000/bakery-machinery'),
      'www.mmsweden.se'
    );
    expect(target?.href).toBe(
      'https://www.mmsweden.se/sv/all-products/bakery-machinery'
    );
  });

  it('does not redirect already localized pages or noncanonical hosts', () => {
    expect(
      getSeoRedirectTarget(
        new URL('https://www.mmsweden.se/sv/all-products'),
        'www.mmsweden.se'
      )
    ).toBeNull();

    expect(
      getSeoRedirectTarget(
        new URL('http://localhost:3000/en/all-products'),
        'localhost:3000'
      )
    ).toBeNull();
  });

  it('does not make up destinations for unknown historical pages', () => {
    expect(
      getSeoRedirectTarget(
        new URL('https://www.mmsweden.se/unknown-legacy.html'),
        'www.mmsweden.se'
      )
    ).toBeNull();
  });

  it('handles trailing slashes and does not trust a lookalike host', () => {
    expect(
      getSeoRedirectTarget(
        new URL('https://www.mmsweden.se/nyinkommit.html/'),
        'www.mmsweden.se'
      )?.pathname
    ).toBe('/sv/new-arrivals');

    expect(
      getSeoRedirectTarget(
        new URL('https://mmsweden.se/unknown'),
        'mmsweden.se.attacker.example'
      )
    ).toBeNull();
  });
});
