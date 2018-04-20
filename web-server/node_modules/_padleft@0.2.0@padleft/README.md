# padleft
*Simple JS String padLeft implementation*

This adds a `padLeft` fn to String's prototype
Also adds a `padRight` fn to same prototype

### 1. Install & configure

`npm install --save padleft`

```js
require('padleft');
```

### 2. Usage

```js
'4'.padLeft(4, '0'); // 0004

'4'.padRight(4, '0'); // 4000
```

### Spec

`padLeft( length, charToAdd )`

`padRight( length, charToAdd )`
