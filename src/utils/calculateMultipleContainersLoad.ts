import { Container, Item, Orientation, MultipleContainersLoadResults } from '../types';
import { calculateMultipleItemsLoad } from './calculateMultipleItemsLoad';

export function calculateMultipleContainersLoad(
  containers: Container[],
  items: Item[],
  orientation: Orientation
): MultipleContainersLoadResults {
  const containerResults = containers.map(container => {
    const containerItems = items.filter(item => item.quantity > 0);
    const result = calculateMultipleItemsLoad(container, containerItems, orientation);
    
    return {
      containerId: container.id,
      containerName: container.name,
      totalItems: result.totalItems,
      totalWeight: result.totalWeight,
      utilizationPercentage: result.utilizationPercentage,
      weightWarning: result.weightWarning,
      itemBreakdown: result.itemBreakdown,
      placedItems: result.placedItems,
    };
  });

  const totalItems = containerResults.reduce((sum, result) => sum + result.totalItems, 0);
  const totalWeight = containerResults.reduce((sum, result) => sum + result.totalWeight, 0);
  const averageUtilization = containerResults.length > 0 
    ? containerResults.reduce((sum, result) => sum + result.utilizationPercentage, 0) / containerResults.length
    : 0;
  const hasWeightWarning = containerResults.some(result => result.weightWarning);

  // Update item quantities based on what was loaded
  const updatedItems = items.map(item => {
    let totalLoaded = 0;
    containerResults.forEach(result => {
      const breakdown = result.itemBreakdown.find(b => b.itemId === item.id);
      if (breakdown) {
        totalLoaded += breakdown.loadedCount;
      }
    });
    
    return {
      ...item,
      quantity: Math.max(0, item.quantity - totalLoaded),
    };
  });

  return {
    containerResults,
    totalItems,
    totalWeight,
    averageUtilization,
    hasWeightWarning,
    updatedItems,
  };
}