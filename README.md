# remark-inline-anchor

[![100% AI Slop](https://img.shields.io/badge/100%25-AI%20Slop-red)](https://github.com/sinokadev/aislop-badge)

A small Remark plugin for adding fragment-addressable anchors to Markdown text.
It supports both position markers (`{{id}}`) and phrase highlights
(`{{id:highlighted phrase}}`).

## Install

```sh
npm install remark-inline-anchor
```

## Astro setup

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import remarkInlineAnchor from 'remark-inline-anchor';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkInlineAnchor()],
  },
});
```

Add the stylesheet to your global CSS (for example `src/styles/global.css`):

```css
@import 'remark-inline-anchor/style.css';
```

Adjust `scroll-margin-top` in that stylesheet to match your fixed header.

## Syntax

```md
This paragraph has a position marker {{intro}} and a highlighted phrase
{{important:read this part}}.
```

Position markers become empty spans. When their fragment is active, CSS
highlights the containing paragraph or list item. Phrase markers wrap the
provided phrase and highlight only that phrase when targeted. Markers inside
fenced code blocks and inline code are left unchanged.

IDs may contain ASCII letters, digits, hyphens, and underscores. If the text
after the colon is empty or whitespace-only, the marker is treated as a
position marker.

## Options

```js
remarkInlineAnchor({
  className: 'inline-anchor',
  highlightClass: 'inline-anchor--highlight',
})
```

Both options are optional. `className` is applied to every generated anchor;
`highlightClass` is additionally applied to phrase anchors.

## CSS behavior

The supplied stylesheet uses `:target` and `:has()` and does not require
JavaScript. Untargeted anchors have no visible background or spacing. The
default scroll offset is `6rem`; override it for your site header.

## Publishing

Review the package name and version, then publish from this directory:

```sh
npm pack --dry-run
npm publish --access public
```

The package is ESM-only and requires Node.js 18 or newer.
