import type { Plugin } from 'vite';

/**
 * Plugin to optimize CSS loading by adding preload hints
 */
export function criticalCssPlugin(): Plugin {
  return {
    name: 'critical-css-plugin',
    enforce: 'post',
    transformIndexHtml(html) {
      // Add preload for CSS files to reduce render blocking
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+\.css)"/g,
        '<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel=\'stylesheet\'" /><noscript><link rel="stylesheet" href="$1" /></noscript>'
      );
    }
  };
}
