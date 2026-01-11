import React from 'react';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Orientation } from '../types';

interface OrientationToggleProps {
  orientation: Orientation;
  onChange: (orientation: Orientation) => void;
}

export function OrientationToggle({ orientation, onChange }: OrientationToggleProps) {
  const orientations = [
    { value: 'LxWxH', label: 'Length × Width × Height', description: 'Standard orientation' },
    { value: 'WxLxH', label: 'Width × Length × Height', description: 'Rotated 90°' },
    { value: 'HxWxL', label: 'Height × Width × Length', description: 'On side, length vertical' },
    { value: 'HxLxW', label: 'Height × Length × Width', description: 'On side, width vertical' },
    { value: 'LxHxW', label: 'Length × Height × Width', description: 'On side, width horizontal' },
    { value: 'WxHxL', label: 'Width × Height × Length', description: 'On side, length horizontal' },
  ];

  return (
    <RadioGroup value={orientation} onValueChange={(value) => onChange(value as Orientation)}>
      <div className="grid grid-cols-1 gap-3">
        {orientations.map((orient) => (
          <div key={orient.value} className="flex items-center space-x-2">
            <RadioGroupItem value={orient.value} id={orient.value} />
            <div className="flex-1">
              <Label htmlFor={orient.value} className="font-medium cursor-pointer">
                {orient.label}
              </Label>
              <p className="text-sm text-slate-500">{orient.description}</p>
            </div>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}