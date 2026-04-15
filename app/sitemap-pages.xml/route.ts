import { buildStaticPageEntries } from '@lib/sitemap/builders';
import { uniqueByLoc } from '@lib/sitemap/utils';
import { buildUrlSetXml, xmlResponse } from '@lib/sitemap/xml';

export async function GET() {
  const entries = uniqueByLoc(buildStaticPageEntries());
  return xmlResponse(buildUrlSetXml(entries));
}
