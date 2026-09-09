/**
 * Locale registry for the showcase site.
 *
 * Adding a language is a two-step change:
 *   1. Copy `web/locales/en/` to `web/locales/<tag>/` and translate every value.
 *   2. Add the tag to `locales` and its endonym to `localeLabels` below.
 *
 * The header language toggle renders from this registry — no component changes required.
 * See CONTRIBUTING.md → "Web localization contribution path".
 */

export const defaultLocale = 'en';

export const locales = ['en', 'es', 'pt'];

/** Always the endonym — the language's own name for itself. */
export const localeLabels = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
};

/** Text direction per locale. Set 'rtl' when adding a right-to-left language. */
export const localeDir = {
  en: 'ltr',
  es: 'ltr',
  pt: 'ltr',
};

/**
 * Locale resolution strategy, in priority order.
 * URL segment wins so that every page is shareable in-language.
 */
export const resolutionOrder = ['url-segment', 'stored-preference', 'accept-language', 'default'];

export const isSupported = (tag) => locales.includes(tag);
