/**
 * Remark plugin for {{id}} position anchors and {{id:text}} highlights.
 * Works on mdast text nodes, leaving inlineCode and code nodes untouched.
 * @param {{ className?: string, highlightClass?: string }} options
 */
export default function remarkInlineAnchor(options = {}) {
  const className = options.className ?? 'inline-anchor';
  const highlightClass = options.highlightClass ?? 'inline-anchor--highlight';
  const pattern = /\{\{([a-zA-Z0-9_-]+)(?::([^}]+))?\}\}/g;

  return (tree) => {
    function transform(parent) {
      if (!parent || !Array.isArray(parent.children)) return;
      const output = [];

      for (const node of parent.children) {
        if (node.type === 'text' && typeof node.value === 'string') {
          let lastIndex = 0;
          let match;
          pattern.lastIndex = 0;
          while ((match = pattern.exec(node.value)) !== null) {
            if (match.index > lastIndex) {
              output.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
            }
            const phrase = match[2];
            const highlighted = phrase !== undefined && phrase.trim().length > 0;
            const classes = highlighted ? `${className} ${highlightClass}` : className;
            const content = highlighted ? phrase : '';
            output.push({
              type: 'html',
              value: `<span id="${match[1]}" class="${escapeAttribute(classes)}">${escapeHtml(content)}</span>`,
            });
            lastIndex = pattern.lastIndex;
          }
          if (lastIndex < node.value.length || output.length === 0) {
            output.push({ type: 'text', value: node.value.slice(lastIndex) });
          }
        } else {
          // Recurse through paragraphs, list items, emphasis, links, and other containers.
          // Code and inlineCode have no children to transform and their values remain untouched.
          transform(node);
          output.push(node);
        }
      }
      parent.children = output;
    }
    transform(tree);
  };
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
