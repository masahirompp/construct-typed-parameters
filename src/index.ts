export type ParameterValidate<T> = (value: T) => string | string[] | null;

export type ParameterConstruct<T> = {
  stringify: (value: T) => string;
  parse: (serialized: string) => T;
  validate?: ParameterValidate<T>;
  required: boolean;
  defaultValue?: T;
};

export type ParsedParameters<
  T extends Record<string, ParameterConstruct<any>>
> = {
  [P in keyof T]: T[P] extends ParameterConstruct<infer R>
    ? R extends { defaultValue: undefined; required: false }
      ? R | undefined
      : R
    : never;
};

export type StringifiedParameters<
  T extends Record<string, ParameterConstruct<any>>
> = {
  [P in keyof T]: T[P] extends ParameterConstruct<infer R>
    ? R extends { defaultValue: undefined; required: false }
      ? string | undefined
      : string
    : never;
};

export class ParameterError extends Error {
  constructor(
    public requiredErrorParameterNames: string[],
    public validationErrorParameterMap: Record<string, string[]>,
    public serialized: any,
    public parsed: any
  ) {
    const requiredErrorMessage = requiredErrorParameterNames.length
      ? requiredErrorParameterNames.map(p => `${p} is required`).join(', ')
      : '';
    const validationErrorMessage = Object.keys(validationErrorParameterMap)
      .length
      ? Object.entries(validationErrorParameterMap)
          .flatMap(([parameterName, errors]) =>
            errors.map(err => `${parameterName}: ${err}`)
          )
          .join(', ')
      : '';
    const errorMessage =
      requiredErrorMessage && validationErrorMessage
        ? `${requiredErrorMessage}. ${validationErrorMessage}.`
        : `${requiredErrorMessage}${validationErrorMessage}.`;
    super(errorMessage);
    Object.setPrototypeOf(this, ParameterError.prototype);
  }
}

const createParameterConstruct: <T>(
  args: ParameterConstruct<T>
) => ParameterConstruct<T> = s => s;

const createStringParameterConstruct = (args: {
  required: boolean;
  defaultValue?: string;
  validate?: ParameterValidate<string>;
}) =>
  createParameterConstruct<string>({
    stringify: s => s,
    parse: s => s,
    ...args,
  });

const createUnionStringParameterConstruct = <U extends string>(args: {
  required: boolean;
  defaultValue?: U;
  validate?: ParameterValidate<U>;
}) =>
  createStringParameterConstruct(
    args as never
  ) as unknown as ParameterConstruct<U>;

const createNumberParameterConstruct = (args: {
  required: boolean;
  defaultValue?: number;
  validate?: ParameterValidate<number>;
}) =>
  createParameterConstruct<number>({
    stringify: n => `${n}`,
    parse: s => Number(s),
    ...args,
  });

const createUnionNumberParameterConstruct = <U extends number>(args: {
  required: boolean;
  defaultValue?: U;
  validate?: ParameterValidate<U>;
}) =>
  createNumberParameterConstruct(
    args as never
  ) as unknown as ParameterConstruct<U>;

const createBooleanParameterConstruct = (args: {
  required: boolean;
  defaultValue?: boolean;
  validate?: ParameterValidate<boolean>;
}) =>
  createParameterConstruct<boolean>({
    stringify: b => b.toString(),
    parse: s => s === 'true',
    ...args,
  });

const createJsonParameterConstruct = <
  T extends Record<string, unknown> | Array<unknown>
>(args: {
  required: boolean;
  defaultValue?: T;
  validate?: ParameterValidate<T>;
}) =>
  createParameterConstruct({
    stringify: j => JSON.stringify(j),
    parse: s => JSON.parse(s) as T,
    ...args,
  });

const ParameterType = {
  String: createStringParameterConstruct,
  UnionString: createUnionStringParameterConstruct,
  Number: createNumberParameterConstruct,
  UnionNumber: createUnionNumberParameterConstruct,
  Boolean: createBooleanParameterConstruct,
  Json: createJsonParameterConstruct,
  Custom: createParameterConstruct,
};

export class TypedParameters<
  T extends Record<string, ParameterConstruct<any>>
> {
  private readonly parametersConstruct: T;

  constructor(
    defineParametersConstruct: (parameterType: typeof ParameterType) => T
  ) {
    this.parametersConstruct = defineParametersConstruct(ParameterType);
  }

  parse(
    stringifiedParameters: Partial<StringifiedParameters<T>>,
    shouldValidate = true
  ) {
    const requiredErrorParameters: string[] = [];
    const validationErrorParameterMap: Record<string, string[]> = {};
    const result = Object.entries(this.parametersConstruct).reduce<
      ParsedParameters<T>
    >((payload, [parameterName, construct]) => {
      const value = (() => {
        const serialized = stringifiedParameters[parameterName];
        const parsedValue =
          typeof serialized === 'string'
            ? construct.parse(serialized)
            : undefined;
        if (parsedValue != null) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return parsedValue;
        }
        if (construct.defaultValue != null) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return construct.defaultValue;
        }
        if (shouldValidate && construct.required) {
          requiredErrorParameters.push(parameterName);
        }
        return undefined;
      })();

      if (
        shouldValidate &&
        value != null &&
        typeof construct.validate === 'function'
      ) {
        const validationError = construct.validate(value);
        if (validationError) {
          if (Array.isArray(validationError)) {
            if (validationError.length) {
              validationErrorParameterMap[parameterName] = validationError;
            }
          } else {
            validationErrorParameterMap[parameterName] = [validationError];
          }
        }
      }

      return {
        ...payload,
        [parameterName]: value,
      };
    }, {} as never);

    if (
      requiredErrorParameters.length ||
      Object.keys(validationErrorParameterMap).length
    ) {
      throw new ParameterError(
        requiredErrorParameters,
        validationErrorParameterMap,
        stringifiedParameters,
        result
      );
    }
    return result;
  }

  stringify(
    parsedParameters: Partial<ParsedParameters<T>>,
    shouldValidate = true
  ) {
    const requiredErrorParameters: string[] = [];
    const validationErrorParameterMap: Record<string, string[]> = {};
    const result = Object.entries(this.parametersConstruct).reduce<
      StringifiedParameters<T>
    >((payload, [parameterName, construct]) => {
      const serialized = (() => {
        const value = parsedParameters[parameterName];

        if (
          shouldValidate &&
          value != null &&
          typeof construct.validate === 'function'
        ) {
          const validationError = construct.validate(value);
          if (validationError) {
            if (Array.isArray(validationError)) {
              if (validationError.length) {
                validationErrorParameterMap[parameterName] = validationError;
              }
            } else {
              validationErrorParameterMap[parameterName] = [validationError];
            }
          }
        }

        const serializedValue =
          value != null ? construct.stringify(value) : undefined;
        if (serializedValue != null) {
          return serializedValue;
        }
        if (construct.defaultValue != null) {
          const serializedDefaultValue = construct.stringify(
            construct.defaultValue
          );
          if (serializedDefaultValue != null) {
            return serializedDefaultValue;
          }
        }
        if (shouldValidate && construct.required) {
          requiredErrorParameters.push(parameterName);
        }
        return undefined;
      })();

      return {
        ...payload,
        [parameterName]: serialized,
      };
    }, {} as never);

    if (
      requiredErrorParameters.length ||
      Object.keys(validationErrorParameterMap).length
    ) {
      throw new ParameterError(
        requiredErrorParameters,
        validationErrorParameterMap,
        result,
        parsedParameters
      );
    }
    return result;
  }
}
