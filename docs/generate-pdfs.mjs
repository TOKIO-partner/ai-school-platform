#!/usr/bin/env node

/**
 * Generate infrastructure plan PDFs from HTML templates.
 * Uses Playwright with Chrome to render HTML → PDF with Japanese fonts.
 *
 * Usage: node docs/generate-pdfs.mjs
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

// Resolve playwright from global npm modules
const require = createRequire('/opt/homebrew/lib/node_modules/@playwright/cli/node_modules/');
const { chromium } = require('playwright');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = [
  { html: 'infra-plan-A-paas.html', pdf: 'infra-plan-A-paas.pdf' },
  { html: 'infra-plan-B-vps.html', pdf: 'infra-plan-B-vps.pdf' },
  { html: 'infra-plan-C-aws-lite.html', pdf: 'infra-plan-C-aws-lite.pdf' },
  { html: 'infra-plan-comparison.html', pdf: 'infra-plan-comparison.pdf' },
];

async function main() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext();

  for (const { html, pdf } of files) {
    const htmlPath = resolve(join(__dirname, 'html', html));
    const pdfPath = resolve(join(__dirname, pdf));

    console.log(`Generating: ${pdf}`);
    const page = await context.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

    // Wait for Google Fonts to load
    await page.waitForTimeout(2000);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await page.close();
    console.log(`  -> ${pdfPath}`);
  }

  await browser.close();
  console.log('\nDone! All PDFs generated.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
