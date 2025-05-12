
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X } from 'lucide-react';

const PatientProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState<number | ''>(user?.age || '');
  const [newDisease, setNewDisease] = useState('');
  const [newDisorder, setNewDisorder] = useState('');
  const [diseases, setDiseases] = useState<string[]>(user?.diseases || []);
  const [disorders, setDisorders] = useState<string[]>(user?.disorders || []);
  
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleAddDisease = () => {
    if (newDisease.trim() && !diseases.includes(newDisease.trim())) {
      setDiseases([...diseases, newDisease.trim()]);
      setNewDisease('');
    }
  };

  const handleRemoveDisease = (diseaseToRemove: string) => {
    setDiseases(diseases.filter(disease => disease !== diseaseToRemove));
  };

  const handleAddDisorder = () => {
    if (newDisorder.trim() && !disorders.includes(newDisorder.trim())) {
      setDisorders([...disorders, newDisorder.trim()]);
      setNewDisorder('');
    }
  };

  const handleRemoveDisorder = (disorderToRemove: string) => {
    setDisorders(disorders.filter(disorder => disorder !== disorderToRemove));
  };

  const handleSave = async () => {
    await updateUserProfile({
      name,
      age: age ? Number(age) : undefined,
      diseases,
      disorders
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setAge(user.age || '');
    setDiseases(user.diseases || []);
    setDisorders(user.disorders || []);
    setEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Patient Profile</CardTitle>
          {!editing ? (
            <Button 
              className="bg-hospital-primary hover:bg-hospital-secondary"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                className="bg-hospital-primary hover:bg-hospital-secondary"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          {editing ? (
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          ) : (
            <div className="text-lg font-medium">{user.name}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="text-lg font-medium">{user.email}</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          {editing ? (
            <Input 
              id="age" 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
            />
          ) : (
            <div className="text-lg font-medium">{user.age || 'Not specified'}</div>
          )}
        </div>

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
                        onClick={() => handleRemoveDisease(disease)}
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
                        onClick={() => handleRemoveDisorder(disorder)}
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
      </CardContent>
    </Card>
  );
};

export default PatientProfile;
