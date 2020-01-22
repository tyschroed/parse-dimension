import dimensionsParser from '../src/parse-dimension'
import { Units } from '../src/parse-dimension'
import convertUnits from 'convert-units'

test('parse feet to inches', () => {
  const result = dimensionsParser("1'")
  expect(result).toBe(12)
})

test('assume default dimension of inches', () => {
  const result = dimensionsParser('1')
  expect(result).toBe(1)
})

test('disregard whitespace between parts', () => {
  const result = dimensionsParser('1\'6"')
  expect(result).toBe(18)
})
test('fractions should convert', () => {
  const result = dimensionsParser("1 1/2'")
  expect(result).toBe(18)
})

test('mix of units with fractions should convert', () => {
  const result = dimensionsParser('1\' 1/2"')
  expect(result).toBe(12.5)
})

test('allow whitespace between parts', () => {
  const result = dimensionsParser('1\' 6"')
  expect(result).toBe(18)
})

test('convert centimeters to inches', () => {
  const result = dimensionsParser('4cm')
  expect(result).toBe(
    convertUnits(4)
      .from('cm')
      .to('in')
  )
})

test('convert meters to inches', () => {
  const result = dimensionsParser('4m')
  expect(result).toBe(
    convertUnits(4)
      .from('m')
      .to('in')
  )
})

test('convert mm to inches', () => {
  const result = dimensionsParser('4mm')
  expect(result).toBe(
    convertUnits(4)
      .from('mm')
      .to('in')
  )
})

test('convert mm to inches', () => {
  const result = dimensionsParser('4ft', { outputUnits: Units.mm })
  expect(result).toBe(
    convertUnits(4)
      .from('ft')
      .to('mm')
  )
})

test('should convert with different default dimensions', () => {
  const result = dimensionsParser('4', { defaultUnits: Units.cm })
  expect(result).toBe(
    convertUnits(4)
      .from('cm')
      .to('in')
  )
})

test('Allow curly quotes', () => {
  const result = dimensionsParser('1‘ 6“')
  expect(result).toBe(18)
})

test('invalid unit should throw', () => {
  const invalidDimension = () => {
    dimensionsParser('4lol')
  }
  expect(invalidDimension).toThrow('Unknown unit')
})
test('multiple units should throw', () => {
  const invalidDimension = () => {
    dimensionsParser('4cmin')
  }
  expect(invalidDimension).toThrow('already has units')
})

test('divide by zero should throw', () => {
  const invalidDimension = () => {
    dimensionsParser('4/0')
  }
  expect(invalidDimension).toThrow('Divide by zero error')
})

test('invalid numerator should throw', () => {
  const invalidDimension = () => {
    dimensionsParser('z/1')
  }
  expect(invalidDimension).toThrow('Invalid numerator')
})

test('invalid denominator should throw', () => {
  const invalidDimension = () => {
    dimensionsParser('1/z')
  }
  expect(invalidDimension).toThrow('Invalid denominator')
})
