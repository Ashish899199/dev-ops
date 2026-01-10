import { Container, Item, Orientation, MultipleItemsLoadResults } from '../types';

export function calculateMultipleItemsLoad(
  container: Container,
  items: Item[],
  orientation: Orientation
): MultipleItemsLoadResults {
  const placedItems: Array<{
    itemId: string;
    position: { x: number; y: number; z: number };
    dimensions: { length: number; width: number; height: number };
  }> = [];

  const itemBreakdown = items.map(item => ({
    itemId: item.id,
    itemName: item.name,
    loadedCount: 0,
    requestedCount: item.quantity,
    utilizationPercentage: 0,
  }));

  let totalWeight = 0;
  let totalVolume = 0;

  // Simple packing algorithm - place items in a grid
  let currentX = 0;
  let currentY = 0;
  let currentZ = 0;
  let rowHeight = 0;

  items.forEach(item => {
    const orientedItem = getOrientedDimensions(item, orientation);
    
    // Check if item fits in container
    if (orientedItem.length > container.length || 
        orientedItem.width > container.width || 
        orientedItem.height > container.height) {
      return;
    }

    let placed = 0;
    for (let i = 0; i < item.quantity; i++) {
      // Try to place item at current position
      if (currentX + orientedItem.length <= container.length &&
          currentY + orientedItem.width <= container.width &&
          currentZ + orientedItem.height <= container.height) {
        
        placedItems.push({
          itemId: item.id,
          position: { x: currentX, y: currentY, z: currentZ },
          dimensions: orientedItem,
        });

        placed++;
        totalWeight += item.weight;
        totalVolume += orientedItem.length * orientedItem.width * orientedItem.height;

        // Update position for next item
        currentX += orientedItem.length;
        rowHeight = Math.max(rowHeight, orientedItem.height);

        // Move to next row if needed
        if (currentX + orientedItem.length > container.length) {
          currentX = 0;
          currentY += orientedItem.width;
          
          // Move to next layer if needed
          if (currentY + orientedItem.width > container.width) {
            currentY = 0;
            currentZ += rowHeight;
            rowHeight = 0;
          }
        }
      } else {
        break; // Can't place more items
      }
    }

    // Update breakdown
    const breakdown = itemBreakdown.find(b => b.itemId === item.id);
    if (breakdown) {
      breakdown.loadedCount = placed;
      breakdown.utilizationPercentage = (placed / item.quantity) * 100;
    }
  });

  const containerVolume = container.length * container.width * container.height;
  const utilizationPercentage = (totalVolume / containerVolume) * 100;
  const weightWarning = totalWeight > container.maxWeight;

  return {
    totalItems: placedItems.length,
    totalWeight,
    utilizationPercentage,
    weightWarning,
    itemBreakdown,
    dimensionError: null,
    placedItems,
  };
}

function getOrientedDimensions(item: Item, orientation: Orientation) {
  switch (orientation) {
    case 'LxWxH':
      return { length: item.length, width: item.width, height: item.height };
    case 'WxLxH':
      return { length: item.width, width: item.length, height: item.height };
    case 'HxWxL':
      return { length: item.height, width: item.width, height: item.length };
    case 'HxLxW':
      return { length: item.height, width: item.length, height: item.width };
    case 'LxHxW':
      return { length: item.length, width: item.height, height: item.width };
    case 'WxHxL':
      return { length: item.width, width: item.height, height: item.length };
    default:
      return { length: item.length, width: item.width, height: item.height };
  }
}