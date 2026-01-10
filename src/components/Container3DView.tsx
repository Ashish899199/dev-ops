import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Container, Item, ContainerLoadResults } from '../types';
import { RotateCw, RotateCcw, Maximize2, Grid3X3, Box } from 'lucide-react';

interface Container3DViewProps {
  container: Container;
  items: Item[];
  results: ContainerLoadResults | null;
  unit: 'cm' | 'inches';
}

interface PositionedItem {
  item: Item;
  x: number;
  y: number;
  z: number;
  color: string;
}

export function Container3DView({ 
  container, 
  items, 
  results, 
  unit 
}: Container3DViewProps) {
  const [rotationX, setRotationX] = useState(-20);
  const [rotationY, setRotationY] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate positioned items for 3D visualization
  const getPositionedItems = (): PositionedItem[] => {
    if (!results) return [];
    
    const positionedItems: PositionedItem[] = [];
    let currentX = 0;
    let currentY = 0;
    let currentZ = 0;
    
    items.forEach(item => {
      const itemBreakdown = results.itemBreakdown.find(b => b.itemId === item.id);
      if (itemBreakdown && itemBreakdown.loadedCount > 0) {
        for (let i = 0; i < itemBreakdown.loadedCount; i++) {
          positionedItems.push({
            item,
            x: currentX,
            y: currentY,
            z: currentZ,
            color: item.color,
          });
          
          // Simple stacking logic - place items in a grid pattern
          currentX += item.length;
          if (currentX + item.length > container.length) {
            currentX = 0;
            currentY += item.width;
            if (currentY + item.width > container.width) {
              currentY = 0;
              currentZ += item.height;
            }
          }
        }
      }
    });
    
    return positionedItems;
  };

  const positionedItems = getPositionedItems();

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setRotationY(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [autoRotate]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setRotationY(prev => (prev + deltaX * 0.5) % 360);
    setRotationX(prev => Math.max(-90, Math.min(90, prev - deltaY * 0.5)));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setAutoRotate(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    
    setRotationY(prev => (prev + deltaX * 0.5) % 360);
    setRotationX(prev => Math.max(-90, Math.min(90, prev - deltaY * 0.5)));
    
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate scale factor for visualization
  const maxDimension = Math.max(container.length, container.width, container.height);
  const scale = Math.min(400 / maxDimension, 1) * zoom;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRotationY(prev => (prev - 45) % 360)}
            className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRotationY(prev => (prev + 45) % 360)}
            className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button
            variant={autoRotate ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`transition-all duration-300 ${
              autoRotate 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                : 'hover:bg-green-50 hover:border-green-300'
            }`}
          >
            Auto Rotate
          </Button>
          <Button
            variant={showGrid ? "default" : "outline"}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={`transition-all duration-300 ${
              showGrid 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                : 'hover:bg-green-50 hover:border-green-300'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
            className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
          >
            -
          </Button>
          <span className="text-sm font-medium px-2">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
            className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
          >
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRotationX(-20);
              setRotationY(45);
              setZoom(1);
            }}
            className="transition-all duration-300 hover:bg-green-50 hover:border-green-300"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3D Viewport */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800">
        <CardContent className="p-8">
          <div 
            ref={containerRef}
            className="relative h-96 flex items-center justify-center cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ perspective: '1000px' }}
          >
            <div
              className="relative transition-transform duration-100"
              style={{
                transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scale})`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Container Base */}
              <div
                className="absolute border-2 border-slate-400 bg-slate-700 bg-opacity-20"
                style={{
                  width: `${container.length}px`,
                  height: `${container.width}px`,
                  transform: `rotateX(90deg) translateZ(-${container.height / 2}px)`,
                }}
              >
                {showGrid && (
                  <div className="relative w-full h-full">
                    {/* Grid lines */}
                    {Array.from({ length: Math.floor(container.length / 50) }).map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute border-l border-slate-500 opacity-30"
                        style={{
                          left: `${(i + 1) * 50}px`,
                          height: '100%',
                        }}
                      />
                    ))}
                    {Array.from({ length: Math.floor(container.width / 50) }).map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute border-t border-slate-500 opacity-30"
                        style={{
                          top: `${(i + 1) * 50}px`,
                          width: '100%',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Container Walls */}
              {/* Front wall */}
              <div
                className="absolute border-2 border-slate-400 bg-slate-600 bg-opacity-10"
                style={{
                  width: `${container.length}px`,
                  height: `${container.height}px`,
                  transform: `translateZ(${container.width / 2}px)`,
                }}
              />
              
              {/* Back wall */}
              <div
                className="absolute border-2 border-slate-400 bg-slate-600 bg-opacity-10"
                style={{
                  width: `${container.length}px`,
                  height: `${container.height}px`,
                  transform: `translateZ(-${container.width / 2}px) rotateY(180deg)`,
                }}
              />
              
              {/* Left wall */}
              <div
                className="absolute border-2 border-slate-400 bg-slate-600 bg-opacity-10"
                style={{
                  width: `${container.width}px`,
                  height: `${container.height}px`,
                  transform: `rotateY(-90deg) translateZ(${container.length / 2}px)`,
                }}
              />
              
              {/* Right wall */}
              <div
                className="absolute border-2 border-slate-400 bg-slate-600 bg-opacity-10"
                style={{
                  width: `${container.width}px`,
                  height: `${container.height}px`,
                  transform: `rotateY(90deg) translateZ(${container.length / 2}px)`,
                }}
              />

              {/* 3D Items */}
              {positionedItems.map((positionedItem, index) => (
                <div
                  key={index}
                  className="absolute border transition-all duration-300 hover:brightness-110"
                  style={{
                    width: `${positionedItem.item.length}px`,
                    height: `${positionedItem.item.height}px`,
                    depth: `${positionedItem.item.width}px`,
                    backgroundColor: positionedItem.color,
                    borderColor: positionedItem.color,
                    opacity: 0.8,
                    transform: `
                      translate3d(
                        ${positionedItem.x - container.length / 2}px,
                        ${-positionedItem.z + container.height / 2}px,
                        ${positionedItem.y - container.width / 2}px
                      )
                    `,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Item faces for 3D effect */}
                  <div
                    className="absolute border"
                    style={{
                      width: `${positionedItem.item.length}px`,
                      height: `${positionedItem.item.height}px`,
                      backgroundColor: positionedItem.color,
                      transform: `translateZ(${positionedItem.item.width / 2}px)`,
                      opacity: 0.9,
                    }}
                  />
                  <div
                    className="absolute border"
                    style={{
                      width: `${positionedItem.item.length}px`,
                      height: `${positionedItem.item.height}px`,
                      backgroundColor: positionedItem.color,
                      transform: `translateZ(-${positionedItem.item.width / 2}px) rotateY(180deg)`,
                      opacity: 0.9,
                    }}
                  />
                  <div
                    className="absolute border"
                    style={{
                      width: `${positionedItem.item.width}px`,
                      height: `${positionedItem.item.height}px`,
                      backgroundColor: positionedItem.color,
                      transform: `rotateY(90deg) translateZ(${positionedItem.item.length / 2}px)`,
                      opacity: 0.8,
                    }}
                  />
                  <div
                    className="absolute border"
                    style={{
                      width: `${positionedItem.item.width}px`,
                      height: `${positionedItem.item.height}px`,
                      backgroundColor: positionedItem.color,
                      transform: `rotateY(-90deg) translateZ(${positionedItem.item.length / 2}px)`,
                      opacity: 0.8,
                    }}
                  />
                  <div
                    className="absolute border"
                    style={{
                      width: `${positionedItem.item.length}px`,
                      height: `${positionedItem.item.width}px`,
                      backgroundColor: positionedItem.color,
                      transform: `rotateX(90deg) translateZ(${positionedItem.item.height / 2}px)`,
                      opacity: 0.7,
                    }}
                  />
                  <div
                    className="absolute border"
                    style={{
                      width: `${positionedItem.item.length}px`,
                      height: `${positionedItem.item.width}px`,
                      backgroundColor: positionedItem.color,
                      transform: `rotateX(-90deg) translateZ(${positionedItem.item.height / 2}px)`,
                      opacity: 0.7,
                    }}
                  />
                </div>
              ))}

              {/* Container dimensions label */}
              <div
                className="absolute text-white text-xs font-mono bg-slate-900 bg-opacity-75 px-2 py-1 rounded"
                style={{
                  transform: `translateZ(${container.width / 2 + 10}px) translateY(-${container.height / 2}px)`,
                }}
              >
                {container.length} × {container.width} × {container.height} {unit}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-center text-sm text-slate-600">
        <p>Drag to rotate • Scroll to zoom • Use controls for precise rotation</p>
      </div>
    </div>
  );
}