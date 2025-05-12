
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import PersonalInfoForm from './profile/PersonalInfoForm';
import MedicalConditions from './profile/MedicalConditions';
import ProfileActions from './profile/ProfileActions';

const PatientProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState<number | ''>(user?.age || '');
  const [diseases, setDiseases] = useState<string[]>(user?.diseases || []);
  const [disorders, setDisorders] = useState<string[]>(user?.disorders || []);
  
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleAddDisease = (disease: string) => {
    setDiseases([...diseases, disease]);
  };

  const handleRemoveDisease = (diseaseToRemove: string) => {
    setDiseases(diseases.filter(disease => disease !== diseaseToRemove));
  };

  const handleAddDisorder = (disorder: string) => {
    setDisorders([...disorders, disorder]);
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
          <ProfileActions 
            editing={editing} 
            onEdit={() => setEditing(true)} 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <PersonalInfoForm 
          name={name} 
          email={user.email} 
          age={age} 
          editing={editing}
          setName={setName}
          setAge={setAge}
        />

        <MedicalConditions 
          diseases={diseases}
          disorders={disorders}
          editing={editing}
          onAddDisease={handleAddDisease}
          onRemoveDisease={handleRemoveDisease}
          onAddDisorder={handleAddDisorder}
          onRemoveDisorder={handleRemoveDisorder}
        />
      </CardContent>
    </Card>
  );
};

export default PatientProfile;
