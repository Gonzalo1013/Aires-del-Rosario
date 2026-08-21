// eslint.config.js
import js from '@eslint/js';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import astroParser from 'astro-eslint-parser';
import astroPlugin from 'eslint-plugin-astro';

// Globales disponibles tanto en el navegador como en el frontmatter de Astro
// (que se ejecuta en Node durante el build).
const globals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  fetch: 'readonly',
  console: 'readonly',
};

export default [
  // Artefactos generados: ESLint 9 sólo ignora node_modules por defecto, así
  // que sin esto `eslint .` analiza el build y reporta cientos de falsos.
  { ignores: ['dist/**', '.astro/**'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        sourceType: 'module',
      },
      globals,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // tus reglas personalizadas si querés
    },
  },
  {
    // Herramientas de línea de comandos: corren en Node, no en el navegador.
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: { console: 'readonly', process: 'readonly' },
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser,
        extraFileExtensions: ['.astro'],
      },
      globals,
    },
    plugins: {
      astro: astroPlugin,
    },
    rules: {
      ...astroPlugin.configs.recommended.rules,
    },
  },
];
