import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Container, Item, ContainerLoadResults } from '../types';
import { Container3DView } from './Container3DView';
import { ContainerFloorPlan } from './ContainerFloorPlan';
import { Box, Grid3X3 } from 'lucide-react';

interface ContainerVisualizationProps {
  container: Container;
  items: Item[];
  results: ContainerLoadResults | null;
  unit: 'cm' | 'inches';
  onItemsUpdate: (items: Item[]) => void;
}

export function ContainerVisualization({ 
  container, 
  items, 
  results, 
  unit,
  onItemsUpdate 
}: ContainerVisualizationProps) {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{container.name}</h3>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              viewMode === '3d' 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setViewMode('3d')}
          >
            <Box className="w-4 h-4 inline mr-1" />
            3D View
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              viewMode === '2d' 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setViewMode('2d')}
          >
            <Grid3X3 className="w-4 h-4 inline mr-1" />
            2D Floor Plan
          </button>
        </div>
      </div>

      {/* Visualization Content */}
      {viewMode === '3d' ? (
        <Container3DView
          container={container}
          items={items}
          results={results}
          unit={unit}
        />
      ) : (
        <ContainerFloorPlan
          container={container}
          items={items}
          results={results}
          unit={unit}
          onItemsUpdate={onItemsUpdate}
        />
      )}
    </div>
  );
}