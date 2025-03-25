import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { addOrUpdateStock } from '../../features/stock/stockApi';
import { searchMedicine } from '../../features/medicine/medicineApi';

const UpdateStock: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchResult, loading, error } = useSelector((state: RootState) => state.medicine);

  const [dropDown, setDropDown] = useState<boolean>(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounced Search
  useEffect(() => {
    if (!selectedMedicineId && searchTerm.length >= 3) {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      const timeout = setTimeout(() => {
        dispatch(searchMedicine({ q: searchTerm }));
        setDropDown(true);
      }, 300);
      setDebounceTimeout(timeout);
    } else {
      setDropDown(false);
    }
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [dispatch, searchTerm, selectedMedicineId]);

  // Update stock handler
  const handleUpdateStock = () => {
    if (!selectedMedicineId || !expiryDate || !quantity) {
      alert('Please fill all fields');
      return;
    }
    dispatch(addOrUpdateStock({ medicineId: selectedMedicineId, expiryDate, quantity: Number(quantity) }));
    setExpiryDate('');
    setQuantity('');
    setSearchTerm('');
    setSelectedMedicineId('');
    setDropDown(false);
  };

  // Handle Medicine Selection
  const handleSelectMedicine = (stock: any) => {
    setSelectedMedicineId(stock._id);
    setSearchTerm(stock.name);
    setExpiryDate(stock.expiryDate ? new Date(stock.expiryDate).toISOString().split('T')[0] : '');
    setQuantity(stock.quantity?.toString() || '');
    setDropDown(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Update Stock</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Medicine Search Dropdown */}
      <div className="mb-4 relative">
        <label className="block mb-2">Search Medicine</label>
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Search by Medicine Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 3 && setDropDown(true)}
        />

        {/* Dropdown with Loader and Results */}
        {searchTerm && dropDown && (
          <ul className="absolute border bg-white w-full mt-1 max-h-40 overflow-y-auto">
            {loading ? (
              <li className="p-2 text-blue-500">Loading...</li>
            ) : searchResult?.length > 0 ? (
              searchResult.map((stock) => (
                <li
                  key={stock.medicineId}
                  className={`p-2 cursor-pointer ${selectedMedicineId === stock.medicineId ? 'bg-blue-100' : ''}`}
                  onClick={() => handleSelectMedicine(stock)}
                >
                  {stock.name} (Expiry: {new Date(stock.expiryDate).toLocaleDateString()} | Quantity: {stock.quantityInStock})
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No matching medicines found</li>
            )}
          </ul>
        )}
      </div>

      {/* Expiry Date and Quantity Inputs */}
      <div className="mb-4">
        <label className="block mb-2">Expiry Date</label>
        <input
          type="date"
          className="border p-2 w-full"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Quantity</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 disabled:bg-gray-400"
        onClick={handleUpdateStock}
        disabled={!selectedMedicineId || !expiryDate || !quantity}
      >
        Update Stock
      </button>
    </div>
  );
};

export default UpdateStock;
