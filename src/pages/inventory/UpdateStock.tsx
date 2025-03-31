import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { addOrUpdateStock, fetchInventoryDetailsByMedicineId } from '../../features/stock/stockApi';
import { InventoryData } from '../../helpers/interfaces';
import { useParams } from 'react-router';



interface UpdateStockProps {
  initialData?: InventoryData;
}

const UpdateStock: React.FC<UpdateStockProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { inventoryData, loading: stockLoader, } = useSelector((state: RootState) => state.stock);
  const {id}=useParams<{id:string}>();

  // Initialize Form Data
  const [formData, setFormData] = useState<InventoryData>({
    medicineId:  '',
    batchNumber: '',
    manufactureDate:  '',
    expiryDate:  '',
    mrp:  0,
    purchasePrice:  0,
    sellingPrice:  0,
    quantityInStock:  0,
    minimumStockLevel:  0,
    shelfLocation: '',
  });

  // Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : undefined) : value,
    }));
  };

  useEffect(() => {
    if (id) {
   dispatch(fetchInventoryDetailsByMedicineId(id));}
  }, [dispatch,id])

  useEffect(() => {
    const initialData = inventoryData.length > 0 ? inventoryData[0] : { medicineId: id || '' };
    setFormData({
      medicineId: initialData?.medicineId || '',
      batchNumber: initialData?.batchNumber || '',
      manufactureDate: initialData?.manufactureDate
        ? new Date(initialData.manufactureDate).toISOString().split('T')[0]
        : '',
      expiryDate: initialData?.expiryDate
        ? new Date(initialData.expiryDate).toISOString().split('T')[0]
        : '',
      mrp: initialData?.mrp ?? 0,
      purchasePrice: initialData?.purchasePrice ?? 0,
      sellingPrice: initialData?.sellingPrice ?? 0,
      quantityInStock: initialData?.quantityInStock ?? 0,
      minimumStockLevel: initialData?.minimumStockLevel ?? 0,
      shelfLocation: initialData?.shelfLocation || '',
    })
  }, [dispatch, inventoryData]);
  
  
  // Submit Handler
  const handleSubmit = async () => {
    if (!formData.medicineId) {
      alert('Please provide a Medicine ID!');
      return;
    }

    try {
      await dispatch(addOrUpdateStock(formData));
      alert('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {inventoryData.length>0 ? 'Update Stock' : 'Add New Stock'}
      </h1>

      {/* Form Grid Layout with 3 Columns */}
      <div className="grid grid-cols-3 gap-6">
        {/* Medicine ID */}
        <div className="mb-4">
          <label className="block mb-2">Medicine ID</label>
          <input
            type="text"
            name="medicineId"
            className="border p-2 w-full"
            value={formData.medicineId}
            onChange={handleChange}
            disabled={!!formData?.medicineId}
          />
        </div>

        {/* Render Other Fields Dynamically */}
        {Object.entries(formData)
          .filter(([key]) => key !== 'medicineId')
          .map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="block mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type={
                  key.includes('Date')
                    ? 'date'
                    : key.includes('Price') || key.includes('quantity') || key === 'minimumStockLevel'
                    ? 'number'
                    : 'text'
                }
                name={key}
                disabled={key === 'medicineId'}
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                className="border p-2 w-full"
                value={value?.toString() || ''}
                onChange={handleChange}
              />
            </div>
          ))}
      </div>

      {/* Submit Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4"
        onClick={handleSubmit}
        disabled={!formData.medicineId}
      >
        {inventoryData.length>0 ? 'Update Stock' : 'Add Stock'}
      </button>
    </div>
  );
};

export default UpdateStock;
