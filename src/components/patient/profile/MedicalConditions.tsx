
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, PlusCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface MedicalConditionsProps {
  diseases: string[];
  disorders: string[];
  editing: boolean;
  onAddDisease: (disease: string) => void;
  onRemoveDisease: (disease: string) => void;
  onAddDisorder: (disorder: string) => void;
  onRemoveDisorder: (disorder: string) => void;
}

const MedicalConditions: React.FC<MedicalConditionsProps> = ({
  diseases,
  disorders,
  editing,
  onAddDisease,
  onRemoveDisease,
  onAddDisorder,
  onRemoveDisorder
}) => {
  const [newDisease, setNewDisease] = useState('');
  const [newDisorder, setNewDisorder] = useState('');

  const handleAddDisease = () => {
    if (newDisease.trim() && !diseases.includes(newDisease.trim())) {
      onAddDisease(newDisease.trim());
      setNewDisease('');
    }
  };

  const handleAddDisorder = () => {
    if (newDisorder.trim() && !disorders.includes(newDisorder.trim())) {
      onAddDisorder(newDisorder.trim());
      setNewDisorder('');
    }
  };

  return (
    <div className="space-y-3">
      <Label>Medical Conditions</Label>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Diseases</p>
        <div className="flex flex-wrap gap-2">
          {diseases.length > 0 ? (
            diseases.map((disease, index) => (
              <Badge 
                key={index} 
                className="bg-hospital-primary text-white"
                variant={editing ? "outline" : "default"}
              >
                {disease}
                {editing && (
                  <button 
                    className="ml-2" 
                    onClick={() => onRemoveDisease(disease)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No diseases recorded</p>
          )}
        </div>
        
        {editing && (
          <div className="flex mt-2">
            <Input 
              placeholder="Add disease" 
              value={newDisease} 
              onChange={(e) => setNewDisease(e.target.value)} 
              className="mr-2"
            />
            <Button 
              size="sm" 
              onClick={handleAddDisease}
              className="bg-hospital-primary hover:bg-hospital-secondary"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Disorders</p>
        <div className="flex flex-wrap gap-2">
          {disorders.length > 0 ? (
            disorders.map((disorder, index) => (
              <Badge 
                key={index} 
                className="bg-hospital-secondary text-white"
                variant={editing ? "outline" : "default"}
              >
                {disorder}
                {editing && (
                  <button 
                    className="ml-2" 
                    onClick={() => onRemoveDisorder(disorder)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No disorders recorded</p>
          )}
        </div>
        
        {editing && (
          <div className="flex mt-2">
            <Input 
              placeholder="Add disorder" 
              value={newDisorder} 
              onChange={(e) => setNewDisorder(e.target.value)} 
              className="mr-2"
            />
            <Button 
              size="sm" 
              onClick={handleAddDisorder}
              className="bg-hospital-secondary hover:bg-hospital-accent"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalConditions;
