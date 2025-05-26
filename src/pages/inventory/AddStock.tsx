import React, { useState } from 'react';
import { useDispatch, } from 'react-redux';
import { AppDispatch, } from '../../features/store';
import { addInventory, } from '../../features/inventory/inventoryApi';
import { InventoryData } from '../../helpers/interfaces';
import { useNavigate, useParams } from 'react-router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


interface UpdateStockProps {
  initialData?: InventoryData;
}

const AddStock: React.FC<UpdateStockProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>();

  // Initialize Form Data
  const [formData, setFormData] = useState<InventoryData>({
    medicineId: id || '',
    batchNumber: '',
    expiryDate: '',
    mrp: 0,
    purchasePrice: 0,
    // sellingPrice:  0,
    quantityInStock: 0,
    minimumStockLevel: 0,
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



  // Submit Handler
  const handleSubmit = async () => {
    if (!id) {
      alert('Please provide a Medicine ID!');
      return;
    }

    try {

      await dispatch(addInventory(formData));
      // this navigation will handle proper but for now, only for client purpose 
      navigate('/medicine/items/add')
      alert('Stock Created successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Add New Stock
      </h1>

      {/* Form Grid Layout with 3 Columns */}
      <div className="grid grid-cols-3 gap-6">

        {/* Render Other Fields Dynamically */}
        {Object.entries(formData)
          .filter(([key]) => key !== 'medicineId')
          .map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="block mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {key.includes('Date') ? (
                <DatePicker
                  selected={value ? new Date(value) : null}
                  onChange={(date: Date | null) =>
                    handleChange({
                      target: {
                        name: key,
                        value: date ? date.toISOString().split('T')[0] : '',
                      },
                    } as any)
                  }
                  className="h-9 w-full appearance-none rounded-md border bg-white border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholderText={`Select ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                  dateFormat="yyyy-MM-dd" // matches ISO string format
                />
              ) : (
                <input
                  type={
                    key.includes('Price') || key.includes('quantity') || key === 'minimumStockLevel'
                      ? 'number'
                      : 'text'
                  }
                  name={key}
                  disabled={key === 'medicineId'}
                  placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                  className="h-9 w-full appearance-none rounded-md border bg-white border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  value={value?.toString() || ''}
                  onChange={handleChange}
                />
              )}

            </div>
          ))}
      </div>

      {/* Submit Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4"
        onClick={handleSubmit}
        disabled={!id}
      >
        Add Stock
      </button>
    </div>
  );
};

export default AddStock;
