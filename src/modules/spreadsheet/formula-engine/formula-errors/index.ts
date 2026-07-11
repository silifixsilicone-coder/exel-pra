export enum FormulaError {
  DIV0 = '#DIV/0!',
  VALUE = '#VALUE!',
  REF = '#REF!',
  NAME = '#NAME?',
  NUM = '#NUM!',
  NA = '#N/A',
  CIRC = '#CIRC!'
}

export function isFormulaError(val: any): boolean {
  return Object.values(FormulaError).includes(val);
}
