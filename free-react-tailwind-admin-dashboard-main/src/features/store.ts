import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/user.slice'
import medicineReducer from '../features/medicine/medicine.slice'
import inventoryReducer from '../features/inventory/inventory.slice'
import activeMedicineReducer from '../features/medicine/activeMedicine.slice'
import authMiddleware from './middlewares/authMiddleware'

const store = configureStore({
  reducer: {
    auth: authReducer,
    medicine:medicineReducer,
    inventory:inventoryReducer,
    activeMedicines:activeMedicineReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
