
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoFormProps {
  name: string;
  email: string;
  age: number | '';
  editing: boolean;
  setName: (name: string) => void;
  setAge: (age: number | '') => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  name,
  email,
  age,
  editing,
  setName,
  setAge
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        {editing ? (
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        ) : (
          <div className="text-lg font-medium">{name}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="text-lg font-medium">{email}</div>
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
          <div className="text-lg font-medium">{age || 'Not specified'}</div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
