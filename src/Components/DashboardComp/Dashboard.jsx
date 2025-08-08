import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/getProfile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-4">Welcome to Dashboard</h1>
      {user ? (
        <div className="text-gray-700">
          <p><strong>Hello,</strong> {user.name || `${user.firstName} ${user.lastName}` || 'User'}</p>
          <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
          <p><strong>Username:</strong> {user.username || 'Not provided'}</p>
        </div>
      ) : (
        <p>User data not available.</p>
      )}
    </div>
  );
};

export default Dashboard;
