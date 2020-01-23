import convertUnits from 'convert-units'

type valueWithUnits = {
  value: number
  units: units | null
}

export enum units {
  in = 'in',
  ft = 'ft',
  mm = 'mm', // important that MM listed before m, so that greedy regex parsing doesn't pick up a 'mm' value as a 'm'
  m = 'm',
  cm = 'cm'
}
const INCH_EQUIVALENTS = ['"', '“', '”', 'inches']
const FEET_EQUIVALENTS = ["'", '‘', '’', 'feet']
const unitOptions: string[] = [...Object.values(units), ...INCH_EQUIVALENTS, ...FEET_EQUIVALENTS]

const mapRawUnit = (rawUnit: string): units => {
  const maybeUnit: units | undefined = (units as any)[rawUnit]
  if (maybeUnit !== undefined) {
    return maybeUnit
  }
  if (INCH_EQUIVALENTS.includes(rawUnit)) {
    return units.in
  } else if (FEET_EQUIVALENTS.includes(rawUnit)) {
    return units.ft
  } else {
    throw new Error(`Unknown unit ${rawUnit}`)
  }
}

const dimensionRegex = new RegExp(`([0-9./]+)(${unitOptions.join('|')})`, 'i')

const convertFractionToDecimal = (value: string) => {
  const [numerator, denominator] = value.split('/')
  const convertedNumerator = parseFloat(numerator)
  const convertedDenominator = parseFloat(denominator)
  if (isNaN(convertedNumerator)) {
    throw new Error(`Invalid numerator ${numerator}`)
  }
  if (isNaN(convertedDenominator)) {
    throw new Error(`Invalid denominator ${denominator}`)
  }
  if (convertedDenominator === 0) {
    throw new Error(`Divide by zero error`)
  }
  return convertedNumerator / convertedDenominator
}

/**
 *
 * @param dimensionValue string value to parse. For example, 1cm, 1 1/2", 1m, 2ft 6in
 * @param options Options determining how value will be parsed
 * @param options.defaultUnits Assumed units if none are specified on a string, default "in"
 * @param options.outputUnits Units output will be converted to. Default "in"
 */
export const parseDimension = (
  dimensionValue: string,
  {
    defaultUnits = units.in,
    outputUnits = units.in
  }: { defaultUnits?: units; outputUnits?: units } = {}
) => {
  const dimensionComponents = dimensionValue
    .split(dimensionRegex)
    .filter(p => p.trim() !== '')
    .map(p => p.toLowerCase())
    .reduce((acc, p) => {
      if (isNaN(Number(p))) {
        if (p.indexOf('/') > 0) {
          const decimalValue = convertFractionToDecimal(p)
          // if prev value exists, add to it . e.g. if raw value was 2 1/2", 2 will exist as a value, and we should add 1/2 to 2.
          if (acc.length > 0 && !acc[acc.length - 1].units) {
            const prev = acc[acc.length - 1]
            prev.value += decimalValue
          } else {
            acc.push({ value: decimalValue, units: null })
          }
        } else {
          const mappedUnit = mapRawUnit(p)
          if (acc.length > 0) {
            const lastValue = acc[acc.length - 1]
            if (lastValue.units) {
              throw new Error(`Value of ${lastValue} already has units of ${lastValue.units}`)
            } else {
              lastValue.units = mappedUnit
            }
          } else {
            throw new Error(`Units of ${mappedUnit} were provided with no value!`)
          }
        }
      } else {
        acc.push({ value: parseFloat(p), units: null })
      }
      return acc
    }, [] as valueWithUnits[])

  return dimensionComponents.reduce(
    (total, { value, units }) =>
      total +
      convertUnits(value)
        .from(units || defaultUnits)
        .to(outputUnits),
    0
  )
}
