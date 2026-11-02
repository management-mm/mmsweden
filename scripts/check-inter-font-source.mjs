#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('app/globals.css', 'utf8');
const layout = readFileSync('app/[locale]/layout.tsx', 'utf8');

const checks = [
  [
    'Next.js uses its own local Inter font variable',
    () => {
      assert.match(layout, /localFont\s*\(/);
      assert.match(layout, /variable:\s*'--font-inter-loaded'/);
      assert.match(layout, /className=\{inter\.variable\}/);
    },
  ],
  [
    'Tailwind font-inter uses the same font source',
    () => {
      assert.match(
        css,
        /@theme\s+inline\s*\{[^}]*--font-inter:\s*var\(--font-inter-loaded\),\s*sans-serif/s
      );
    },
  ],
  [
    'Old duplicate Inter @font-face rules are removed',
    () => {
      assert.doesNotMatch(css, /font-family:\s*['"]Inter['"]/);
      assert.doesNotMatch(css, /\/fonts\/inter\/Inter-/);
    },
  ],
  [
    'The existing Open Sans font remains intact',
    () => {
      assert.match(css, /font-family:\s*'Open Sans'/);
    },
  ],
  [
    'All five original Inter weights remain defined',
    () => {
      for (const weight of ['400', '500', '600', '700', '900']) {
        assert.match(layout, new RegExp(`weight:\\s*'${weight}'`));
      }
    },
  ],
];
let failures = 0;
for (const [name, fn] of checks) {
  try {
    fn();
    console.log(`OK: ${name}`);
  } catch (e) {
    failures++;
    console.error(`FAIL: ${name}`);
    console.error(e.message);
  }
}
if (failures) process.exitCode = 1;
