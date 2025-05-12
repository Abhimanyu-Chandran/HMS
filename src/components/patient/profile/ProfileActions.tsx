
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileActionsProps {
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  editing,
  onEdit,
  onSave,
  onCancel
}) => {
  return (
    <>
      {!editing ? (
        <Button 
          className="bg-hospital-primary hover:bg-hospital-secondary"
          onClick={onEdit}
        >
          Edit Profile
        </Button>
      ) : (
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            className="bg-hospital-primary hover:bg-hospital-secondary"
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      )}
    </>
  );
};

export default ProfileActions;
