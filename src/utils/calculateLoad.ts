import { Container, ItemDimensions, Orientation, LoadResults } from '../types';

export function calculateLoad(
  container: Container,
  item: ItemDimensions,
  orientation: Orientation
): LoadResults {
  // Get item dimensions based on orientation
  const getItemDimensions = () => {
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
  };

  const orientedItem = getItemDimensions();

  // Check if item fits in container
  const dimensionError = 
    orientedItem.length > container.length ||
    orientedItem.width > container.width ||
    orientedItem.height > container.height
      ? 'Item dimensions exceed container capacity'
      : null;

  if (dimensionError) {
    return {
      itemsPerLayer: 0,
      stackHeight: 0,
      totalItems: 0,
      utilizationPercentage: 0,
      totalWeight: 0,
      weightWarning: false,
      dimensionError,
    };
  }

  // Calculate items per layer
  const itemsAlongLength = Math.floor(container.length / orientedItem.length);
  const itemsAlongWidth = Math.floor(container.width / orientedItem.width);
  const itemsPerLayer = itemsAlongLength * itemsAlongWidth;

  // Calculate stack height
  const stackHeight = Math.floor(container.height / orientedItem.height);

  // Calculate total items
  const totalItems = itemsPerLayer * stackHeight;

  // Calculate volume utilization
  const containerVolume = container.length * container.width * container.height;
  const itemVolume = orientedItem.length * orientedItem.width * orientedItem.height;
  const totalItemVolume = totalItems * itemVolume;
  const utilizationPercentage = (totalItemVolume / containerVolume) * 100;

  // Calculate total weight
  const totalWeight = totalItems * item.weight;
  const weightWarning = totalWeight > container.maxWeight;

  return {
    itemsPerLayer,
    stackHeight,
    totalItems,
    utilizationPercentage,
    totalWeight,
    weightWarning,
    dimensionError: null,
  };
}