# parse-dimension

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Travis](https://img.shields.io/travis/tyschroed/parse-dimension)](https://travis-ci.org/tyschroed/parse-dimension)

## What is this?

This is a simple little utility to parse free text dimensions (i.e. 2ft, 1 1/2in, 6", 3cm) into their numerical values. It supports imperial and metric values, including shorthand equivalents. It even handles the pesky curly quotes that newer releases of iOS love to use!

## Getting Started

### Install

```bash
npm install parse-dimension
```

### Usage

```javascript
import { ParseDimension, Units } from 'parse-dimension'

ParseDimension(`3ft`)
// -> 36

ParseDimension(`1' 6"`)
// -> 18

ParseDimension(`24"`, { outputUnits: Units.ft })
// -> 2

ParseDimension(`2`, { defaultUnits: Units.ft })
// -> 24
```

### Options

The second parameter is an optional options object, with the following properties:

| Option       | Default  | Description                                          |
| ------------ | -------- | ---------------------------------------------------- |
| defaultUnits | Units.in | If no units provided, parser will assume these units |
| outputUnits  | Units.in | Dimensions that output will be converted to          |

For both options, valid values are one of:

```typescript
export enum Units {
  in = 'in',
  ft = 'ft',
  mm = 'mm',
  m = 'm',
  cm = 'cm'
}
```

:beers:
