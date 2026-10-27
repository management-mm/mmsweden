import type { ISeoCategory } from '@interfaces/ISeoCategory';
import 'server-only';

// The API returns top-level categories together with their child categories.
export type CategoryNavigationNode = ISeoCategory & {
  subcategories?: ISeoCategory[];
};

/**
 * Load navigation on the server, so category anchors are part of the HTML and
 * available even if the visitor (or crawler) does not execute JavaScript.
 * Caching avoids an API request on every page visit.
 */
export async function getServerCategoryNavigation(): Promise<
  CategoryNavigationNode[]
> {
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://mmsweden-server.onrender.com';

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, '')}/seo-categories/tree?activeOnly=true`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000),
      }
    );

    if (!response.ok) {
      console.error(`SEO category navigation: API status ${response.status}`);
      return [];
    }

    const categories: unknown = await response.json();

    if (!Array.isArray(categories)) return [];

    return categories.filter(
      (category): category is CategoryNavigationNode =>
        category !== null &&
        typeof category === 'object' &&
        typeof category.slug === 'string' &&
        category.slug.length > 0 &&
        typeof category.name === 'object'
    );
  } catch (error) {
    console.error('SEO category navigation: server fetch failed', error);
    return [];
  }
}
