import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboardcomp = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/getProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.user);
      } catch (err) {
        console.error('Profile fetch error:', err.message);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:9000/api/logoutUser',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Logout API error:', error.message);
    }
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-400">
      {/* Top bar */}
      <div className="fixed top-0 left-0 w-full h-[50px] bg-gray-800 flex justify-end items-center pr-10 z-40">
        <button
          onClick={handleLogout}
          className="cursor-pointer bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-white transition"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex pt-[50px] min-h-[calc(100vh-50px)]">
        {/* Sidebar */}
        <aside className="w-[18%] bg-gray-900 text-white p-4 flex flex-col items-center gap-3">
          {loading ? (
            <p className="italic text-gray-300">Loading profile...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : profile ? (
            <>
              <h2 className="text-lg font-semibold">{profile.name || 'No Name'}</h2>
              <p className="text-sm text-gray-300">{profile.username || 'No Username'}</p>
            </>
          ) : (
            <p>No profile data</p>
          )}
        </aside>

        {/* Content area */}
        <main className="flex-1 bg-gray-100 p-6">
          <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
          {/* Add more dashboard content here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboardcomp;
