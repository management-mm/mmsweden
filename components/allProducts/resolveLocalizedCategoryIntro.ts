import type { AppLocale } from '@i18n/config';

/**
 * Return only the explicitly authored intro for the page language.
 *
 * Missing content is an editorial gap, not a reason to show English (or an
 * arbitrary translation) on a different-language catalog page. The heading
 * remains visible even if the intro is empty.
 */
export function resolveLocalizedCategoryIntro(
  value: Record<string, string> | undefined,
  locale: AppLocale
): string {
  const localizedIntro = value?.[locale];

  return typeof localizedIntro === 'string' ? localizedIntro.trim() : '';
}
