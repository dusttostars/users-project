import React, { useState } from 'react';

const AddUserForm = ({ onUserAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      if (res.ok) {
        const created = await res.json();
        setName('');
        setEmail('');
        onUserAdded(created);
      }
    } catch (err) {
      console.error('Add user failed', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          className="mt-1 block w-full rounded border-gray-300 p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          className="mt-1 block w-full rounded border-gray-300 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
};

export default AddUserForm;
