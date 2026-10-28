// Dependency-free data-quality checks: no automatic text rewriting.
export const LOCALES = ['en', 'sv', 'de', 'fr', 'es', 'ru', 'uk', 'pl'];

const suspiciousText = {
  en: [/\bwhit\b/i, /\bstinless\b/i, /\bfor 6 inks\b/i],
  de: [/\bfür\s+6\s+Farben\b/i, /\bConveyor Belt\b/i],
  ru: [/телевизионный\s+под[ъь]емник/i, /телевизионный\s+подъёмник/i],
  pl: [/\bdo 6 atramentów\b/i, /używana\s+stół/i],
};

export function compactText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

export function auditProduct(product) {
  const issues = [];
  const slug = compactText(product.slug);
  const id = compactText(product.idNumber);
  const push = (code, locale = '', value = '') => {
    issues.push({
      id,
      slug,
      code,
      locale,
      value: compactText(value).slice(0, 240),
    });
  };

  const names = product.name;
  const englishName = compactText(
    typeof names === 'string' ? names : names?.en
  );
  if (!englishName) push('NAME_EN_MISSING', 'en');
  if (typeof names === 'string') {
    // This can be intentional for model numbers; review, not an error.
    push('NAME_SINGLE_LANGUAGE_REVIEW', '', englishName);
  } else if (names && typeof names === 'object') {
    for (const locale of LOCALES) {
      if (!compactText(names[locale])) push('NAME_TRANSLATION_MISSING', locale);
    }
  }

  for (const locale of LOCALES) {
    const description =
      typeof product.description === 'string'
        ? locale === 'en'
          ? product.description
          : ''
        : product.description?.[locale];
    if (!compactText(description))
      push('DESCRIPTION_TRANSLATION_MISSING', locale);
    const englishDescription = compactText(
      typeof product.description === 'string'
        ? product.description
        : product.description?.en
    );
    if (
      locale !== 'en' &&
      compactText(description) &&
      compactText(description).toLocaleLowerCase() ===
        englishDescription.toLocaleLowerCase() &&
      englishDescription.split(' ').length >= 5
    ) {
      push('DESCRIPTION_SAME_AS_EN_REVIEW', locale, compactText(description));
    }

    const localName = typeof names === 'string' ? names : names?.[locale];
    const value = `${compactText(localName)} ${compactText(description)}`;
    if (suspiciousText[locale]?.some(pattern => pattern.test(value))) {
      push('SUSPICIOUS_TRANSLATION_REVIEW', locale, value);
    }
  }

  if (!compactText(product.manufacturer)) push('MANUFACTURER_MISSING');
  if (!compactText(product.dimensions)) push('DIMENSIONS_MISSING');
  if (!compactText(product.model)) push('MODEL_FIELD_MISSING_REVIEW');
  if (!compactText(product.capacity)) push('CAPACITY_FIELD_MISSING_REVIEW');
  if (
    !compactText(product.yearOfManufacture) &&
    !(typeof product.yearOfManufacture === 'number')
  ) {
    push('MANUFACTURE_YEAR_MISSING_REVIEW');
  }

  // Heuristic only: a name without both letters and digits often omits a model.
  // Never infer a model from the product ID, manufacturer or inventory number.
  if (englishName && !/[a-zA-Z][\w/-]*\d|\d[\w/-]*[a-zA-Z]/.test(englishName)) {
    push('MODEL_IN_NAME_REVIEW', 'en', englishName);
  }
  return issues;
}

export function auditCatalog(products) {
  const issues = products.flatMap(auditProduct);
  const namesByValue = new Map();
  for (const product of products) {
    const name = compactText(
      typeof product.name === 'string' ? product.name : product.name?.en
    ).toLocaleLowerCase();
    if (name) {
      const similar = namesByValue.get(name) ?? [];
      similar.push(product);
      namesByValue.set(name, similar);
    }
  }
  for (const [, similar] of namesByValue) {
    if (similar.length <= 1) continue;
    for (const product of similar) {
      issues.push({
        id: compactText(product.idNumber),
        slug: compactText(product.slug),
        code: 'DUPLICATE_EN_NAME_REVIEW',
        locale: 'en',
        value: compactText(
          typeof product.name === 'string' ? product.name : product.name?.en
        ),
      });
    }
  }
  return issues;
}

export function auditCategoryTree(tree) {
  const issues = [];
  for (const category of tree) {
    for (const entry of [category, ...(category.subcategories ?? [])]) {
      if (!entry || typeof entry !== 'object') continue;
      const slug = compactText(entry.slug);
      const textFields = {
        name: entry.name,
        seoTitle: entry.seo?.title,
        seoDescription: entry.seo?.description,
        seoH1: entry.seo?.h1,
        intro: entry.content?.intro,
      };
      for (const [field, values] of Object.entries(textFields)) {
        for (const locale of LOCALES) {
          if (!compactText(values?.[locale])) {
            issues.push({
              id: '',
              slug,
              code: `CATEGORY_${field.toUpperCase()}_MISSING_REVIEW`,
              locale,
              value: '',
            });
          }
        }
      }
    }
  }
  return issues;
}

export function toCsv(rows) {
  const columns = ['id', 'slug', 'code', 'locale', 'value'];
  const encode = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return (
    [
      columns.join(','),
      ...rows.map(row => columns.map(k => encode(row[k])).join(',')),
    ].join('\n') + '\n'
  );
}
