import React, { useState } from 'react';
import { Card, CardContent } from '/components/ui/card';
import { Container, Item, ContainerLoadResults } from '../types';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Package, AlertTriangle, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface ContainerFloorPlanProps {
  container: Container;
  items: Item[];
  results: ContainerLoadResults | null;
  unit: 'cm' | 'inches';
  onItemsUpdate: (items: Item[]) => void;
}

interface PlacedItem {
  item: Item;
  x: number;
  y: number;
  layer: number;
  color: string;
}

export function ContainerFloorPlan({ 
  container, 
  items, 
  results, 
  unit,
  onItemsUpdate 
}: ContainerFloorPlanProps) {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [scale, setScale] = useState(1);

  // Calculate placed items for visualization
  const getPlacedItems = (): PlacedItem[] => {
    if (!results) return [];
    
    const placedItems: PlacedItem[] = [];
    let currentX = 0;
    let currentY = 0;
    let currentLayer = 0;
    
    items.forEach(item => {
      const itemBreakdown = results.itemBreakdown.find(b => b.itemId === item.id);
      if (itemBreakdown && itemBreakdown.loadedCount > 0) {
        for (let i = 0; i < itemBreakdown.loadedCount; i++) {
          placedItems.push({
            item,
            x: currentX,
            y: currentY,
            layer: currentLayer,
            color: item.color,
          });
          
          // Simple placement algorithm
          currentX += item.length;
          if (currentX + item.length > container.length) {
            currentX = 0;
            currentY += item.width;
            if (currentY + item.width > container.width) {
              currentY = 0;
              currentLayer++;
            }
          }
        }
      }
    });
    
    return placedItems;
  };

  const placedItems = getPlacedItems();
  const maxLayers = Math.max(...placedItems.map(item => item.layer), 0);
  const currentLayerItems = placedItems.filter(item => item.layer === currentLayer);

  // Calculate scale to fit container in view
  const maxDimension = Math.max(container.length, container.width);
  const viewBoxScale = Math.min(500 / maxDimension, 1) * scale;

  return (
    <div className="space-y-4">
      {/* Layer Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Layer:</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentLayer(Math.max(0, currentLayer - 1))}
              disabled={currentLayer === 0}
              className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
            >
              -
            </Button>
            <span className="px-3 py-1 bg-slate-100 rounded-md text-sm font-medium min-w-[60px] text-center">
              {currentLayer + 1} / {maxLayers + 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentLayer(Math.min(maxLayers, currentLayer + 1))}
              disabled={currentLayer === maxLayers}
              className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
            >
              +
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
            className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium px-2">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
            className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setScale(1);
              setCurrentLayer(0);
            }}
            className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 2D Floor Plan */}
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <div className="relative overflow-auto" style={{ maxHeight: '400px' }}>
            <svg
              width={container.length * viewBoxScale}
              height={container.width * viewBoxScale}
              className="border-2 border-slate-300 bg-white"
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Container outline */}
              <rect
                x={0}
                y={0}
                width={container.length * viewBoxScale}
                height={container.width * viewBoxScale}
                fill="none"
                stroke="#475569"
                strokeWidth="2"
              />
              
              {/* Placed items */}
              {currentLayerItems.map((placedItem, index) => (
                <g key={index}>
                  <rect
                    x={placedItem.x * viewBoxScale}
                    y={placedItem.y * viewBoxScale}
                    width={placedItem.item.length * viewBoxScale}
                    height={placedItem.item.width * viewBoxScale}
                    fill={placedItem.color}
                    fillOpacity={0.7}
                    stroke={placedItem.color}
                    strokeWidth="1"
                    className="transition-all duration-300 hover:fill-opacity-100 cursor-pointer"
                  />
                  <text
                    x={(placedItem.x + placedItem.item.length / 2) * viewBoxScale}
                    y={(placedItem.y + placedItem.item.width / 2) * viewBoxScale}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {placedItem.item.name.substring(0, 3)}
                  </text>
                </g>
              ))}
              
              {/* Dimensions */}
              <text
                x={container.length * viewBoxScale / 2}
                y={-5}
                textAnchor="middle"
                fill="#475569"
                fontSize="12"
                fontWeight="bold"
              >
                {container.length} {unit}
              </text>
              <text
                x={-5}
                y={container.width * viewBoxScale / 2}
                textAnchor="middle"
                fill="#475569"
                fontSize="12"
                fontWeight="bold"
                transform={`rotate(-90, -5, ${container.width * viewBoxScale / 2})`}
              >
                {container.width} {unit}
              </text>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Layer Info */}
      <div className="text-center text-sm text-slate-600">
        <p>Layer {currentLayer + 1}: {currentLayerItems.length} items placed</p>
      </div>
    </div>
  );
}