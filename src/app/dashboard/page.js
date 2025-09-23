'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (session) {
      fetch('/api/payments')
        .then(res => res.json())
        .then(data => setPayments(data));
    }
  }, [session]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Please log in to see your dashboard.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Your Payment History</h1>
      <ul>
        {payments.length === 0 && <li>No payments found.</li>}
        {payments.map(p => (
          <li key={p.id} className="mb-2">
            Paid ${(p.amount / 100).toFixed(2)} on {new Date(p.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
