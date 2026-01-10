export interface Container {
  id: string;
  name: string;
  length: number; // cm
  width: number; // cm
  height: number; // cm
  maxWeight: number; // kg
}

export interface Item {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number; // kg
  quantity: number;
  color: string;
  position?: { x: number; y: number; z: number };
}

export type Orientation = 'LxWxH' | 'WxLxH' | 'HxWxL' | 'HxLxW' | 'LxHxW' | 'WxHxL';

export interface LoadResults {
  itemsPerLayer: number;
  stackHeight: number;
  totalItems: number;
  utilizationPercentage: number;
  totalWeight: number;
  weightWarning: boolean;
  dimensionError: string | null;
}

export interface MultipleItemsLoadResults {
  totalItems: number;
  totalWeight: number;
  utilizationPercentage: number;
  weightWarning: boolean;
  itemBreakdown: Array<{
    itemId: string;
    itemName: string;
    loadedCount: number;
    requestedCount: number;
    utilizationPercentage: number;
  }>;
  dimensionError: string | null;
  placedItems: Array<{
    itemId: string;
    position: { x: number; y: number; z: number };
    dimensions: { length: number; width: number; height: number };
  }>;
}

export interface ContainerLoadResult {
  containerId: string;
  containerName: string;
  totalItems: number;
  totalWeight: number;
  utilizationPercentage: number;
  weightWarning: boolean;
  itemBreakdown: Array<{
    itemId: string;
    itemName: string;
    loadedCount: number;
    requestedCount: number;
    utilizationPercentage: number;
  }>;
  placedItems: Array<{
    itemId: string;
    position: { x: number; y: number; z: number };
    dimensions: { length: number; width: number; height: number };
  }>;
}

export interface MultipleContainersLoadResults {
  containerResults: ContainerLoadResult[];
  totalItems: number;
  totalWeight: number;
  averageUtilization: number;
  hasWeightWarning: boolean;
  updatedItems: Item[];
}