# UI5 Module Loader

## Description

This library was develop with the intention of importing SAP UI5 modules (created with `sap.ui.define`) into NodeJS applications. This allows the developer to isolate UI5 components and inject dependencies, hence, enabling to create isolated test environment.

## Examples

#### Import any UI5 class

```js
const loader = require('ui5-module-loader');
let loaded_module = loader.import('/test/example/UI5ModuleExample');
```

#### Import UI5 class injecting a dependency

```js
const loader = require('ui5-module-loader');

const Constants = {
  key: 'value'
};

let loaded_module = loader.import('/test/example/UI5ModuleExample', [ Constants ]);
```

UI5 Class:

```js
sap.ui.define(['/path/to/constants'], function(Constants) {
  // ...
});
```

#### Improt UI5 class injecting sap global variable

```js
const loader = require('ui5-module-loader');

const Constants = { key: 'value' };
const SAP = {
  value: 'bar'
};

let loaded_module = loader.import('/test/example/UI5ModuleExample', [ Constants ], SAP);
```

UI5 Class:

```js
sap.ui.define(['/path/to/constants'], function(Constants) {
  // ...
  var foo = sap.value // customValue
  // ...
});
```

Check `test/apiTest.js` for all use cases.
