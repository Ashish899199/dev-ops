import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LoadResults, Container } from '../types';
import { Package, AlertTriangle, CheckCircle, TrendingUp, Weight, Layers } from 'lucide-react';

interface ResultCardProps {
  results: LoadResults | null;
  container: Container;
  unit: 'cm' | 'inches';
}

export function ResultCard({ results, container, unit }: ResultCardProps) {
  if (!results) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Enter dimensions to see loading calculations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.dimensionError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Calculation Error</CardTitle>
          <CardDescription>Cannot calculate loading</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {results.dimensionError}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Loading Results
          </CardTitle>
          <CardDescription>Optimal loading calculation for {container.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Items per Layer</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{results.itemsPerLayer.toLocaleString()}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Stack Height</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{results.stackHeight} layers</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Total Items</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{results.totalItems.toLocaleString()}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Space Utilization</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{results.utilizationPercentage.toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Weight className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">Total Weight</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-slate-900">
                {results.totalWeight.toLocaleString()} kg
              </p>
              <span className="text-sm text-slate-500">
                / {container.maxWeight.toLocaleString()} kg max
              </span>
            </div>
          </div>

          {results.weightWarning && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Weight exceeds container maximum payload capacity!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}