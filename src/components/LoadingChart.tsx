import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MultipleContainersLoadResults, Container, Item } from '../types';
import { Package, TrendingUp, Weight, AlertTriangle } from 'lucide-react';

interface LoadingChartProps {
  results: MultipleContainersLoadResults | null;
  containers: Container[];
  items: Item[];
}

export function LoadingChart({ results, containers, items }: LoadingChartProps) {
  if (!results) {
    return (
      <div className="text-center text-slate-500 py-8">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Add containers and items to see loading analysis</p>
      </div>
    );
  }

  // Container performance data
  const containerBarData = results.containerResults.map(result => ({
    name: result.containerName,
    items: result.totalItems,
    utilization: result.utilizationPercentage,
    weight: result.totalWeight,
  }));

  // Item distribution across all containers
  const itemDistributionData = items.map(item => {
    let totalLoaded = 0;
    results.containerResults.forEach(result => {
      const breakdown = result.itemBreakdown.find(b => b.itemId === item.id);
      if (breakdown) {
        totalLoaded += breakdown.loadedCount;
      }
    });
    
    return {
      name: item.name,
      value: totalLoaded,
      color: item.color,
    };
  }).filter(item => item.value > 0);

  // Combined item breakdown across all containers
  const combinedItemBreakdown = items.map(item => {
    let totalLoaded = 0;
    let totalRequested = 0;
    
    results.containerResults.forEach(result => {
      const breakdown = result.itemBreakdown.find(b => b.itemId === item.id);
      if (breakdown) {
        totalLoaded += breakdown.loadedCount;
        totalRequested += breakdown.requestedCount;
      }
    });
    
    return {
      itemId: item.id,
      itemName: item.name,
      loadedCount: totalLoaded,
      requestedCount: totalRequested,
      utilizationPercentage: totalRequested > 0 ? (totalLoaded / totalRequested) * 100 : 0,
      color: item.color,
    };
  }).filter(item => item.requestedCount > 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Total Items</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{results.totalItems.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Avg Utilization</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{results.averageUtilization.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Weight className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Total Weight</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{results.totalWeight.toLocaleString()} kg</p>
          </CardContent>
        </Card>

        <Card className={results.hasWeightWarning ? "bg-red-50" : "bg-slate-50"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {results.hasWeightWarning ? (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              ) : (
                <div className="w-4 h-4 bg-green-500 rounded-full" />
              )}
              <span className="text-sm font-medium">Weight Status</span>
            </div>
            <p className="text-lg font-bold">
              {results.hasWeightWarning ? "Overweight" : "Within Limit"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Container Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={containerBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="items" fill="#3B82F6" name="Items Loaded" />
                <Bar dataKey="utilization" fill="#10B981" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Item Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={itemDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {itemDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Item Breakdown Table */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Detailed Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-center p-2">Requested</th>
                  <th className="text-center p-2">Loaded</th>
                  <th className="text-center p-2">Remaining</th>
                  <th className="text-center p-2">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {combinedItemBreakdown.map((breakdown) => (
                  <tr key={breakdown.itemId} className="border-b">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: breakdown.color }}
                        />
                        {breakdown.itemName}
                      </div>
                    </td>
                    <td className="text-center p-2">{breakdown.requestedCount}</td>
                    <td className="text-center p-2">{breakdown.loadedCount}</td>
                    <td className="text-center p-2">
                      {breakdown.requestedCount - breakdown.loadedCount}
                    </td>
                    <td className="text-center p-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${breakdown.utilizationPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs">
                          {breakdown.utilizationPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}