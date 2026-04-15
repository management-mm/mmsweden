import { buildUrlSetXml, xmlResponse } from '@lib/sitemap/xml';

export async function GET() {
  return xmlResponse(buildUrlSetXml([]));
}
