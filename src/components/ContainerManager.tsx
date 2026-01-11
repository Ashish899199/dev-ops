import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { Container } from '../types';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

const CONTAINER_TEMPLATES = [
  { name: '20ft Standard', length: 589, width: 235, height: 239, maxWeight: 28200 },
  { name: '40ft Standard', length: 1203, width: 235, height: 239, maxWeight: 28800 },
  { name: '40ft High Cube', length: 1203, width: 235, height: 269, maxWeight: 28600 },
  { name: '45ft High Cube', length: 1376, width: 235, height: 269, maxWeight: 29400 },
];

interface ContainerManagerProps {
  containers: Container[];
  onChange: (containers: Container[]) => void;
}

export function ContainerManager({ containers, onChange }: ContainerManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newContainer, setNewContainer] = useState<Partial<Container>>({
    name: '',
    length: 589,
    width: 235,
    height: 239,
    maxWeight: 28200,
  });

  const addContainer = () => {
    if (newContainer.name) {
      const container: Container = {
        id: Date.now().toString(),
        name: newContainer.name,
        length: newContainer.length || 589,
        width: newContainer.width || 235,
        height: newContainer.height || 239,
        maxWeight: newContainer.maxWeight || 28200,
      };
      onChange([...containers, container]);
      setNewContainer({
        name: '',
        length: 589,
        width: 235,
        height: 239,
        maxWeight: 28200,
      });
      setSelectedTemplate(null);
    }
  };

  const updateContainer = (id: string, updates: Partial<Container>) => {
    onChange(containers.map(container => 
      container.id === id ? { ...container, ...updates } : container
    ));
  };

  const deleteContainer = (id: string) => {
    onChange(containers.filter(container => container.id !== id));
  };

  const applyTemplate = (template: typeof CONTAINER_TEMPLATES[0], templateName: string) => {
    setNewContainer({
      name: `${template.name} ${containers.length + 1}`,
      length: template.length,
      width: template.width,
      height: template.height,
      maxWeight: template.maxWeight,
    });
    setSelectedTemplate(templateName);
    
    // Add a subtle animation effect
    setTimeout(() => setSelectedTemplate(null), 500);
  };

  return (
    <div className="space-y-4">
      {/* Quick Templates */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Quick Add Container</Label>
        <div className="grid grid-cols-2 gap-2">
          {CONTAINER_TEMPLATES.map((template, index) => {
            const templateName = `${template.name}_${index}`;
            const isSelected = selectedTemplate === templateName;
            
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyTemplate(template, templateName)}
                className={`text-xs transition-all duration-300 transform hover:scale-105 ${
                  isSelected 
                    ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30' 
                    : 'hover:bg-green-50 hover:border-green-300'
                }`}
              >
                {template.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Add Custom Container */}
      <Card className="bg-slate-50">
        <CardContent className="p-4 space-y-3">
          <Input
            placeholder="Container name"
            value={newContainer.name || ''}
            onChange={(e) => setNewContainer({ ...newContainer, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Length (cm)</Label>
              <Input
                type="number"
                value={newContainer.length || ''}
                onChange={(e) => setNewContainer({ ...newContainer, length: parseFloat(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div>
              <Label className="text-xs">Width (cm)</Label>
              <Input
                type="number"
                value={newContainer.width || ''}
                onChange={(e) => setNewContainer({ ...newContainer, width: parseFloat(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div>
              <Label className="text-xs">Height (cm)</Label>
              <Input
                type="number"
                value={newContainer.height || ''}
                onChange={(e) => setNewContainer({ ...newContainer, height: parseFloat(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div>
              <Label className="text-xs">Max Weight (kg)</Label>
              <Input
                type="number"
                value={newContainer.maxWeight || ''}
                onChange={(e) => setNewContainer({ ...newContainer, maxWeight: parseFloat(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>
          <Button 
            onClick={addContainer} 
            className="w-full transition-all duration-300 transform hover:scale-105 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30" 
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Container
          </Button>
        </CardContent>
      </Card>

      {/* Existing Containers */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {containers.map((container) => (
          <Card key={container.id} className="p-3 transition-all duration-300 hover:shadow-md">
            {editingId === container.id ? (
              <div className="space-y-2">
                <Input
                  value={container.name}
                  onChange={(e) => updateContainer(container.id, { name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    value={container.length}
                    onChange={(e) => updateContainer(container.id, { length: parseFloat(e.target.value) || 0 })}
                    min="0"
                  />
                  <Input
                    type="number"
                    value={container.width}
                    onChange={(e) => updateContainer(container.id, { width: parseFloat(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => setEditingId(null)}
                    className="transition-all duration-300 transform hover:scale-105 bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{container.name}</div>
                  <div className="text-xs text-slate-500">
                    {container.length}×{container.width}×{container.height} cm | Max: {container.maxWeight}kg
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(container.id)}
                    className="transition-all duration-300 hover:bg-green-50 hover:text-green-600 hover:scale-110"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteContainer(container.id)}
                    className="transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}