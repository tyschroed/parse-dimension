export type ValueWithUnits = {
  value: number
  units: AvailableUnits | null
}

export enum AvailableUnits {
  in = 'in',
  ft = 'ft',
  mm = 'mm', //important that MM listed before m, so that greedy regex parsing doesn't pick up a 'mm' value as a 'm'
  m = 'm',
  cm = 'cm'
}
