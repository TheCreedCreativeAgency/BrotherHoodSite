'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2">Email</th>
            <th className="border px-2">Payments</th>
            <th className="border px-2">Subscription</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="border px-2">{u.email}</td>
              <td className="border px-2">{u.payments.length}</td>
              <td className="border px-2">{u.subscriptions[0]?.status || 'none'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
