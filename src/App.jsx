// App.jsx
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ProtectedRoute from './ProtectedRoute';
import Profile from './Pages/Profile';
import Logs from './Pages/Logs';
import Dashboard from './Pages/Dashboard';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logs" element={<Logs />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
