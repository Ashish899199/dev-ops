import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Item } from '../types';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

interface ItemManagerProps {
  items: Item[];
  onChange: (items: Item[]) => void;
  unit: 'cm' | 'inches';
  onUnitToggle: () => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function ItemManager({ items, onChange, unit, onUnitToggle }: ItemManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    length: 50,
    width: 40,
    height: 30,
    weight: 10,
    quantity: 1,
    color: COLORS[0],
  });

  const addItem = () => {
    if (newItem.name && newItem.length && newItem.width && newItem.height) {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem.name,
        length: newItem.length,
        width: newItem.width,
        height: newItem.height,
        weight: newItem.weight || 0,
        quantity: newItem.quantity || 1,
        color: newItem.color || COLORS[0],
      };
      onChange([...items, item]);
      setNewItem({
        name: '',
        length: 50,
        width: 40,
        height: 30,
        weight: 10,
        quantity: 1,
        color: COLORS[items.length % COLORS.length],
      });
    }
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    onChange(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Unit Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Units</span>
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

      {/* Add New Item */}
      <Card className="bg-slate-50">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Item name"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity || ''}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">L ({unit})</Label>
              <Input
                type="number"
                value={newItem.length || ''}
                onChange={(e) => setNewItem({ ...newItem, length: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-xs">W ({unit})</Label>
              <Input
                type="number"
                value={newItem.width || ''}
                onChange={(e) => setNewItem({ ...newItem, width: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-xs">H ({unit})</Label>
              <Input
                type="number"
                value={newItem.height || ''}
                onChange={(e) => setNewItem({ ...newItem, height: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Weight (kg)</Label>
              <Input
                type="number"
                value={newItem.weight || ''}
                onChange={(e) => setNewItem({ ...newItem, weight: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-xs">Color</Label>
              <div className="flex gap-1">
                {COLORS.map(color => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border-2"
                    style={{ 
                      backgroundColor: color,
                      borderColor: newItem.color === color ? '#1F2937' : 'transparent'
                    }}
                    onClick={() => setNewItem({ ...newItem, color })}
                  />
                ))}
              </div>
            </div>
          </div>
          <Button onClick={addItem} className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Existing Items */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <Card key={item.id} className="p-3">
            {editingId === item.id ? (
              <div className="space-y-2">
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    value={item.length}
                    onChange={(e) => updateItem(item.id, { length: parseFloat(e.target.value) || 0 })}
                    min="0"
                  />
                  <Input
                    type="number"
                    value={item.width}
                    onChange={(e) => updateItem(item.id, { width: parseFloat(e.target.value) || 0 })}
                    min="0"
                  />
                  <Input
                    type="number"
                    value={item.height}
                    onChange={(e) => updateItem(item.id, { height: parseFloat(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setEditingId(null)}>
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500">
                      {item.length}×{item.width}×{item.height} {unit} × {item.quantity} pcs
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(item.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
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