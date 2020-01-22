export type ValueWithUnits = {
  value: number
  units: Units | null
}

export enum Units {
  in = 'in',
  ft = 'ft',
  mm = 'mm', // important that MM listed before m, so that greedy regex parsing doesn't pick up a 'mm' value as a 'm'
  m = 'm',
  cm = 'cm'
}
