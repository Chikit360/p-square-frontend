import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchStockDetails } from '../../features/stock/stockApi';

const Stock: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stocks, loading, error } = useSelector((state: RootState) => state.stock);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchStockDetails());
  }, [dispatch]);

  if (loading) return <p className="text-blue-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!stocks || stocks.length === 0) return <p className="text-gray-500">No stock available.</p>;

  const toggleExpand = (medicineId: string) => {
    setExpanded(expanded === medicineId ? null : medicineId);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Management</h1>

      {stocks.map((stock) => (
        <div key={stock.medicineId} className="mb-4 border border-gray-300 p-4 rounded-lg">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleExpand(stock.medicineId)}
          >
            <div>
              <h2 className="text-xl font-semibold">{stock.medicineName}</h2>
              <p className="text-gray-600">Medicine ID: {stock.medicineId}</p>
              <p className="text-gray-600">Total Quantity: {stock.totalQuantity}</p>
            </div>
            <span className="text-gray-500">{expanded === stock.medicineId ? '▲' : '▼'}</span>
          </div>

          {/* Collapsible Stock Details */}
          {expanded === stock.medicineId && (
            <table className="w-full border-collapse border border-gray-200 mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Expiry Date</th>
                  <th className="border border-gray-300 p-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {stock.stockDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      {new Date(detail.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-2">{detail.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stock;
