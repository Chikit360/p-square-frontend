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