'use strict';

/**
 * Sets locale = 'en' on all Page and Service entries that have no locale assigned.
 * Run after enabling i18n on these content types to recover pre-migration content.
 *
 * Usage: NODE_ENV=production node scripts/fix-locale.js
 */

async function fixLocales() {
  const tables = ['pages', 'services'];

  for (const table of tables) {
    const updated = await strapi.db.connection(table)
      .whereNull('locale')
      .update({ locale: 'en' });

    console.log(`${table}: updated ${updated} rows to locale='en'`);
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  try {
    await fixLocales();
    console.log('Done.');
  } catch (error) {
    console.error('Failed to fix locales:', error);
  }

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
