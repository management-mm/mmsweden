import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import SeoIntroSection from '../../../components/allProducts/SeoIntroSection';

describe('SeoIntroSection', () => {
  it('still renders a heading when the introduction is missing', () => {
    const html = renderToStaticMarkup(
      <SeoIntroSection h1="Used Slicers" intro="" />
    );

    expect(html).toContain('<h1');
    expect(html).toContain('Used Slicers');
    expect(html).not.toContain('<button');
  });

  it('does not create placeholder text for empty introductions', () => {
    const html = renderToStaticMarkup(
      <SeoIntroSection h1="Dicing Machines" intro="   " />
    );

    expect(html).toContain('Dicing Machines');
    expect(html).not.toContain('Explore');
    expect(html).not.toContain('<button');
  });
});
