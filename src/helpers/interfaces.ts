export interface Medicine {
    _id: string;
    medicineCode: string;
    name: string;
    genericName: string;
    // manufacturer: string;
    // category: string;
    form: string;
    strength: string;
    unit: string;
    prescriptionRequired: boolean;
    batchNumber: string;
    totalQuantity: number;
    // notes?: string;
    // status: string;
  }
  
  export interface InventoryData {
    medicineId: string;
    batchNumber?: string;
    // manufactureDate?: string;
    expiryDate?: string;
    mrp?: number;
    purchasePrice?: number;
    sellingPrice?: number;
    quantityInStock?: number;
    minimumStockLevel?: number;
    shelfLocation?: string;
  }

  export interface DropdownOption {
    _id?: string;
    label: string;
    value: string;
    inputFieldName: string;
    status: string|"active" | "inactive";
  }

  export interface Dropdowns {
    form: DropdownOption[];
    strength: DropdownOption[];
  }

  // Define a global error payload interface
export interface GlobalErrorPayload {
  message: string;
  error: boolean;
  status: number;
  success: boolean;
  data: null;
}
export interface NotificationI {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO date string
}