import Scalar from '../schema/Scalar'
import { stringifyNumber } from '../stringify'
import failsafe from './failsafe'
import { boolOptions, nullOptions } from './options'

export default failsafe.concat([
  {
    identify: value => value == null,
    createNode: (schema, value, ctx) =>
      ctx.wrapScalars ? new Scalar(null) : null,
    default: true,
    tag: 'tag:yaml.org,2002:null',
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => null,
    options: nullOptions,
    stringify: () => nullOptions.nullStr
  },
  {
    identify: value => typeof value === 'boolean',
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: str => str[0] === 't' || str[0] === 'T',
    options: boolOptions,
    stringify: ({ value }) =>
      value ? boolOptions.trueStr : boolOptions.falseStr
  },
  {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'OCT',
    test: /^0o([0-7]+)$/,
    resolve: (str, oct) => parseInt(oct, 8),
    stringify: ({ value }) => '0o' + value.toString(8)
  },
  {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^[-+]?[0-9]+$/,
    resolve: str => parseInt(str, 10),
    stringify: stringifyNumber
  },
  {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'HEX',
    test: /^0x([0-9a-fA-F]+)$/,
    resolve: (str, hex) => parseInt(hex, 16),
    stringify: ({ value }) => '0x' + value.toString(16)
  },
  {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^(?:[-+]?\.inf|(\.nan))$/i,
    resolve: (str, nan) =>
      nan
        ? NaN
        : str[0] === '-'
        ? Number.NEGATIVE_INFINITY
        : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber
  },
  {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'EXP',
    test: /^[-+]?(?:0|[1-9][0-9]*)(\.[0-9]*)?[eE][-+]?[0-9]+$/,
    resolve: str => parseFloat(str),
    stringify: ({ value }) => Number(value).toExponential()
  },
  {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?(?:0|[1-9][0-9]*)\.[0-9]*$/,
    resolve: str => parseFloat(str),
    stringify: stringifyNumber
  }
])
