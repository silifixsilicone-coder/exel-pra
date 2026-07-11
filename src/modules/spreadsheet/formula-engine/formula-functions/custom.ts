import { formulaLibrary } from '../formula-library';
import { FormulaError } from '../formula-errors';
import { parseNumber } from './math';

// GST(amount, rate)
formulaLibrary.register('GST', (args) => {
  if (args.length < 2) throw new Error(FormulaError.VALUE);
  const amount = parseNumber(args[0]);
  const rate = parseNumber(args[1]);
  return (amount * rate) / 100;
});

// CGST(amount, rate)
formulaLibrary.register('CGST', (args) => {
  if (args.length < 2) throw new Error(FormulaError.VALUE);
  const amount = parseNumber(args[0]);
  const rate = parseNumber(args[1]);
  return (amount * (rate / 2)) / 100;
});

// SGST(amount, rate)
formulaLibrary.register('SGST', (args) => {
  if (args.length < 2) throw new Error(FormulaError.VALUE);
  const amount = parseNumber(args[0]);
  const rate = parseNumber(args[1]);
  return (amount * (rate / 2)) / 100;
});

// IGST(amount, rate)
formulaLibrary.register('IGST', (args) => {
  if (args.length < 2) throw new Error(FormulaError.VALUE);
  const amount = parseNumber(args[0]);
  const rate = parseNumber(args[1]);
  return (amount * rate) / 100;
});

// EMI(principal, annualRate, months)
formulaLibrary.register('EMI', (args) => {
  if (args.length < 3) throw new Error(FormulaError.VALUE);
  const principal = parseNumber(args[0]);
  const annualRate = parseNumber(args[1]);
  const months = parseNumber(args[2]);

  if (months <= 0) throw new Error(FormulaError.NUM);
  
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) {
    return principal / months;
  }

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  
  if (isNaN(emi) || !isFinite(emi)) throw new Error(FormulaError.NUM);
  return Number(emi.toFixed(2));
});

// AGE(birthdate)
formulaLibrary.register('AGE', (args) => {
  if (args.length < 1) throw new Error(FormulaError.VALUE);
  const birthdateStr = String(args[0]);
  
  const birthDate = new Date(birthdateStr);
  if (isNaN(birthDate.getTime())) throw new Error(FormulaError.VALUE);
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// PANVALID(pan)
formulaLibrary.register('PANVALID', (args) => {
  if (args.length < 1) throw new Error(FormulaError.VALUE);
  const pan = String(args[0]).trim().toUpperCase();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
});

// AADHARVALID(aadhar)
formulaLibrary.register('AADHARVALID', (args) => {
  if (args.length < 1) throw new Error(FormulaError.VALUE);
  const aadhar = String(args[0]).trim().replace(/\s/g, '');
  const aadharRegex = /^[0-9]{12}$/;
  return aadharRegex.test(aadhar);
});
