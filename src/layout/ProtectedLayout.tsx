import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';


const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const location = useLocation();

  // useEffect(() => {
  //   const token = Cookies.get('token');
  //   const storedUser = localStorage.getItem('user');
  //   console.log(token, storedUser , user);
  //   if (token && storedUser && !user) {
  //     const parsedUser = JSON.parse(storedUser);
  //     dispatch(setUser({ data: {...parsedUser, token} }));
  //   }
  // }, [dispatch, user]);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default ProtectedLayout;
