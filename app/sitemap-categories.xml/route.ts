import { buildCategoryEntries } from '@lib/sitemap/builders';
import { getSeoCategoriesForSitemap } from '@lib/sitemap/fetchers';
import { uniqueByLoc } from '@lib/sitemap/utils';
import { buildUrlSetXml, xmlResponse } from '@lib/sitemap/xml';

export async function GET() {
  const categories = await getSeoCategoriesForSitemap();
  const entries = uniqueByLoc(buildCategoryEntries(categories));

  return xmlResponse(buildUrlSetXml(entries));
}
