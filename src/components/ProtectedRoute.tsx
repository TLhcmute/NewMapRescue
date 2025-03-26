
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user.isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
