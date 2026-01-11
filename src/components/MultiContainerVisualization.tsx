import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Container, Item, MultipleContainersLoadResults } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ContainerVisualization } from './ContainerVisualization';
import { Package, BarChart3 } from 'lucide-react';

interface MultiContainerVisualizationProps {
  containers: Container[];
  items: Item[];
  results: MultipleContainersLoadResults | null;
  unit: 'cm' | 'inches';
  onItemsUpdate: (items: Item[]) => void;
}

export function MultiContainerVisualization({ 
  containers, 
  items, 
  results, 
  unit,
  onItemsUpdate 
}: MultiContainerVisualizationProps) {
  const [selectedContainerId, setSelectedContainerId] = useState<string>(
    containers.length > 0 ? containers[0].id : ''
  );
  const [viewMode, setViewMode] = useState<'individual' | 'summary'>('individual');

  const selectedContainer = containers.find(c => c.id === selectedContainerId);
  const containerResults = results?.containerResults.find(r => r.containerId === selectedContainerId);

  if (containers.length === 0) {
    return (
      <div className="text-center text-slate-500 py-8">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Add containers to see visualization</p>
      </div>
    );
  }

  if (viewMode === 'summary') {
    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-900">{containers.length}</div>
              <div className="text-sm text-blue-700">Total Containers</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-900">
                {results?.totalItems.toLocaleString() || 0}
              </div>
              <div className="text-sm text-green-700">Total Items Loaded</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-900">
                {results?.averageUtilization.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-orange-700">Avg Utilization</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-900">
                {results?.totalWeight.toLocaleString() || 0} kg
              </div>
              <div className="text-sm text-purple-700">Total Weight</div>
            </CardContent>
          </Card>
        </div>

        {/* Container List */}
        <div className="space-y-2">
          {containers.map((container, index) => {
            const containerResult = results?.containerResults.find(r => r.containerId === container.id);
            return (
              <Card 
                key={container.id} 
                className="p-4 transition-all duration-300 hover:shadow-md cursor-pointer hover:border-green-400"
                onClick={() => {
                  setSelectedContainerId(container.id);
                  setViewMode('individual');
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{container.name}</div>
                    <div className="text-sm text-slate-500">
                      {container.length}×{container.width}×{container.height} {unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {containerResult?.totalItems || 0} items
                    </div>
                    <div className="text-sm text-slate-500">
                      {containerResult?.utilizationPercentage.toFixed(1) || 0}% utilized
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${containerResult?.utilizationPercentage || 0}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Container</label>
            <Select value={selectedContainerId} onValueChange={setSelectedContainerId}>
              <SelectTrigger className="w-48 transition-all duration-300 focus:border-green-400 focus:ring-2 focus:ring-green-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {containers.map((container) => (
                  <SelectItem key={container.id} value={container.id}>
                    {container.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">View Mode</label>
            <div className="flex gap-2 mt-1">
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  viewMode === 'individual' 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                onClick={() => setViewMode('individual')}
              >
                <Package className="w-4 h-4 inline mr-1" />
                Individual
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  viewMode === 'summary' 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                onClick={() => setViewMode('summary')}
              >
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Container View */}
      {selectedContainer && (
        <ContainerVisualization
          container={selectedContainer}
          items={items}
          results={containerResults || null}
          unit={unit}
          onItemsUpdate={onItemsUpdate}
        />
      )}
    </div>
  );
}