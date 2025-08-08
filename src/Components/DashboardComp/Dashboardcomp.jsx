import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboardcomp = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:9000/api/logoutUser', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Logout API error:", error.message);
    }
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <div>
      <div className='flex justify-end pr-10 items-center text-white h-[50px] w-[100%] bg-gray-800 absolute z-40 top-0'>
        <button
        className='cursor-pointer'
        onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboardcomp;
