import assert from 'node:assert/strict';
import test from 'node:test';

import {
  auditCatalog,
  auditCategoryTree,
  auditProduct,
  toCsv,
} from './seo-step04-audit-utils.mjs';

const all = ['en', 'sv', 'de', 'fr', 'es', 'ru', 'uk', 'pl'];
const localized = value =>
  Object.fromEntries(all.map(locale => [locale, value]));
const product = {
  idNumber: 'MM-14',
  slug: 'a-mixer',
  manufacturer: 'Hobart',
  dimensions: '120x80',
  name: localized('Hobart H600 Mixer'),
  description: localized('Mixing equipment'),
  model: 'H600',
  yearOfManufacture: 2018,
  capacity: '400 kg/h',
};

test('complete data has no manual review flags', () => {
  assert.deepEqual(auditProduct(product), []);
});

test('finds translation errors, without auto-correcting text', () => {
  const sample = {
    ...product,
    name: { ...product.name, pl: 'Używana Stół pakujący' },
    description: {
      ...product.description,
      en: 'grinder whit built in lifting device. Completely stinless steel',
    },
  };
  const warnings = auditProduct(sample);
  assert.ok(
    warnings.some(
      w => w.code === 'SUSPICIOUS_TRANSLATION_REVIEW' && w.locale === 'en'
    )
  );
  assert.ok(
    warnings.some(
      w => w.code === 'SUSPICIOUS_TRANSLATION_REVIEW' && w.locale === 'pl'
    )
  );
  assert.equal(sample.description.en.includes('whit'), true);
});

test('flags copies of long English descriptions in another language for review', () => {
  const value = 'Industrial grinder made of stainless steel.';
  const warnings = auditProduct({ ...product, description: localized(value) });
  assert.ok(
    warnings.some(
      w => w.code === 'DESCRIPTION_SAME_AS_EN_REVIEW' && w.locale === 'de'
    )
  );
});

test('flags shared English names without treating them as identical products', () => {
  const issues = auditCatalog([
    { ...product, idNumber: '1' },
    { ...product, idNumber: '2', slug: 'second' },
  ]);
  assert.equal(
    issues.filter(i => i.code === 'DUPLICATE_EN_NAME_REVIEW').length,
    2
  );
});

test('highlights missing localized category text without inventing it', () => {
  const issues = auditCategoryTree([
    {
      slug: 'bakery-machinery',
      name: { en: 'Bakery Machines' },
      subcategories: [],
    },
  ]);
  assert.ok(issues.some(i => i.code === 'CATEGORY_INTRO_MISSING_REVIEW'));
  assert.ok(
    issues.some(
      i => i.code === 'CATEGORY_NAME_MISSING_REVIEW' && i.locale === 'sv'
    )
  );
});

test('escapes commas, quotes, and line breaks in CSV output', () => {
  const csv = toCsv([
    { slug: 'mixer', code: 'EXAMPLE', value: 'Part "A", part B' },
  ]);
  assert.match(csv, /"Part ""A"", part B"/);
});
