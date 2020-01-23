import { units, parseDimension } from '../src/parse-dimension'
import convertUnits from 'convert-units'

test('parse feet to inches', () => {
  const result = parseDimension(`1'`)
  expect(result).toBe(12)
})

test('assume default dimension of inches', () => {
  const result = parseDimension('1')
  expect(result).toBe(1)
})

test('disregard whitespace between parts', () => {
  const result = parseDimension('1\'6"')
  expect(result).toBe(18)
})
test('fractions should convert', () => {
  const result = parseDimension("1 1/2'")
  expect(result).toBe(18)
})

test('mix of units with fractions should convert', () => {
  const result = parseDimension('1\' 1/2"')
  expect(result).toBe(12.5)
})

test('allow whitespace between parts', () => {
  const result = parseDimension('1\' 6"')
  expect(result).toBe(18)
})

test('convert centimeters to inches', () => {
  const result = parseDimension('4cm')
  expect(result).toBe(
    convertUnits(4)
      .from('cm')
      .to('in')
  )
})

test('convert meters to inches', () => {
  const result = parseDimension('4m')
  expect(result).toBe(
    convertUnits(4)
      .from('m')
      .to('in')
  )
})

test('convert mm to inches', () => {
  const result = parseDimension('4mm')
  expect(result).toBe(
    convertUnits(4)
      .from('mm')
      .to('in')
  )
})

test('convert mm to inches', () => {
  const result = parseDimension('4ft', { outputUnits: units.mm })
  expect(result).toBe(
    convertUnits(4)
      .from('ft')
      .to('mm')
  )
})

test('should convert with different default dimensions', () => {
  const result = parseDimension('4', { defaultUnits: units.cm })
  expect(result).toBe(
    convertUnits(4)
      .from('cm')
      .to('in')
  )
})

test('Allow curly quotes', () => {
  const result = parseDimension('1‘ 6“')
  expect(result).toBe(18)
})

test('multiple values with no units should throw error', () => {
  const invalidDimension = () => {
    parseDimension('mm')
  }
  expect(invalidDimension).toThrow('provided with no value')
})

test('invalid unit should throw', () => {
  const invalidDimension = () => {
    parseDimension('4lol')
  }
  expect(invalidDimension).toThrow('Unknown unit')
})
test('multiple units should throw', () => {
  const invalidDimension = () => {
    parseDimension('4cmin')
  }
  expect(invalidDimension).toThrow('already has units')
})

test('divide by zero should throw', () => {
  const invalidDimension = () => {
    parseDimension('4/0')
  }
  expect(invalidDimension).toThrow('Divide by zero error')
})

test('invalid numerator should throw', () => {
  const invalidDimension = () => {
    parseDimension('z/1')
  }
  expect(invalidDimension).toThrow('Invalid numerator')
})

test('invalid denominator should throw', () => {
  const invalidDimension = () => {
    parseDimension('1/z')
  }
  expect(invalidDimension).toThrow('Invalid denominator')
})
