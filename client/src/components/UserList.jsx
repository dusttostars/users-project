import React from 'react';

const UserList = ({ users }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {users.map((user) => (
        <li key={user.id} className="py-2">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
