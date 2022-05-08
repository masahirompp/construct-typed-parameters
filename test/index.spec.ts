import { createTypedParameters, ParameterError } from '../src/index';

describe('index', () => {
  describe('all required without defaultValue.', () => {
    const parameters = createTypedParameters(pt => ({
      stringValue: pt.String({ required: true }),
      unionStringValue: pt.UnionString<'v1' | 'v2'>({ required: true }),
      numberValue: pt.Number({ required: true }),
      unionNumberValue: pt.UnionNumber<0 | 1>({ required: true }),
      booleanValue: pt.Boolean({ required: true }),
      jsonValue: pt.Json<{ apiKey: string }>({ required: true }),
      arrayValue: pt.Json<string[]>({ required: true }),
    }));

    it('parse', () => {
      expect(
        parameters.parse({
          stringValue: 'xxxx',
          unionStringValue: 'v1',
          numberValue: '1',
          unionNumberValue: '0',
          booleanValue: 'true',
          jsonValue: '{"apiKey":"xxxx"}',
          arrayValue: '["main", "sub"]',
        })
      ).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: 1,
        unionNumberValue: 0,
        booleanValue: true,
        jsonValue: { apiKey: 'xxxx' },
        arrayValue: ['main', 'sub'],
      });
    });

    it('parse required error', () => {
      expect(() => parameters.parse({})).toThrow(ParameterError);
      expect(() => parameters.parse({})).toThrow(
        'stringValue is required, unionStringValue is required, numberValue is required, unionNumberValue is required, booleanValue is required, jsonValue is required, arrayValue is required.'
      );
    });

    it('parse required error but should not validate', () => {
      expect(parameters.parse({}, false)).toEqual({});
    });

    it('stringify', () => {
      expect(
        parameters.stringify({
          stringValue: 'xxxx',
          unionStringValue: 'v1',
          numberValue: 1,
          unionNumberValue: 0,
          booleanValue: true,
          jsonValue: { apiKey: 'xxxx' },
          arrayValue: ['main', 'sub'],
        })
      ).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: '1',
        unionNumberValue: '0',
        booleanValue: 'true',
        jsonValue: '{"apiKey":"xxxx"}',
        arrayValue: '["main","sub"]',
      });
    });

    it('stringify required error', () => {
      expect(() => parameters.stringify({})).toThrow(ParameterError);
      expect(() => parameters.stringify({})).toThrow(
        'stringValue is required, unionStringValue is required, numberValue is required, unionNumberValue is required, booleanValue is required, jsonValue is required, arrayValue is required.'
      );
    });

    it('stringify required error but should not validate', () => {
      expect(parameters.stringify({}, false)).toEqual({});
    });
  });

  describe('all required with defaultValue.', () => {
    const parameters = createTypedParameters(pt => ({
      stringValue: pt.String({ required: true, defaultValue: 'xxxx' }),
      unionStringValue: pt.UnionString<'v1' | 'v2'>({
        required: true,
        defaultValue: 'v1',
      }),
      numberValue: pt.Number({ required: true, defaultValue: 1 }),
      unionNumberValue: pt.UnionNumber<0 | 1>({
        required: true,
        defaultValue: 0,
      }),
      booleanValue: pt.Boolean({ required: true, defaultValue: true }),
      jsonValue: pt.Json<{ apiKey: string }>({
        required: true,
        defaultValue: { apiKey: 'xxxx' },
      }),
      arrayValue: pt.Json<string[]>({
        required: true,
        defaultValue: ['main', 'sub'],
      }),
    }));

    it('parse specified value', () => {
      expect(
        parameters.parse({
          stringValue: 'yyyy',
          unionStringValue: 'v2',
          numberValue: '2',
          unionNumberValue: '1',
          booleanValue: 'false',
          jsonValue: '{"apiKey":"yyyy"}',
          arrayValue: '["wake", "up"]',
        })
      ).toEqual({
        stringValue: 'yyyy',
        unionStringValue: 'v2',
        numberValue: 2,
        unionNumberValue: 1,
        booleanValue: false,
        jsonValue: { apiKey: 'yyyy' },
        arrayValue: ['wake', 'up'],
      });
    });

    it('parse default value', () => {
      expect(parameters.parse({})).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: 1,
        unionNumberValue: 0,
        booleanValue: true,
        jsonValue: { apiKey: 'xxxx' },
        arrayValue: ['main', 'sub'],
      });
    });

    it('stringify specified value', () => {
      expect(
        parameters.stringify({
          stringValue: 'yyyy',
          unionStringValue: 'v2',
          numberValue: 2,
          unionNumberValue: 1,
          booleanValue: false,
          jsonValue: { apiKey: 'yyyy' },
          arrayValue: ['wake', 'up'],
        })
      ).toEqual({
        stringValue: 'yyyy',
        unionStringValue: 'v2',
        numberValue: '2',
        unionNumberValue: '1',
        booleanValue: 'false',
        jsonValue: '{"apiKey":"yyyy"}',
        arrayValue: '["wake","up"]',
      });
    });

    it('stringify default value', () => {
      expect(parameters.stringify({})).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: '1',
        unionNumberValue: '0',
        booleanValue: 'true',
        jsonValue: '{"apiKey":"xxxx"}',
        arrayValue: '["main","sub"]',
      });
    });
  });

  describe('all optional without defaultValue.', () => {
    const parameters = createTypedParameters(pt => ({
      stringValue: pt.String({ required: false }),
      unionStringValue: pt.UnionString<'v1' | 'v2'>({ required: false }),
      numberValue: pt.Number({ required: false }),
      unionNumberValue: pt.UnionNumber<0 | 1>({ required: false }),
      booleanValue: pt.Boolean({ required: false }),
      jsonValue: pt.Json<{ apiKey: string }>({ required: false }),
      arrayValue: pt.Json<string[]>({ required: false }),
    }));

    it('parse', () => {
      expect(
        parameters.parse({
          stringValue: 'xxxx',
          unionStringValue: 'v1',
          numberValue: '1',
          unionNumberValue: '0',
          booleanValue: 'true',
          jsonValue: '{"apiKey":"xxxx"}',
          arrayValue: '["main", "sub"]',
        })
      ).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: 1,
        unionNumberValue: 0,
        booleanValue: true,
        jsonValue: { apiKey: 'xxxx' },
        arrayValue: ['main', 'sub'],
      });
    });

    it('parse none', () => {
      expect(parameters.parse({})).toEqual({});
    });

    it('stringify', () => {
      expect(
        parameters.stringify({
          stringValue: 'xxxx',
          unionStringValue: 'v1',
          numberValue: 1,
          unionNumberValue: 0,
          booleanValue: true,
          jsonValue: { apiKey: 'xxxx' },
          arrayValue: ['main', 'sub'],
        })
      ).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: '1',
        unionNumberValue: '0',
        booleanValue: 'true',
        jsonValue: '{"apiKey":"xxxx"}',
        arrayValue: '["main","sub"]',
      });
    });

    it('stringify none', () => {
      expect(parameters.stringify({})).toEqual({});
    });
  });

  describe('all optional with defaultValue.', () => {
    const parameters = createTypedParameters(pt => ({
      stringValue: pt.String({ required: false, defaultValue: 'xxxx' }),
      unionStringValue: pt.UnionString<'v1' | 'v2'>({
        required: false,
        defaultValue: 'v1',
      }),
      numberValue: pt.Number({ required: false, defaultValue: 1 }),
      unionNumberValue: pt.UnionNumber<0 | 1>({
        required: false,
        defaultValue: 0,
      }),
      booleanValue: pt.Boolean({ required: false, defaultValue: true }),
      jsonValue: pt.Json<{ apiKey: string }>({
        required: false,
        defaultValue: { apiKey: 'xxxx' },
      }),
      arrayValue: pt.Json<string[]>({
        required: false,
        defaultValue: ['main', 'sub'],
      }),
    }));

    it('parse specified value', () => {
      expect(
        parameters.parse({
          stringValue: 'yyyy',
          unionStringValue: 'v2',
          numberValue: '2',
          unionNumberValue: '1',
          booleanValue: 'false',
          jsonValue: '{"apiKey":"yyyy"}',
          arrayValue: '["wake", "up"]',
        })
      ).toEqual({
        stringValue: 'yyyy',
        unionStringValue: 'v2',
        numberValue: 2,
        unionNumberValue: 1,
        booleanValue: false,
        jsonValue: { apiKey: 'yyyy' },
        arrayValue: ['wake', 'up'],
      });
    });

    it('parse default value', () => {
      expect(parameters.parse({})).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: 1,
        unionNumberValue: 0,
        booleanValue: true,
        jsonValue: { apiKey: 'xxxx' },
        arrayValue: ['main', 'sub'],
      });
    });

    it('stringify specified value', () => {
      expect(
        parameters.stringify({
          stringValue: 'yyyy',
          unionStringValue: 'v2',
          numberValue: 2,
          unionNumberValue: 1,
          booleanValue: false,
          jsonValue: { apiKey: 'yyyy' },
          arrayValue: ['wake', 'up'],
        })
      ).toEqual({
        stringValue: 'yyyy',
        unionStringValue: 'v2',
        numberValue: '2',
        unionNumberValue: '1',
        booleanValue: 'false',
        jsonValue: '{"apiKey":"yyyy"}',
        arrayValue: '["wake","up"]',
      });
    });

    it('stringify default value', () => {
      expect(parameters.stringify({})).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: '1',
        unionNumberValue: '0',
        booleanValue: 'true',
        jsonValue: '{"apiKey":"xxxx"}',
        arrayValue: '["main","sub"]',
      });
    });
  });

  describe('validation.', () => {
    const parameters = createTypedParameters(pt => ({
      stringValue: pt.String({
        required: true,
        validate: v => (v.includes('x') ? null : 'the value must contain x'),
      }),
      unionStringValue: pt.UnionString<'v1' | 'v2'>({
        required: true,
        validate: v =>
          ['v1', 'v2'].includes(v) ? null : ['the value must be v1 or v2'],
      }),
      numberValue: pt.Number({
        required: true,
        validate: v => (v === 0 ? 'value must not be 0' : ''),
      }),
      unionNumberValue: pt.UnionNumber<0 | 1>({
        required: true,
        validate: v => ([0, 1].includes(v) ? null : 'the value must be 0 or 1'),
      }),
      booleanValue: pt.Boolean({
        required: true,
        validate: v => (v ? null : 'the value must be true'),
      }),
      jsonValue: pt.Json<{ apiKey: string }>({
        required: true,
        validate: v => (v.apiKey.length ? '' : 'apiKey must be specified'),
      }),
      arrayValue: pt.Json<string[]>({
        required: true,
        validate: v => (v.length ? [] : ['array must not empty']),
      }),
    }));

    it('parse', () => {
      expect(
        parameters.parse({
          stringValue: 'xxxx',
          unionStringValue: 'v1',
          numberValue: '1',
          unionNumberValue: '0',
          booleanValue: 'true',
          jsonValue: '{"apiKey":"xxxx"}',
          arrayValue: '["main", "sub"]',
        })
      ).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: 1,
        unionNumberValue: 0,
        booleanValue: true,
        jsonValue: { apiKey: 'xxxx' },
        arrayValue: ['main', 'sub'],
      });
    });

    it('parse validation error', () => {
      expect(() =>
        parameters.parse({
          stringValue: 'yyyy',
          unionStringValue: 'v3',
          numberValue: '0',
          unionNumberValue: '-1',
          booleanValue: 'false',
          jsonValue: '{"apiKey":""}',
          arrayValue: '[]',
        })
      ).toThrow(ParameterError);
      expect(() =>
        parameters.parse({
          stringValue: 'yyyy',
          unionStringValue: 'v3',
          numberValue: '0',
          unionNumberValue: '-1',
          booleanValue: 'false',
          jsonValue: '{"apiKey":""}',
          arrayValue: '[]',
        })
      ).toThrow(
        'stringValue: the value must contain x, unionStringValue: the value must be v1 or v2, numberValue: value must not be 0, unionNumberValue: the value must be 0 or 1, booleanValue: the value must be true, jsonValue: apiKey must be specified, arrayValue: array must not empty.'
      );
    });

    it('parse validation error but should not validate', () => {
      expect(
        parameters.parse(
          {
            stringValue: 'yyyy',
            unionStringValue: 'v3',
            numberValue: '0',
            unionNumberValue: '-1',
            booleanValue: 'false',
            jsonValue: '{"apiKey":""}',
            arrayValue: '[]',
          },
          false
        )
      ).toEqual({
        arrayValue: [],
        booleanValue: false,
        jsonValue: {
          apiKey: '',
        },
        numberValue: 0,
        stringValue: 'yyyy',
        unionNumberValue: -1,
        unionStringValue: 'v3',
      });
    });

    it('parse required error and validation error', () => {
      expect(() =>
        parameters.parse({
          stringValue: 'yyyy',
          numberValue: '0',
          booleanValue: 'false',
          arrayValue: '[]',
        })
      ).toThrow(
        'unionStringValue is required, unionNumberValue is required, jsonValue is required. stringValue: the value must contain x, numberValue: value must not be 0, booleanValue: the value must be true, arrayValue: array must not empty.'
      );
    });

    it('parse required error and validation error, but should not validaet', () => {
      expect(
        parameters.parse(
          {
            stringValue: 'yyyy',
            numberValue: '0',
            booleanValue: 'false',
            arrayValue: '[]',
          },
          false
        )
      ).toEqual({
        stringValue: 'yyyy',
        numberValue: 0,
        booleanValue: false,
        arrayValue: [],
      });
    });

    it('stringify', () => {
      expect(
        parameters.stringify({
          stringValue: 'xxxx',
          unionStringValue: 'v1',
          numberValue: 1,
          unionNumberValue: 0,
          booleanValue: true,
          jsonValue: { apiKey: 'xxxx' },
          arrayValue: ['main', 'sub'],
        })
      ).toEqual({
        stringValue: 'xxxx',
        unionStringValue: 'v1',
        numberValue: '1',
        unionNumberValue: '0',
        booleanValue: 'true',
        jsonValue: '{"apiKey":"xxxx"}',
        arrayValue: '["main","sub"]',
      });
    });

    it('stringify validation error', () => {
      expect(() =>
        parameters.stringify({
          stringValue: 'yyyy',
          unionStringValue: 'v3' as never,
          numberValue: 0,
          unionNumberValue: -1 as never,
          booleanValue: false,
          jsonValue: { apiKey: '' },
          arrayValue: [],
        })
      ).toThrow(ParameterError);
      expect(() =>
        parameters.stringify({
          stringValue: 'yyyy',
          unionStringValue: 'v3' as never,
          numberValue: 0,
          unionNumberValue: -1 as never,
          booleanValue: false,
          jsonValue: { apiKey: '' },
          arrayValue: [],
        })
      ).toThrow(
        'stringValue: the value must contain x, unionStringValue: the value must be v1 or v2, numberValue: value must not be 0, unionNumberValue: the value must be 0 or 1, booleanValue: the value must be true, jsonValue: apiKey must be specified, arrayValue: array must not empty.'
      );
    });

    it('stringify validation error but should not validate', () => {
      expect(
        parameters.stringify(
          {
            stringValue: 'yyyy',
            unionStringValue: 'v3' as never,
            numberValue: 0,
            unionNumberValue: -1 as never,
            booleanValue: false,
            jsonValue: { apiKey: '' },
            arrayValue: [],
          },
          false
        )
      ).toEqual({
        stringValue: 'yyyy',
        unionStringValue: 'v3',
        numberValue: '0',
        unionNumberValue: '-1',
        booleanValue: 'false',
        jsonValue: '{"apiKey":""}',
        arrayValue: '[]',
      });
    });

    it('stringify required error and validation error', () => {
      expect(() =>
        parameters.stringify({
          unionStringValue: 'v3' as never,
          unionNumberValue: -1 as never,
          jsonValue: { apiKey: '' },
        })
      ).toThrow(
        'stringValue is required, numberValue is required, booleanValue is required, arrayValue is required. unionStringValue: the value must be v1 or v2, unionNumberValue: the value must be 0 or 1, jsonValue: apiKey must be specified.'
      );
    });

    it('stringify required error and validation error, but should not validate', () => {
      expect(
        parameters.stringify(
          {
            unionStringValue: 'v3' as never,
            unionNumberValue: -1 as never,
            jsonValue: { apiKey: '' },
          },
          false
        )
      ).toEqual({
        unionStringValue: 'v3',
        unionNumberValue: '-1',
        jsonValue: '{"apiKey":""}',
      });
    });
  });
});
