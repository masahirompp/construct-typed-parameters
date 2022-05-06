# construct-typed-parameters

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Type-safe parameter construction library. Useful for managing environment variables, aws parameter stores and more.

## Install

```bash
npm install construct-typed-parameters
```

## Usage

```ts
import { createTypedParameters } from 'construct-typed-parameters';

const parameters = createTypedParameters(parameterType => ({
  TOKEN: parameterType.String({ required: true }),
  FIREBASE_CONFIG: parameterType.Json<{ apiKey: string }>({ required: true }),
}));

const stringifiedParameters = parameters.stringify({
  TOKEN: 'xxxx',
  FIREBASE_CONFIG: { apiKey: 'xxxx' },
});
//=> { TOKEN: 'xxxx', FIREBASE_CONFIG: '{"apiKey":"xxxx"}'}

// set to Environment Variable
Object.entries(stringifiedParameters).forEach(
  ([parameterName, stringifiedValue]) => {
    process.env[parameterName] = stringifiedValue;
  }
);
//=>
// process.env.TOKEN: 'xxxx'
// process.env.FIREBASE_CONFIG: '{"apiKey":"xxxx"}'

// load from Environment Variable
const parsedParameters = parameters.parse({
  TOKEN: process.env.TOKEN,
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
});
//=> { TOKEN: 'xxxx', FIREBASE_CONFIG: { apiKey: 'xxxx' } }
```

### API

see `test/index.spec.ts`.

```ts
import { createTypedParameters } from 'construct-typed-parameters';

// type ParameterValidate<T> = (value: T) => string | string[] | null;

const parameters = createTypedParameters(pt => ({
  stringValue: pt.String({
    required: true,
    defaultValue: 'xxxx',
    validate: v => (v.includes('x') ? null : 'the value must contain x'),
  }),
  unionStringValue: pt.UnionString<'v1' | 'v2'>({
    required: true,
    defaultValue: 'v1',
    validate: v =>
      ['v1', 'v2'].includes(v) ? null : ['the value must be v1 or v2'],
  }),
  numberValue: pt.Number({
    required: true,
    defaultValue: 1,
    validate: v => (v === 0 ? 'value must not be 0' : ''),
  }),
  unionNumberValue: pt.UnionNumber<0 | 1>({
    required: true,
    defaultValue: 0,
    validate: v => ([0, 1].includes(v) ? null : 'the value must be 0 or 1'),
  }),
  booleanValue: pt.Boolean({
    required: true,
    defaultValue: true,
    validate: v => (v ? null : 'the value must be true'),
  }),
  jsonValue: pt.Json<{ apiKey: string }>({
    required: true,
    defaultValue: { apiKey: 'xxxx' },
    validate: v => (v.apiKey.length ? '' : 'apiKey must be specified'),
  }),
  arrayValue: pt.Json<string[]>({
    required: true,
    defaultValue: ['main', 'sub'],
    validate: v => (v.length ? [] : ['array must not empty']),
  }),
}));
```

[build-img]: https://github.com/masahirompp/construct-typed-parameters/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/masahirompp/construct-typed-parameters/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/construct-typed-parameters
[downloads-url]: https://www.npmtrends.com/construct-typed-parameters
[npm-img]: https://img.shields.io/npm/v/construct-typed-parameters
[npm-url]: https://www.npmjs.com/package/construct-typed-parameters
[issues-img]: https://img.shields.io/github/issues/masahirompp/construct-typed-parameters
[issues-url]: https://github.com/masahirompp/construct-typed-parameters/issues
[codecov-img]: https://codecov.io/gh/masahirompp/construct-typed-parameters/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/masahirompp/construct-typed-parameters
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
