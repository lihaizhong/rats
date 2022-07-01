// * https://www.npmjs.com/package/quill-delta-to-html
var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

// TypeScript / ES6:
// import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

var deltaOps = [
  {
    insert: 'Hello '
  },
  {
    insert: 'World!',
    attributes: {
      size: '18px',
      color: '#333333',
      lineHeight: '24px',
      fontWeight: '600'
    }
  },
  {
    insert: '\n',
    attributes: {
      header: false
    }
  },
  {
    insert: 'World!',
    attributes: {
      size: '18px',
      color: '#333333',
      lineHeight: '24px',
      fontWeight: '600'
    }
  },
];

var cfg = {
  inlineStyles: {
    font: {
      'serif': 'font-family: Georgia, Times New Roman, serif',
      'monospace': 'font-family: Monaco, Courier New, monospace'
    },
    size: (value, op) => {
      console.log('【font-size】', value)
      return `font-size: ${value}`
    }
  },
  customCssStyles: (op) => {
    const extensions = {
      lineHeight: 'line-height',
      fontWeight: 'font-weight'
    }

    return Object.keys(op.attributes).reduce((styles, key) => {
      const property = extensions[key]
      if (property) {
        const value = op.attributes[key]

        styles.push(`${property}: ${value}`)
      }

      return styles
    }, [])
  }
};

var converter = new QuillDeltaToHtmlConverter(deltaOps, cfg);

var html = converter.convert();

console.log(html);
