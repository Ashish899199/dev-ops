import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Item } from '../types';
import { Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface BulkUploadProps {
  onItemsUpload: (items: Item[]) => void;
  currentItems: Item[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function BulkUpload({ onItemsUpload, currentItems }: BulkUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadTemplate = () => {
    setIsDownloading(true);
    const csvContent = `name,length,width,height,weight,quantity
Sample Box,50,40,30,10,5
Large Crate,100,80,60,25,3
Small Package,30,20,15,5,10`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'container_items_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    setTimeout(() => setIsDownloading(false), 500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('File must contain at least a header and one data row');
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['name', 'length', 'width', 'height', 'weight', 'quantity'];
        
        for (const header of requiredHeaders) {
          if (!headers.includes(header)) {
            throw new Error(`Missing required column: ${header}`);
          }
        }

        const newItems: Item[] = [];
        let colorIndex = currentItems.length % COLORS.length;

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const itemData: any = {};
          
          headers.forEach((header, index) => {
            itemData[header] = values[index];
          });

          const item: Item = {
            id: Date.now().toString() + i,
            name: itemData.name || `Item ${i}`,
            length: parseFloat(itemData.length) || 0,
            width: parseFloat(itemData.width) || 0,
            height: parseFloat(itemData.height) || 0,
            weight: parseFloat(itemData.weight) || 0,
            quantity: parseInt(itemData.quantity) || 1,
            color: COLORS[colorIndex % COLORS.length],
          };

          if (item.length > 0 && item.width > 0 && item.height > 0) {
            newItems.push(item);
            colorIndex++;
          }
        }

        if (newItems.length === 0) {
          throw new Error('No valid items found in file');
        }

        onItemsUpload([...currentItems, ...newItems]);
        setUploadStatus('success');
        setUploadedCount(newItems.length);
        setErrorMessage('');
        
        // Reset file input
        if (event.target) {
          event.target.value = '';
        }
      } catch (error) {
        setUploadStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Download Template */}
      <Card className="bg-blue-50 transition-all duration-300 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Download Template</h4>
              <p className="text-sm text-blue-700">Get a CSV template with the correct format</p>
            </div>
            <Button 
              onClick={downloadTemplate} 
              variant="outline" 
              size="sm"
              className={`transition-all duration-300 transform hover:scale-105 ${
                isDownloading 
                  ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30' 
                  : 'hover:bg-green-50 hover:border-green-300'
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="bg-slate-50 transition-all duration-300 hover:shadow-md">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload" className="text-sm font-medium text-slate-700">
                Upload CSV File
              </Label>
              <p className="text-xs text-slate-500 mt-1">
                CSV with columns: name, length, width, height, weight, quantity
              </p>
            </div>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center transition-all duration-300 hover:border-green-400 hover:bg-green-50">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-600 mb-2">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="max-w-xs mx-auto"
              />
            </div>

            {/* Status Messages */}
            {uploadStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50 transition-all duration-300 animate-pulse">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Successfully uploaded {uploadedCount} items!
                </AlertDescription>
              </Alert>
            )}

            {uploadStatus === 'error' && (
              <Alert className="border-red-200 bg-red-50 transition-all duration-300">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Format Guide */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">CSV Format Guide</h4>
          <div className="text-xs text-slate-600 space-y-1">
            <p><strong>Required columns:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>name: Item name (text)</li>
              <li>length: Item length in cm (number)</li>
              <li>width: Item width in cm (number)</li>
              <li>height: Item height in cm (number)</li>
              <li>weight: Item weight in kg (number)</li>
              <li>quantity: Number of items (integer)</li>
            </ul>
            <p className="mt-2"><strong>Example:</strong></p>
            <code className="bg-slate-100 p-1 rounded block">
              name,length,width,height,weight,quantity<br/>
              Box A,50,40,30,10,5<br/>
              Crate B,100,80,60,25,3
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}