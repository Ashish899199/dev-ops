import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Container } from '../types';

interface ContainerSelectorProps {
  containers: Container[];
  selected: Container;
  onSelect: (container: Container) => void;
}

export function ContainerSelector({ containers, selected, onSelect }: ContainerSelectorProps) {
  return (
    <Select value={selected.id} onValueChange={(value) => {
      const container = containers.find(c => c.id === value);
      if (container) onSelect(container);
    }}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select container type" />
      </SelectTrigger>
      <SelectContent>
        {containers.map((container) => (
          <SelectItem key={container.id} value={container.id}>
            <div className="flex flex-col">
              <span className="font-medium">{container.name}</span>
              <span className="text-sm text-slate-500">
                {container.length} × {container.width} × {container.height} cm
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}