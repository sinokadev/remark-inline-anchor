import { defineConfig } from 'astro/config';
import remarkInlineAnchor from './remark-inline-anchor.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkInlineAnchor()],
  },
});
