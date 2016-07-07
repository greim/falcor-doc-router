/*eslint-env mocha */
'use strict';

const assert = require('assert');
const docRouter = require('../');
const GraphDescriptorNode = require('./graph-descriptor-node');
const React = require('react');
const reactDomServer = require('react-dom/server');
const cheerio = require('cheerio');

describe('graph-descriptor-node', () => {

  it('should render to string', () => {
    const html = stringify([{ route: 'foo.bar' }]);
    assert.strictEqual(typeof html, 'string');
  });

  it('should render a li at root', () => {
    const $ = $ify([{ route: 'foo.bar' }]);
    assert.strictEqual($(':root')[0].name, 'li');
  });

  it('should render collapsed by default', () => {
    const $ = $ify([
      { route: 'foo.bar.baz' },
    ], { /* expanded: true */ });
    assert.strictEqual($('li li').length, 0);
  });

  it('should render expanded if prop passed', () => {
    const $ = $ify([
      { route: 'foo.bar.baz' },
    ], { expanded: true });
    assert.strictEqual($('li li li').length, 1);
  });
});

function stringify(routes, passedProps) {
  const descriptor = docRouter.createClass(routes).descriptor();
  const child = descriptor.children[0];
  const props = Object.assign({}, passedProps, { node: child, path: [child], steps: [true] });
  const reactEl = React.createElement(GraphDescriptorNode, props);
  const html = reactDomServer.renderToStaticMarkup(reactEl);
  return html;
}

function $ify(routes, passedProps) {
  const html = stringify(routes, passedProps);
  const $ = cheerio.load(html);
  return $;
}
