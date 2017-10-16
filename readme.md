# Self-Documenting Falcor Router

This lib is drop-in replacement for [`FalcorRouter.createClass()`](https://github.com/Netflix/falcor-router).
The resulting class can be used to create Falcor router instances per usual, but has one additional static method `.descriptor()` which returns a JSON object containing metadata about your JSON graph.
This metadata is assembled using only information you provide in the routes array passed to `createClass`.
This descriptor object can then be used to render documentation for your Falcor JSON graph.

A `GraphDescriptor` React component is also provided which can be used to render an HTML view of that object.

## Installation

```
npm install falcor-doc-router
```

## Requirements

This lib is designed to run on Node.js 4.x and higher.
The react components are run through the `es2015` and `react` babel presets before publish, so will run inside all modern JS engines.

## Usage Example

```js
// in node.js
var reactDomServer = require('react-dom/server');
var React = require('react');
var docRouter = require('falcor-doc-router');
var GraphDescriptor = require('falcor-doc-router/graph-descriptor');

// This is a server-side rendering example but it
// could also be rendered on the client using the
// same react component.
var Router = docRouter.createClass([ ...your routes... ]);
var descriptor = Router.descriptor();
var reactEl = React.createElement(GraphDescriptor, { descriptor });
var html = reactDomServer.renderToStaticMarkup(reactEl);
```

## Annotations

In order for your JSON graph documentation to contain type information, you need to provide a `returns` annotation for each route.
These are purely advisory and only affect falcor-doc-router, and are otherwise ignored by Falcor and Falcor Router.
For example:

```js
var Router = docRouter.createClass([{
  route: 'users[{keys:id}]["username","email"]',
  returns: 'string',
  get() { ... },
  set() { ... }
}, {
  route: 'users[{keys:id}].follower_list[{ranges:indices}]',
  returns: 'reference to ["users", id]',
  get() { ... }
}, {
  route: 'users[{keys:id}].follower_list.length',
  returns: 'integer',
  get() { ... }
}]);
```

## Screenshot

Example screenshot of output.

![image](https://cloud.githubusercontent.com/assets/317786/13714536/63faea7e-e78c-11e5-94c3-f5f772c6cd52.png)
