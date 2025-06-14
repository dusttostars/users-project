import React, { useEffect, useState } from 'react';
import AddUserForm from './components/AddUserForm';
import UserList from './components/UserList';

function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Fetch users failed', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = (user) => {
    setUsers((prev) => [...prev, user]);
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>
      <AddUserForm onUserAdded={handleUserAdded} />
      <hr className="my-6" />
      <UserList users={users} />
    </div>
  );
}

export default App;
