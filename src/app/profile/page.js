'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
      fetch('/api/subscription')
        .then(res => res.json())
        .then(data => setSubscription(data));
    }
  }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      setMessage('Profile updated!');
    } else {
      setMessage('Failed to update profile.');
    }
  };

  if (!session) return <div>Please log in to view your profile.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleUpdate} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Your Profile</h1>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="mb-4 w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-foreground"
        />
        <input
          type="password"
          placeholder="New password (optional)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4 w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-foreground"
        />
        <button type="submit" className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition mb-2">
          Update Profile
        </button>
        {message && <div className="text-green-600 mt-2">{message}</div>}
        {subscription && (
          <div className="mt-4 text-center text-base font-medium text-green-600 dark:text-green-400">
            Subscription status: {subscription.status} (${subscription.amount}/month)
          </div>
        )}
      </form>
    </div>
  );
}
