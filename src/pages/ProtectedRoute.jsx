import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/FakeAuthContext';
import { useEffect } from 'react';

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(function () {
    if (!isAuthenticated) navigate('/');
  });
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
