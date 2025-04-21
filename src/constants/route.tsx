import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import Home from "../pages/Dashboard/Home";
import AddStock from "../pages/inventory/AddStock";
import Stock from "../pages/inventory/Stock";
import UpdateStock from "../pages/inventory/UpdateStock";
import CreateMedicineForm from "../pages/medicine/CreateMedicineForm";
import MedicineList from "../pages/medicine/MedicineList";
import UpdateMedicineForm from "../pages/medicine/UpdateMedicine";
import SaleForm from "../pages/sale/SaleForm";
import SaleHistory from "../pages/sale/SaleHistory";
import FormDropDown from "../pages/utility/FormDropDown";
import CustomerHistory from "../pages/user/CustomerHistory";
import CustomerList from "../pages/user/CustomerList";
import UserProfiles from "../pages/UserProfiles";
import StrengthDropDown from "../pages/utility/StrengthDropDown";
import FileUploadResponsePage from "../pages/FileUploadResponsePage";

export const authRoutes = [
    { path: "/signin", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> }
  ];
  
  export const protectedRoutes = [
    { path: "/", element: <Home />,params:[] },
    { path: "/medicine/items",params:[], element: <MedicineList /> },
    { path: "/medicine/items/:id/edit",params:["id"], element: <UpdateMedicineForm /> },
    { path: "/medicine/items/add",params:[], element: <CreateMedicineForm /> },
    { path: "/sale",params:[], element: <SaleHistory /> },
    { path: "/sale/add",params:[], element: <SaleForm /> },
    { path: "/medicine/inventory",params:[], element: <Stock /> },
    { path: "/medicine/inventory/:id/add-update",params:["id"], element: <UpdateStock /> },
    { path: "/medicine/inventory/:id/add",params:[], element: <AddStock /> },
    { path: "/customer/:id/purchase-history",params:["id"], element: <CustomerHistory /> },
    { path: "/customer-list",params:[], element: <CustomerList /> },
    { path: "/profile",params:[], element: <UserProfiles /> },
    { path: "/file-upload/response",params:[], element: <FileUploadResponsePage /> },


    { path: "/admin/strength",params:[], element: <StrengthDropDown /> },
    { path: "/admin/form",params:[], element: <FormDropDown /> }
  ];