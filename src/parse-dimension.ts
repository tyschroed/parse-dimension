import convertUnits from 'convert-units'
import { ValueWithUnits, Units } from './types'

const INCHES_EQUIVALENTS = ['"', '“', '”']
const FEET_EQUIVALENTS = ["'", '‘', '’']

const mapRawUnit = (rawUnit: string): Units => {
  const maybeUnit: Units | undefined = (Units as any)[rawUnit]
  if (maybeUnit !== undefined) {
    return maybeUnit
  }
  if (INCHES_EQUIVALENTS.includes(rawUnit)) {
    return Units.in
  } else if (FEET_EQUIVALENTS.includes(rawUnit)) {
    return Units.ft
  } else {
    throw new Error(`Unknown unit ${rawUnit}`)
  }
}
let unitOptions: string[] = [...Object.values(Units), ...INCHES_EQUIVALENTS, ...FEET_EQUIVALENTS]

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

const ParseDimension = (
  dimensionValue: string,
  {
    defaultUnits = Units.in,
    outputUnits = Units.in
  }: { defaultUnits?: Units; outputUnits?: Units } = {}
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
          }
        }
      } else {
        acc.push({ value: parseFloat(p), units: null })
      }
      return acc
    }, [] as ValueWithUnits[])

  return dimensionComponents.reduce(
    (total, { value, units }) =>
      total +
      convertUnits(value)
        .from(units || defaultUnits)
        .to(outputUnits),
    0
  )
}

export { Units }
export default ParseDimension
