export class FormulaHistoryRegistry {
  private static HISTORY_KEY = 'spreadsheet_formula_history';
  private static FAVORITES_KEY = 'spreadsheet_formula_favorites';
  private static PINS_KEY = 'spreadsheet_formula_pins';
  private static MOST_USED_KEY = 'spreadsheet_formula_most_used';

  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  static getHistory(): string[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addHistory(name: string) {
    if (!this.isBrowser()) return;
    try {
      const history = this.getHistory();
      const upper = name.toUpperCase();
      const filtered = history.filter(item => item !== upper);
      filtered.unshift(upper);
      if (filtered.length > 10) {
        filtered.pop();
      }
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
      this.incrementUsage(upper);
    } catch (e) {
      console.error('Failed to update history', e);
    }
  }

  static getFavorites(): string[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(this.FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static toggleFavorite(name: string): boolean {
    if (!this.isBrowser()) return false;
    try {
      const favorites = this.getFavorites();
      const upper = name.toUpperCase();
      const isFav = favorites.includes(upper);
      let updated: string[];
      if (isFav) {
        updated = favorites.filter(item => item !== upper);
      } else {
        updated = [...favorites, upper];
      }
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updated));
      return !isFav;
    } catch {
      return false;
    }
  }

  static getPins(): string[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(this.PINS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static togglePin(name: string): boolean {
    if (!this.isBrowser()) return false;
    try {
      const pins = this.getPins();
      const upper = name.toUpperCase();
      const isPinned = pins.includes(upper);
      let updated: string[];
      if (isPinned) {
        updated = pins.filter(item => item !== upper);
      } else {
        updated = [...pins, upper];
      }
      localStorage.setItem(this.PINS_KEY, JSON.stringify(updated));
      return !isPinned;
    } catch {
      return false;
    }
  }

  static getMostUsed(): { name: string; count: number }[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(this.MOST_USED_KEY);
      if (!data) return [];
      const parsed: Record<string, number> = JSON.parse(data);
      return Object.entries(parsed)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    } catch {
      return [];
    }
  }

  private static incrementUsage(name: string) {
    if (!this.isBrowser()) return;
    try {
      const data = localStorage.getItem(this.MOST_USED_KEY);
      const parsed: Record<string, number> = data ? JSON.parse(data) : {};
      parsed[name] = (parsed[name] || 0) + 1;
      localStorage.setItem(this.MOST_USED_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to increment usage', e);
    }
  }
}
