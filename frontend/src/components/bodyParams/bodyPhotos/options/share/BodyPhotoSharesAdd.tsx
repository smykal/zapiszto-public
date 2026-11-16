import React, { useEffect, useState } from "react";
import InvitationsService from "../../../../../services/invitations";
import { AcceptedInvitations } from "../../../../../types/types";

interface BodyPhotoSharesAddProps {
  photoId: string;
  onUsersSelected: (userIds: number[]) => void;
}

const BodyPhotoSharesAdd: React.FC<BodyPhotoSharesAddProps> = ({
  photoId,
  onUsersSelected
}) => {
  const [users, setUsers] = useState<AcceptedInvitations[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await InvitationsService.getAcceptedInvitations();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch accepted invitations", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleUser = (userId: number) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = () => {
    onUsersSelected(selectedUserIds);
  };

  return (
    <div>
      <ul>
        {users.map(user => {
          const userId = Number(user.acceptedUserId);

          return (
            <li key={user.acceptedUserId}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(userId)}
                  onChange={() => toggleUser(userId)}
                />
                {user.acceptedUserName} ({user.acceptedUserEmail})
              </label>
            </li>
          );
        })}
      </ul>

      <button onClick={handleSave}>
        Share photo
      </button>
    </div>
  );
};

export default BodyPhotoSharesAdd;
