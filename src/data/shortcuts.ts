export interface ShortcutOfficeExample {
  title: string;
  description: string;
}

export interface ShortcutData {
  id: string;
  shortcut: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  windows: string;
  mac: string;
  description: string;
  whenToUse: string;
  steps: string[];
  officeExamples: ShortcutOfficeExample[];
  related: string[];
  practiceSupported: boolean;
  acceptedKeys: string[]; // key combination array (lower case, e.g. ['control', 'c'] or ['control', 'shift', '$'])
  mistakes: string[];
  tags: string[];
  taskDescription?: string;
  expectedSpreadsheetChange?: 'bold' | 'italic' | 'underline' | 'currency' | 'percent' | 'select_all' | 'autosum' | 'edit_cell' | 'filter' | 'table';
}

export const shortcutsData: ShortcutData[] = [
  // ==================== CLIPBOARD / EDITING ====================
  {
    id: 'ctrl-c',
    shortcut: 'Ctrl+C',
    title: 'Copy Selected Cells',
    category: 'Clipboard',
    difficulty: 'Beginner',
    windows: 'Ctrl + C',
    mac: 'Cmd + C',
    description: 'Copies the values, formulas, and formatting of selected cells to the clipboard.',
    whenToUse: 'Use when you want to duplicate data or formulas to another part of the worksheet without removing the original.',
    steps: [
      'Highlight the cell range you wish to duplicate.',
      'Hold down the Ctrl key (Cmd on Mac).',
      'Press C on your keyboard.',
      'A moving border appears around the selected cells.'
    ],
    officeExamples: [
      { title: 'Copy customer list', description: 'Duplicating contact info columns from last month to new sheet.' },
      { title: 'Copy salary table', description: 'Transferring base payroll numbers to tax computation templates.' }
    ],
    related: ['ctrl-x', 'ctrl-v', 'ctrl-shift-v'],
    practiceSupported: true,
    acceptedKeys: ['control', 'c'],
    mistakes: [
      'Releasing the Ctrl key too early before pressing C.',
      'Confusing with Ctrl+X which deletes the original source data.'
    ],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Office Jobs', 'Data Entry'],
    taskDescription: 'Copy the highlighted customer data block using the Ctrl+C shortcut.',
    expectedSpreadsheetChange: 'select_all'
  },
  {
    id: 'ctrl-x',
    shortcut: 'Ctrl+X',
    title: 'Cut Selected Cells',
    category: 'Clipboard',
    difficulty: 'Beginner',
    windows: 'Ctrl + X',
    mac: 'Cmd + X',
    description: 'Removes the selected cells and places them on the clipboard for moving.',
    whenToUse: 'Use when you want to relocate cell data to a new position entirely, clearing the old cells.',
    steps: [
      'Select target cell range.',
      'Hold the Ctrl key (Cmd on Mac) and press X.',
      'Cells will be highlighted with a dashed moving border until pasted.'
    ],
    officeExamples: [
      { title: 'Move misplaced records', description: 'Relocating December expense entries to correct Q4 worksheet.' }
    ],
    related: ['ctrl-c', 'ctrl-v'],
    practiceSupported: true,
    acceptedKeys: ['control', 'x'],
    mistakes: ['Assuming cut deletes cells permanently; they are held in clipboard until pasted.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Office Jobs'],
    taskDescription: 'Cut the misplaced row cells using the Ctrl+X shortcut.'
  },
  {
    id: 'ctrl-v',
    shortcut: 'Ctrl+V',
    title: 'Paste Clipboard Content',
    category: 'Clipboard',
    difficulty: 'Beginner',
    windows: 'Ctrl + V',
    mac: 'Cmd + V',
    description: 'Pastes values, formatting, and formulas from clipboard to destination cells.',
    whenToUse: 'Use after cutting or copying cells to place the contents at the new cursor location.',
    steps: [
      'Click the top-left destination cell.',
      'Hold Ctrl (Cmd on Mac) and press V.'
    ],
    officeExamples: [
      { title: 'Paste templates', description: 'Applying copied header structures across 12 monthly tabs.' }
    ],
    related: ['ctrl-c', 'ctrl-x', 'ctrl-shift-v'],
    practiceSupported: true,
    acceptedKeys: ['control', 'v'],
    mistakes: ['Pasting range over existing data without checking if it will overwrite needed columns.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Office Jobs', 'Data Entry'],
    taskDescription: 'Paste the copied items using the Ctrl+V shortcut.'
  },
  {
    id: 'ctrl-z',
    shortcut: 'Ctrl+Z',
    title: 'Undo Last Action',
    category: 'Basic Editing',
    difficulty: 'Beginner',
    windows: 'Ctrl + Z',
    mac: 'Cmd + Z',
    description: 'Reverses the last action or edit made in the workbook.',
    whenToUse: 'Use immediately after making a mistake, deleting a cell, or formatting incorrectly.',
    steps: [
      'Identify the incorrect modification.',
      'Press Ctrl + Z on keyboard to reverse it.'
    ],
    officeExamples: [
      { title: 'Undo delete', description: 'Restoring a deleted column after accidentally hitting Backspace.' }
    ],
    related: ['ctrl-y'],
    practiceSupported: true,
    acceptedKeys: ['control', 'z'],
    mistakes: ['Assuming you can undo after closing and reopening the workbook.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Office Jobs', 'Data Entry'],
    taskDescription: 'Reverse your last edit action using the Ctrl+Z shortcut.'
  },
  {
    id: 'ctrl-y',
    shortcut: 'Ctrl+Y',
    title: 'Redo Last Action',
    category: 'Basic Editing',
    difficulty: 'Beginner',
    windows: 'Ctrl + Y',
    mac: 'Cmd + Y',
    description: 'Reapplies an action that was reversed by the Undo command.',
    whenToUse: 'Use when you accidentally undo an action and want to restore it.',
    steps: [
      'After pressing Ctrl+Z, press Ctrl+Y to re-execute.'
    ],
    officeExamples: [],
    related: ['ctrl-z'],
    practiceSupported: true,
    acceptedKeys: ['control', 'y'],
    mistakes: [],
    tags: ['Windows', 'Mac', 'Frequently Used'],
    taskDescription: 'Redo the undone action using the Ctrl+Y shortcut.'
  },

  // ==================== FORMATTING & NUMBERS ====================
  {
    id: 'ctrl-b',
    shortcut: 'Ctrl+B',
    title: 'Toggle Bold Style',
    category: 'Formatting',
    difficulty: 'Beginner',
    windows: 'Ctrl + B',
    mac: 'Cmd + B',
    description: 'Applies or removes bold styling from selected cell text.',
    whenToUse: 'Use to make headers, totals, or key callouts stand out visually from standard spreadsheet cells.',
    steps: [
      'Highlight the cells to format.',
      'Hold Ctrl and press B.'
    ],
    officeExamples: [
      { title: 'Bold headers', description: 'Making row titles bold to separate table from raw data.' }
    ],
    related: ['ctrl-i', 'ctrl-u'],
    practiceSupported: true,
    acceptedKeys: ['control', 'b'],
    mistakes: ['Boldening too many columns which decreases overall scannability.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Office Jobs', 'Accounting'],
    taskDescription: 'Bold the table column headers using the Ctrl+B shortcut.',
    expectedSpreadsheetChange: 'bold'
  },
  {
    id: 'ctrl-i',
    shortcut: 'Ctrl+I',
    title: 'Toggle Italic Style',
    category: 'Formatting',
    difficulty: 'Beginner',
    windows: 'Ctrl + I',
    mac: 'Cmd + I',
    description: 'Applies or removes italic formatting from selected text.',
    whenToUse: 'Use to italicize subheadings, notes, or unit indicators (e.g. *in USD*).',
    steps: [
      'Select cells, hold Ctrl, and press I.'
    ],
    officeExamples: [],
    related: ['ctrl-b', 'ctrl-u'],
    practiceSupported: true,
    acceptedKeys: ['control', 'i'],
    mistakes: [],
    tags: ['Windows', 'Mac', 'Frequently Used'],
    taskDescription: 'Apply italic styling to the notes row using the Ctrl+I shortcut.',
    expectedSpreadsheetChange: 'italic'
  },
  {
    id: 'ctrl-u',
    shortcut: 'Ctrl+U',
    title: 'Toggle Underline',
    category: 'Formatting',
    difficulty: 'Beginner',
    windows: 'Ctrl + U',
    mac: 'Cmd + U',
    description: 'Underlines selected text values in cells.',
    whenToUse: 'Use to underline column summaries or totals before double lines.',
    steps: [
      'Select cells, hold Ctrl, and press U.'
    ],
    officeExamples: [],
    related: ['ctrl-b', 'ctrl-i'],
    practiceSupported: true,
    acceptedKeys: ['control', 'u'],
    mistakes: [],
    tags: ['Windows', 'Mac', 'Frequently Used'],
    taskDescription: 'Underline the total summation values using the Ctrl+U shortcut.',
    expectedSpreadsheetChange: 'underline'
  },
  {
    id: 'ctrl-shift-dollar',
    shortcut: 'Ctrl+Shift+$',
    title: 'Format as Currency',
    category: 'Numbers',
    difficulty: 'Intermediate',
    windows: 'Ctrl + Shift + $',
    mac: 'Ctrl + Shift + $',
    description: 'Applies Currency formatting with two decimal places and currency symbol.',
    whenToUse: 'Use immediately on raw numbers representing money values to clarify they are financial amounts.',
    steps: [
      'Highlight raw numbers.',
      'Hold Ctrl and Shift keys together.',
      'Press the $ key (typically number 4 on main layout).'
    ],
    officeExamples: [
      { title: 'Format prices', description: 'Converting raw integers like 12000 into currency format $12,000.00.' }
    ],
    related: ['ctrl-shift-percent', 'ctrl-1'],
    practiceSupported: true,
    acceptedKeys: ['control', 'shift', '$'],
    mistakes: ['Pressing Ctrl+Shift+4 and releasing keys before shift modifier registers.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Office Jobs', 'Accounting', 'MIS'],
    taskDescription: 'Format the highlighted raw numbers as Currency ($) using the Ctrl+Shift+$ shortcut.',
    expectedSpreadsheetChange: 'currency'
  },
  {
    id: 'ctrl-shift-percent',
    shortcut: 'Ctrl+Shift+%',
    title: 'Format as Percentage',
    category: 'Numbers',
    difficulty: 'Intermediate',
    windows: 'Ctrl + Shift + %',
    mac: 'Ctrl + Shift + %',
    description: 'Applies Percentage formatting with zero decimal places.',
    whenToUse: 'Use when raw decimal values (e.g. 0.18) should display as percentages (e.g. 18%).',
    steps: [
      'Highlight decimal numbers, hold Ctrl + Shift, and press % (typically number 5).'
    ],
    officeExamples: [
      { title: 'Format tax rates', description: 'Formatting 0.18 into 18% for GST accounting columns.' }
    ],
    related: ['ctrl-shift-dollar', 'ctrl-1'],
    practiceSupported: true,
    acceptedKeys: ['control', 'shift', '%'],
    mistakes: ['Applying percent style to integers like 18, which displays as 1800%.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Accounting', 'MIS'],
    taskDescription: 'Format the highlighted decimal values as Percentages using the Ctrl+Shift+% shortcut.',
    expectedSpreadsheetChange: 'percent'
  },

  // ==================== WORKBOOK / WORKBOOK EDITING ====================
  {
    id: 'alt-equals',
    shortcut: 'Alt+=',
    title: 'AutoSum Selected Range',
    category: 'Functions',
    difficulty: 'Beginner',
    windows: 'Alt + =',
    mac: 'Option + Cmd + =',
    description: 'Inserts a SUM formula automatically covering adjacent rows or columns.',
    whenToUse: 'Use to automatically generate a sum total formula at the end of a column or row of numbers.',
    steps: [
      'Click the empty cell immediately below a numeric column.',
      'Hold the Alt key and press the equals sign (=).'
    ],
    officeExamples: [
      { title: 'Quick total expense', description: 'Generating totals at the bottom of the monthly travel expense columns.' }
    ],
    related: ['ctrl-shift-dollar'],
    practiceSupported: true,
    acceptedKeys: ['alt', '='],
    mistakes: ['Not double checking if range contains blank cells that break AutoSum ranges.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Office Jobs', 'Accounting', 'MIS', 'Data Entry'],
    taskDescription: 'Generate an automatic sum at cell B5 using the Alt+= shortcut.',
    expectedSpreadsheetChange: 'autosum'
  },
  {
    id: 'f2',
    shortcut: 'F2',
    title: 'Edit Active Cell',
    category: 'Basic Editing',
    difficulty: 'Beginner',
    windows: 'F2',
    mac: 'Ctrl + U',
    description: 'Places the cursor at the end of cell contents to edit inside the cell directly.',
    whenToUse: 'Use when you want to append/edit cell values without typing over and erasing existing text.',
    steps: [
      'Select cell with arrow keys.',
      'Press F2 key.'
    ],
    officeExamples: [
      { title: 'Edit mistake text', description: 'Correcting a spelling typo inside a long description cell without retyping everything.' }
    ],
    related: ['alt-enter'],
    practiceSupported: true,
    acceptedKeys: ['f2'],
    mistakes: ['Clicking Enter after F2 instead of Esc if you want to abort modifications.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Data Entry'],
    taskDescription: 'Enter cell edit mode inside B2 using the F2 shortcut.',
    expectedSpreadsheetChange: 'edit_cell'
  },
  {
    id: 'f4',
    shortcut: 'F4',
    title: 'Repeat / Lock Cell Reference',
    category: 'Formula Editing',
    difficulty: 'Intermediate',
    windows: 'F4',
    mac: 'Cmd + T',
    description: 'Cycles through absolute, row-absolute, and column-absolute cell reference configurations (e.g. $A$1).',
    whenToUse: 'Use when editing a formula and you want to lock cell references before dragging down.',
    steps: [
      'Edit cell formula, position cursor near cell reference (e.g. B2).',
      'Press F4 key repeatedly to toggle dollar signs.'
    ],
    officeExamples: [
      { title: 'Lock tax cell', description: 'Locking tax rate coordinate reference B1 in formula =A2*$B$1 to copy down.' }
    ],
    related: ['f2'],
    practiceSupported: false,
    acceptedKeys: ['f4'],
    mistakes: ['Forgetting to select formula edit mode before pressing F4.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Accounting', 'MIS'],
    taskDescription: 'Lock cell reference configurations using F4.'
  },
  {
    id: 'ctrl-shift-l',
    shortcut: 'Ctrl+Shift+L',
    title: 'Toggle Table Filters',
    category: 'Filtering',
    difficulty: 'Intermediate',
    windows: 'Ctrl + Shift + L',
    mac: 'Cmd + Shift + F',
    description: 'Enables or disables auto filter dropdown menus for header columns.',
    whenToUse: 'Use to quickly filter rows by criteria or sort columns alphabetically/numerically.',
    steps: [
      'Click inside data table range.',
      'Press Ctrl + Shift + L.'
    ],
    officeExamples: [
      { title: 'Filter active items', description: 'Toggling filter dropdowns to extract invoices with "Pending" status.' }
    ],
    related: ['alt-down'],
    practiceSupported: true,
    acceptedKeys: ['control', 'shift', 'l'],
    mistakes: ['Not clicking inside table range first, which results in filter error.'],
    tags: ['Windows', 'Mac', 'Frequently Used', 'Office Jobs', 'MIS'],
    taskDescription: 'Toggle filter dropdown arrows for the table header columns using the Ctrl+Shift+L shortcut.',
    expectedSpreadsheetChange: 'filter'
  },
  {
    id: 'alt-down',
    shortcut: 'Alt+↓',
    title: 'Open Dropdown Menu',
    category: 'Navigation',
    difficulty: 'Intermediate',
    windows: 'Alt + Down Arrow',
    mac: 'Option + Down Arrow',
    description: 'Opens drop-down list validation options or filter menu of the active cell.',
    whenToUse: 'Use to select items from a validation dropdown list without using the mouse.',
    steps: [
      'Select cell containing validation arrow.',
      'Hold Alt and press Down Arrow.'
    ],
    officeExamples: [
      { title: 'Dropdown options', description: 'Selecting department name option from pre-validated dropdown lists.' }
    ],
    related: ['ctrl-shift-l'],
    practiceSupported: false,
    acceptedKeys: ['alt', 'arrowdown'],
    mistakes: [],
    tags: ['Windows', 'Mac', 'Office Jobs', 'Data Entry'],
    taskDescription: 'Open dropdown options inside active validation cells.'
  },
  {
    id: 'ctrl-t',
    shortcut: 'Ctrl+T',
    title: 'Create Excel Table',
    category: 'Tables',
    difficulty: 'Intermediate',
    windows: 'Ctrl + T',
    mac: 'Cmd + T',
    description: 'Converts selected cell ranges into styled dynamic tables with headers, auto-filters, and stripes.',
    whenToUse: 'Use to format raw records into structured tables supporting dynamic formulas.',
    steps: [
      'Highlight raw data.',
      'Hold Ctrl and press T.',
      'Press Enter to confirm table boundaries.'
    ],
    officeExamples: [],
    related: ['ctrl-shift-l'],
    practiceSupported: true,
    acceptedKeys: ['control', 't'],
    mistakes: [],
    tags: ['Windows', 'Mac', 'Frequently Used', 'MIS'],
    taskDescription: 'Convert the highlighted raw data table into an Excel Table using the Ctrl+T shortcut.',
    expectedSpreadsheetChange: 'table'
  }
];
