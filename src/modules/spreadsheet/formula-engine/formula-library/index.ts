import { CellData } from '../../types';

export type FormulaFunction = (args: any[], cells: Record<string, CellData>) => any;

class FormulaRegistry {
  private registry: Record<string, FormulaFunction> = {};

  register(name: string, fn: FormulaFunction) {
    this.registry[name.toUpperCase()] = fn;
  }

  get(name: string): FormulaFunction | undefined {
    return this.registry[name.toUpperCase()];
  }

  has(name: string): boolean {
    return !!this.registry[name.toUpperCase()];
  }

  listFunctions(): string[] {
    return Object.keys(this.registry);
  }
}

export const formulaLibrary = new FormulaRegistry();
export default formulaLibrary;
