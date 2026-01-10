import { useState, useCallback } from 'react';

export const useUnits = () => {
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  const convertToDisplay = useCallback((cm: number): number => {
    if (unit === 'inches') {
      return cm / 2.54;
    }
    return cm;
  }, [unit]);

  const convertFromDisplay = useCallback((value: number): number => {
    if (unit === 'inches') {
      return value * 2.54;
    }
    return value;
  }, [unit]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => prev === 'cm' ? 'inches' : 'cm');
  }, []);

  return {
    unit,
    toggleUnit,
    convertToDisplay,
    convertFromDisplay,
  };
};