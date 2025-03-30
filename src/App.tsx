import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./features/store";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import CreateMedicineForm from "./pages/medicine/CreateMedicineForm";
import MedicineList from "./pages/medicine/MedicineList";
import SellForm from "./pages/inventory/SellForm";
import SellHistory from "./pages/inventory/SellHistory";
import ProtectedLayout from "./layout/ProtectedLayout";
import { useEffect } from "react";
import Stock from "./pages/inventory/Stock";
import UpdateStock from "./pages/inventory/UpdateStock";
import { ToastContainer } from 'react-toastify';
import UpdateMedicineForm from "./pages/medicine/UpdateMedicine";
import UserProfiles from "./pages/UserProfiles";

export default function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch({ type: 'auth/checkAuth' });
  }, [dispatch]);

  

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Prevent authenticated users from accessing SignIn or SignUp */}
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/medicine/items" element={<MedicineList />} />
            <Route path="/medicine/item/:id/edit" element={<UpdateMedicineForm />} />
            <Route path="/medicine/items/add" element={<CreateMedicineForm />} />
          
            <Route path="/sell" element={<SellHistory />} />
            <Route path="/sell/add" element={<SellForm />} />
            <Route path="/medicine/inventory" element={<Stock />} />
            <Route path="/medicine/inventory/:id" element={<UpdateStock />} />
            <Route path="/profile" element={<UserProfiles />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
