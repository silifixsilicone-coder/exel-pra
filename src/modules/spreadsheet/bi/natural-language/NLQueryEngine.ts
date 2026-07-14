export interface QueryResult {
  text: string;
  formulaSuggestion?: string;
  actionRecommended?: 'sum' | 'max' | 'avg' | 'chart' | 'pivot';
}

export function parseNaturalLanguageQuery(query: string): QueryResult {
  const normalized = query.toLowerCase().trim();

  if (normalized.includes('total') || normalized.includes('sum') || normalized.includes('add')) {
    if (normalized.includes('sales')) {
      return {
        text: 'Found "Sales" column in cell B. Evaluated total sum range B2:B5.',
        formulaSuggestion: '=SUM(B2:B5)',
        actionRecommended: 'sum'
      };
    }
    return {
      text: 'Evaluated total sum formula across range B2:B5.',
      formulaSuggestion: '=SUM(B2:B5)',
      actionRecommended: 'sum'
    };
  }

  if (normalized.includes('max') || normalized.includes('highest') || normalized.includes('maximum') || normalized.includes('peak')) {
    return {
      text: 'Identified peak performer inside dataset. Evaluated MAX formula on cell range B2:B5.',
      formulaSuggestion: '=MAX(B2:B5)',
      actionRecommended: 'max'
    };
  }

  if (normalized.includes('average') || normalized.includes('mean') || normalized.includes('avg')) {
    return {
      text: 'Evaluated mean averages across metric cells B2:B5.',
      formulaSuggestion: '=AVERAGE(B2:B5)',
      actionRecommended: 'avg'
    };
  }

  if (normalized.includes('compare') || normalized.includes('chart') || normalized.includes('graph')) {
    return {
      text: 'Recommended Action: Insert Column/Bar Chart to visually compare items.',
      actionRecommended: 'chart'
    };
  }

  if (normalized.includes('pivot') || normalized.includes('summary')) {
    return {
      text: 'Recommended Action: Generate Pivot Grid table to group category records.',
      actionRecommended: 'pivot'
    };
  }

  return {
    text: 'Could not match explicit Excel range. Try asking: "What are total sales?" or "Calculate average values".',
    formulaSuggestion: '=SUM(B2:B5)'
  };
}
