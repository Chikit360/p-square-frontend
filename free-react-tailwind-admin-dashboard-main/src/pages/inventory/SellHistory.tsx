import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { getAllSales } from '../../features/inventory/inventoryApi';

const SellHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sales, error, loading } = useSelector((state: RootState) => state.inventory);

  useEffect(() => {
    dispatch(getAllSales());
  }, [dispatch]);

  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  if (loading) {
    return <div className="p-8 text-center text-blue-500 text-lg">Loading sales data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500 text-lg">Error: {error}</div>;
  }

  if (sales.length === 0) {
    return <div className="p-8 text-center text-gray-500 text-lg">No sales history available.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sales History</h1>

      {sales.map((monthlySale, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold">{getMonthName(monthlySale.month)} {monthlySale.year}</h2>
          <p className="font-semibold">Total Earnings: ${monthlySale.totalTransaction?.toFixed(2)}</p>

          <table className="table-auto w-full mt-4 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Invoice ID</th>
                <th className="border border-gray-300 p-2">Customer Name</th>
                <th className="border border-gray-300 p-2">Customer Contact</th>
                <th className="border border-gray-300 p-2">Total Amount</th>
                <th className="border border-gray-300 p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {monthlySale.sales.map((sale) => (
                <tr key={sale.invoiceId} className="text-center hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{sale.invoiceId}</td>
                  <td className="border border-gray-300 p-2">{sale.customerName || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{sale.customerContact || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">${sale.totalAmount?.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">{new Date(sale.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default SellHistory;
