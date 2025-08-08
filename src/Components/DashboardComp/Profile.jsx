import React, { useEffect, useState } from 'react';

const Profile = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/getProfile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      const u = data.user || {};
      setProfile({
        name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'No Name',
        username: u.username || 'username',
        email: u.email || 'Email not provided',
        phone: u.mobile || 'Phone not provided',
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        mobile: u.mobile || '',
        // avatar removed
      });
      setForm({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        mobile: u.mobile || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/updateProfile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await res.json();

      setSuccessMsg(data.message || 'Profile updated successfully');
      setEditMode(false);

      // Fresh profile fetch after update
      const profileRes = await fetch('/api/getProfile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      const u = profileData.user || {};

      setProfile({
        name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'No Name',
        username: u.username || 'username',
        email: u.email || 'Email not provided',
        phone: u.mobile || 'Phone not provided',  // map mobile to phone here
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        mobile: u.mobile || ''
      });

      // Notify parent component to update sidebar/profile if needed
      if (onProfileUpdate) {
        onProfileUpdate(profileData.user);
      }

    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      {!editMode ? (
        <>
          <div className="flex flex-col items-center">
            {/* Avatar removed */}
            <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-gray-600">@{profile.username}</p>
          </div>

          <div className="mt-6 space-y-4 text-gray-700">
            <div>
              <h2 className="font-semibold">Email:</h2>
              <p>{profile.email}</p>
            </div>
            <div>
              <h2 className="font-semibold">Phone:</h2>
              <p>{profile.phone}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditMode(true);
              setSuccessMsg('');
              setError(null);
            }}
            className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Update Profile
          </button>

          {successMsg && <p className="mt-4 text-green-600 text-center">{successMsg}</p>}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setError(null);
                setSuccessMsg('');
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>

          {error && <p className="mt-4 text-red-600">{error}</p>}
          {successMsg && <p className="mt-4 text-green-600">{successMsg}</p>}
        </form>
      )}
    </div>
  );
};

export default Profile;
