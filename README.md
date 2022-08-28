# construct-typed-parameters

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Type-safe parameters construction library. Useful for managing Query Parameters, Environment Variables, AWS System Manager Parameter Store, and more.

## Install

```bash
npm install construct-typed-parameters
```

## Usage

### Basic

```ts
import { TypedParameters } from 'construct-typed-parameters';

const parameters = new TypedParameters(parameterType => ({
  TOKEN: parameterType.string({ required: true }),
  FIREBASE_CONFIG: parameterType.json<{ apiKey: string }>({ required: true }),
}));

const stringifiedParameters = parameters.stringify({
  TOKEN: 'xxxx',
  FIREBASE_CONFIG: { apiKey: 'xxxx' },
});
//=> { TOKEN: 'xxxx', FIREBASE_CONFIG: '{"apiKey":"xxxx"}'}

const parsedParameters = parameters.parse({
  TOKEN: 'xxxx',
  FIREBASE_CONFIG: '{"apiKey":"xxxx"}',
});
//=> { TOKEN: 'xxxx', FIREBASE_CONFIG: { apiKey: 'xxxx' }}
```

#### AutoCompletion

![AutoCompletion](https://github.com/masahirompp/images/blob/main/construct-typed-parameters.png?raw=true)

### with Query Parameters

```ts
const queryString = new URLSearchParams(
  parameters.stringify({
    TOKEN: 'xxxx',
    FIREBASE_CONFIG: { apiKey: 'xxxx' },
  })
).toString();
//=> 'TOKEN=xxxx&FIREBASE_CONFIG=%7B%22apiKey%22%3A%22xxxx%22%7D'

const parsedParameters = parameters.parse(
  Object.fromEntries(
    new URLSearchParams(
      'TOKEN=xxxx&FIREBASE_CONFIG=%7B%22apiKey%22%3A%22xxxx%22%7D'
    ).entries()
  )
);
//=> { TOKEN: 'xxxx', FIREBASE_CONFIG: { apiKey: 'xxxx' } }
```

### with Environment Variables

```ts
Object.entries(
  parameters.stringify({
    TOKEN: 'xxxx',
    FIREBASE_CONFIG: { apiKey: 'xxxx' },
  })
).forEach(([parameterName, stringifiedValue]) => {
  process.env[parameterName] = stringifiedValue;
});
//=>
// process.env.TOKEN: 'xxxx'
// process.env.FIREBASE_CONFIG: '{"apiKey":"xxxx"}'

const parsedParameters = parameters.parse({
  TOKEN: process.env.TOKEN,
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
});
//=> { TOKEN: 'xxxx', FIREBASE_CONFIG: { apiKey: 'xxxx' } }
```

### with AWS SSM Parameter Store

see <https://github.com/masahirompp/ssm-parameters-boot>

## API

see `test/index.spec.ts`.

### TypedParameters

#### Constructor

```ts
import { TypedParameters } from 'construct-typed-parameters';

const parameters = new TypedParameters(pt => ({
  stringValue: pt.string({
    // required: boolean
    required: true,
    // defaultValue?: T1
    defaultValue: 'xxxx',
    // validate?: (value: T1) => string | string[] | null;
    validate: v => (v.includes('x') ? null : 'the value must contain x'),
  }),
  unionStringValue: pt.unionString<'v1' | 'v2'>({
    required: true,
    defaultValue: 'v1',
    validate: v =>
      ['v1', 'v2'].includes(v) ? null : 'the value must be v1 or v2',
  }),
  numberValue: pt.number({
    required: true,
    defaultValue: 1,
    validate: v => (v === 0 ? 'value must not be 0' : null),
  }),
  unionNumberValue: pt.unionNumber<0 | 1>({
    required: true,
    defaultValue: 0,
    validate: v => ([0, 1].includes(v) ? null : 'the value must be 0 or 1'),
  }),
  booleanValue: pt.boolean({
    required: true,
    defaultValue: true,
    validate: v => (v ? null : 'the value must be true'),
  }),
  jsonValue: pt.json<{ apiKey: string }>({
    required: true,
    defaultValue: { apiKey: 'xxxx' },
    validate: v => (v.apiKey.length ? null : 'apiKey must be specified'),
  }),
  arrayValue: pt.json<string[]>({
    required: true,
    defaultValue: ['main', 'sub'],
    validate: v => (v.length ? null : 'array must not empty'),
  }),
}));
```

#### Method

```ts
parameters.parse(
  stringifiedParameters: Partial<StringifiedParameters<T>>,
  shouldValidate = true
) : ParsedParameters<T>

parameters.stringify(
  parsedParameters: Partial<ParsedParameters<T>>,
  shouldValidate = true
) : StringifiedParameters<T>
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
