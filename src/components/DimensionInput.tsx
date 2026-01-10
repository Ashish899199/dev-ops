import React from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { ItemDimensions } from '../types';
import { Ruler } from 'lucide-react';

interface DimensionInputProps {
  dimensions: ItemDimensions;
  onChange: (dimensions: ItemDimensions) => void;
  unit: 'cm' | 'inches';
  onUnitToggle: () => void;
}

export function DimensionInput({ dimensions, onChange, unit, onUnitToggle }: DimensionInputProps) {
  const handleDimensionChange = (field: keyof ItemDimensions, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0) {
      onChange({ ...dimensions, [field]: numValue });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Units</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={unit === 'cm' ? 'default' : 'outline'}
            size="sm"
            onClick={onUnitToggle}
          >
            cm
          </Button>
          <Button
            variant={unit === 'inches' ? 'default' : 'outline'}
            size="sm"
            onClick={onUnitToggle}
          >
            inches
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="length">Length ({unit})</Label>
          <Input
            id="length"
            type="number"
            value={dimensions.length}
            onChange={(e) => handleDimensionChange('length', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <Label htmlFor="width">Width ({unit})</Label>
          <Input
            id="width"
            type="number"
            value={dimensions.width}
            onChange={(e) => handleDimensionChange('width', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <Label htmlFor="height">Height ({unit})</Label>
          <Input
            id="height"
            type="number"
            value={dimensions.height}
            onChange={(e) => handleDimensionChange('height', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={dimensions.weight}
            onChange={(e) => handleDimensionChange('weight', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}