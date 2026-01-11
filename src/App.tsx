import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ContainerManager } from '../components/ContainerManager';
import { ItemManager } from '../components/ItemManager';
import { MultiContainerVisualization } from '../components/MultiContainerVisualization';
import { LoadingChart } from '../components/LoadingChart';
import { BulkUpload } from '../components/BulkUpload';
import { calculateMultipleContainersLoad } from '../utils/calculateMultipleContainersLoad';
import { Container, Item, Orientation } from '../types';
import { useUnits } from '../hooks/useUnits';

const DEFAULT_CONTAINERS: Container[] = [
  { id: '1', name: '20ft Standard', length: 589, width: 235, height: 239, maxWeight: 28200 },
];

export default function App() {
  const [containers, setContainers] = useState<Container[]>(DEFAULT_CONTAINERS);
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Box A', length: 50, width: 40, height: 30, weight: 10, quantity: 10, color: '#3B82F6' }
  ]);
  const [orientation, setOrientation] = useState<Orientation>('LxWxH');
  const { unit, convertToDisplay, convertFromDisplay, toggleUnit } = useUnits();
  const [results, setResults] = useState<ReturnType<typeof calculateMultipleContainersLoad> | null>(null);
  const [activeTab, setActiveTab] = useState<'containers' | 'items' | 'upload'>('containers');

  useEffect(() => {
    const convertedItems = items.map(item => ({
      ...item,
      length: convertFromDisplay(item.length),
      width: convertFromDisplay(item.width),
      height: convertFromDisplay(item.height),
    }));

    const calculation = calculateMultipleContainersLoad(containers, convertedItems, orientation);
    setResults(calculation);
  }, [containers, items, orientation, convertFromDisplay]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">ContainerLoad Pro</h1>
          <p className="text-lg text-slate-600">Multi-container loading with bulk upload capabilities</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Panel - Inputs */}
          <div className="xl:col-span-1 space-y-6">
            {/* Tab Navigation */}
            <Card>
              <CardContent className="p-2">
                <div className="flex gap-2">
                  <button
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeTab === 'containers' 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={() => setActiveTab('containers')}
                  >
                    Containers
                  </button>
                  <button
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeTab === 'items' 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={() => setActiveTab('items')}
                  >
                    Items
                  </button>
                  <button
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeTab === 'upload' 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={() => setActiveTab('upload')}
                  >
                    Bulk Upload
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Tab Content */}
            {activeTab === 'containers' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 bg-blue-500 rounded-sm"></div>
                    </div>
                    Container Management
                  </CardTitle>
                  <CardDescription>Add and manage multiple containers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContainerManager
                    containers={containers}
                    onChange={setContainers}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === 'items' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 bg-green-500 rounded-sm"></div>
                    </div>
                    Item Management
                  </CardTitle>
                  <CardDescription>Add and manage multiple item types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ItemManager
                    items={items}
                    onChange={setItems}
                    unit={unit}
                    onUnitToggle={toggleUnit}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === 'upload' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 bg-purple-500 rounded-sm"></div>
                    </div>
                    Bulk Upload
                  </CardTitle>
                  <CardDescription>Upload items from Excel or CSV file</CardDescription>
                </CardHeader>
                <CardContent>
                  <BulkUpload
                    onItemsUpload={setItems}
                    currentItems={items}
                  />
                </CardContent>
              </Card>
            )}

            {/* Orientation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-orange-500 rounded-sm"></div>
                  </div>
                  Global Settings
                </CardTitle>
                <CardDescription>Apply settings to all containers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Item Orientation</label>
                    <select 
                      value={orientation} 
                      onChange={(e) => setOrientation(e.target.value as Orientation)}
                      className="w-full mt-1 p-2 border border-slate-300 rounded-md transition-all duration-300 focus:border-green-400 focus:ring-2 focus:ring-green-200"
                    >
                      <option value="LxWxH">Length × Width × Height</option>
                      <option value="WxLxH">Width × Length × Height</option>
                      <option value="HxWxL">Height × Width × Length</option>
                      <option value="HxLxW">Height × Length × Width</option>
                      <option value="LxHxW">Length × Height × Width</option>
                      <option value="WxHxL">Width × Height × Length</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Units</label>
                    <div className="flex gap-2 mt-1">
                      <button
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          unit === 'cm' 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        onClick={toggleUnit}
                      >
                        cm
                      </button>
                      <button
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          unit === 'inches' 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        onClick={toggleUnit}
                      >
                        inches
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Visualization */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-indigo-500 rounded-sm"></div>
                  </div>
                  Multi-Container Visualization
                </CardTitle>
                <CardDescription>Visualize loading across all containers</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiContainerVisualization
                  containers={containers}
                  items={items}
                  results={results}
                  unit={unit}
                  onItemsUpdate={setItems}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-teal-500 rounded-sm"></div>
                  </div>
                  Loading Analysis
                </CardTitle>
                <CardDescription>Comprehensive analysis across all containers</CardDescription>
              </CardHeader>
              <CardContent>
                <LoadingChart
                  results={results}
                  containers={containers}
                  items={items}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}