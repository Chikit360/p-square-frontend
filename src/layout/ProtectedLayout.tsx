import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../features/store';
import Cookies from 'js-cookie';
import { setUser } from '../features/auth/user.slice';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser && !user) {
      dispatch(setUser({ data: JSON.parse(storedUser), token }));
    }
  }, [dispatch, user]);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default ProtectedLayout;
