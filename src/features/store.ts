import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/user.slice'
import medicineReducer from '../features/medicine/medicine.slice'
import saleReducer from './sale/sale.slice'
import activeMedicineReducer from '../features/medicine/activeMedicine.slice'
import authMiddleware from './middlewares/authMiddleware'
import inventoryReducer from './inventory/inventory.slice';
import customerReducer from './customer/customerSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    medicine:medicineReducer,
    inventory:inventoryReducer,
    activeMedicines:activeMedicineReducer,
    sales: saleReducer,
    customers:customerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
