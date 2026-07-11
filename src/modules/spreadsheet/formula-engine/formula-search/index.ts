import { functionDatabase, FunctionMetadata } from '../formula-library/metadata';
import { FormulaHistoryRegistry } from '../formula-library/registry';

const searchCache: Record<string, FunctionMetadata[]> = {};

// Clears the search cache when custom functions change or history updates (if needed)
export function clearSearchCache() {
  Object.keys(searchCache).forEach(key => delete searchCache[key]);
}

/**
 * Searches the formula library database using a query string
 * and ranks results by relevance scoring.
 */
export function searchFormulas(query: string): FunctionMetadata[] {
  const trimmed = query.trim().toUpperCase();
  if (!trimmed) {
    // If query is empty, return popular / recently used / pinned functions
    const history = FormulaHistoryRegistry.getHistory();
    const pins = FormulaHistoryRegistry.getPins();
    const favorites = FormulaHistoryRegistry.getFavorites();

    const merged = Array.from(new Set([...pins, ...favorites, ...history]));
    if (merged.length > 0) {
      return merged
        .map(name => functionDatabase.find(fn => fn.name === name))
        .filter((fn): fn is FunctionMetadata => !!fn);
    }
    // Fallback to first few functions
    return functionDatabase.slice(0, 10);
  }

  // Check cache first
  if (searchCache[trimmed]) {
    return searchCache[trimmed];
  }

  const pins = FormulaHistoryRegistry.getPins();
  const favorites = FormulaHistoryRegistry.getFavorites();
  const history = FormulaHistoryRegistry.getHistory();

  const scored = functionDatabase.map(fn => {
    let score = 0;
    const nameUpper = fn.name.toUpperCase();
    const descUpper = fn.description.toUpperCase();
    const catUpper = fn.category.toUpperCase();

    // 1. Exact Name Match (Priority 1)
    if (nameUpper === trimmed) {
      score += 150;
    }
    // 2. Name Starts With Match
    else if (nameUpper.startsWith(trimmed)) {
      score += 80;
    }
    // 3. Name Contains Match
    else if (nameUpper.includes(trimmed)) {
      score += 30;
    }

    // 4. Keyword matches (Priority 2)
    if (fn.keywords) {
      fn.keywords.forEach(kw => {
        const kwUpper = kw.toUpperCase();
        if (kwUpper === trimmed) {
          score += 60;
        } else if (kwUpper.includes(trimmed)) {
          score += 25;
        }
      });
    }

    // 5. Alias Match (Priority 3)
    if (fn.aliases) {
      fn.aliases.forEach(alias => {
        const aliasUpper = alias.toUpperCase();
        if (aliasUpper === trimmed) {
          score += 70;
        } else if (aliasUpper.includes(trimmed)) {
          score += 20;
        }
      });
    }

    // 6. Description contains (Priority 4)
    if (descUpper.includes(trimmed)) {
      score += 15;
    }

    // 7. Category matches
    if (catUpper.includes(trimmed)) {
      score += 10;
    }

    // 8. Pinned / Favorite / History Boosts
    if (pins.includes(nameUpper)) {
      score += 20;
    }
    if (favorites.includes(nameUpper)) {
      score += 10;
    }
    if (history.includes(nameUpper)) {
      score += 5;
    }

    return { fn, score };
  });

  // Filter out items with 0 score, and sort by descending score
  const results = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.fn);

  // Cache result
  searchCache[trimmed] = results;
  return results;
}
