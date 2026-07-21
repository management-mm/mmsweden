export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function safeDate(value?: string | Date | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function chunkArray<T>(items: readonly T[], chunkSize: number): T[][] {
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new RangeError('chunkSize must be a positive integer');
  }

  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

export function uniqueByLoc<T extends { loc: string }>(
  items: readonly T[]
): T[] {
  const uniqueItems = new Map<string, T>();

  for (const item of items) {
    const normalizedLoc = item.loc.trim();

    if (!normalizedLoc) {
      continue;
    }

    uniqueItems.set(normalizedLoc, item);
  }

  return Array.from(uniqueItems.values());
}
