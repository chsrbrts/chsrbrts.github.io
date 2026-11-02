# Chase Roberts

Personal website at https://chsrbrts.github.io/.

## Editing

- `src/content.json`: biography, experience, social links, books, and musings.
- `src/styles.css`: site styling.
- `src/main.js`: contact dialog enhancement.
- `scripts/render-pages.mjs`: generates static HTML, Markdown, JSON, and sitemap.
- `assets/`: local fonts, licensed icons, and circuit artwork.

Run `npm run build` after edits, then `npm test`. Commit the generated files alongside the source. No npm dependencies are required.

GitHub Pages publishes the root of `master`. `.nojekyll` ensures the generated static files are served directly.

## Content formats

All substantive content is present in HTML without JavaScript. `/index.md`, `/profile.json`, `/books.md`, and `/musings.md` expose the same public content. `/llms.txt` and `/sitemap.xml` provide discovery.

The selected layout is rendered at 70% scale. Books and Musings remain empty until recommendations and posts are added. Contact links work as a native dialog with a plain `/contact/` fallback.

## Licenses

Geist and Geist Mono (v1.9.0, from https://github.com/vercel/geist-font) are included under the SIL Open Font License in `assets/fonts/Geist-OFL.txt`. The arrow icon uses Feather’s MIT license in `assets/feather-LICENSE`. Circuit artwork was generated for this site.
