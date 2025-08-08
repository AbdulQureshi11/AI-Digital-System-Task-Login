import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sidebarmenu } from '../../Utlis/Sidebar';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Others from './Others';

const Dashboardcomp = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedmenu, setselectedmenu] = useState('Dashboard');
  const content = {
    "Dashboard": <Dashboard />,
    "Profile": <Profile />,
    "Logs": <Others />
  }


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
        <div className="w-[18%] bg-gray-900 text-white p-4 flex flex-col items-center gap-6">
          {/* User Profile Section */}
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

          {/* Sidebar Menu Section */}
          <div className="w-full mt-4">
            {sidebarmenu?.map((item, index) => (
              <div
                key={index}
                onClick={() => setselectedmenu(item?.name)}
                className={`${selectedmenu === item?.name ? "bg-gray-700 font-semibold rounded-md" : ""} flex items-center space-y-3 text-[18px] gap-5 p-2 cursor-pointer transition-all`}>
                <span className='bg-gray-200 p-3 text-gray-900'>{item?.icon}</span>
                <span>{item?.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 bg-gray-100 p-6">
          {content[selectedmenu]}

        </main>
      </div>
    </div>
  );
};

export default Dashboardcomp;
