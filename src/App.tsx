import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./features/store";
import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedLayout from "./layout/ProtectedLayout";
import AppLayout from "./layout/AppLayout";
import useOnlineStatus from "./hooks/useOnlineStatus";
import NotFound from "./pages/OtherPage/NotFound";
import { authRoutes, protectedRoutes } from "./constants/route";




export default function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    dispatch({ type: 'auth/checkAuth' });
  }, [dispatch]);

  if (!isOnline) {
    return <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">You are offline. Please check your internet connection.</h1>
    </div>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={isAuthenticated ? <Navigate to="/" /> : element} />
        ))}
        
        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route element={<AppLayout />}>
            {protectedRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
