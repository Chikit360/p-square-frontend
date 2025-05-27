import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchInventoryDetailsByMedicineId } from '../../features/inventory/inventoryApi';
import Button from '../../components/ui/Button/Button';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import { Table, TableBody, TableHeader, TableRow } from '../../components/ui/Table';
import { Medicine } from '../../helpers/interfaces';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { getUserRole } from '../../features/auth/user.slice';
import { PencilIcon } from '../../icons';
import { clearInventoryMessage } from '../../features/inventory/inventory.slice';
import { toast } from 'react-toastify';

const Stock: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { inventoryData, loading: stockLoader, message } = useSelector((state: RootState) => state.inventory);
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicine);
  const userRole = useSelector(getUserRole);

  const [selectedItem, setSelectedItem] = useState<Medicine | null>(null);
  const [filteredData, setFilteredData] = useState<Medicine[]>([]);

  // Fetch inventory for selected medicine
  useEffect(() => {
    if (selectedItem) {
      dispatch(fetchInventoryDetailsByMedicineId(selectedItem._id));
    }
  }, [dispatch, selectedItem]);

  // Handle error message
  useEffect(() => {
    if (error && message) {
      toast.error(message);
    }
    return () => {
      dispatch(clearInventoryMessage());
    };
  }, [error, message, dispatch]);

  // Handle search params and filter data
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const selectedMedicineId = searchParams.get('selectedMedicineId');
    const matchedMedicine = medicines.find(med => med._id === selectedMedicineId) || null;

    setSelectedItem(matchedMedicine);
    setFilteredData(
      q ? medicines.filter(item => item.name.toLowerCase().includes(q.toLowerCase())) : medicines
    );
  }, [searchParams, medicines]);

  if (loading) return <LoadingOverlay isLoading={loading} />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      <div className="w-full h-full flex justify-between items-start gap-1">
        {/* Medicine List Section */}
        <div className={`transition-all duration-300 ${selectedItem ? 'w-0 md:w-1/3' : 'w-full'} bg-white dark:bg-white/[0.03] border rounded-lg shadow-sm`}>
          {filteredData.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 mb-2">No stock available.</p>
              <Button onClick={() => console.log('Add Inventory')}>Add Inventory</Button>
            </div>
          ) : (
            <div className="max-h-[calc(100vh-200px)] overflow-auto rounded-lg">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="p-3 text-left font-medium text-gray-500">Name</th>
                    <th className="p-3 text-left font-medium text-gray-500">Batch Number</th>
                    <th className="p-3 text-left font-medium text-gray-500">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((medicine) => (
                    <tr
                      key={medicine._id}
                      className={`cursor-pointer transition ${medicine._id === selectedItem?._id ? 'bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                      onClick={() => navigate(`/medicine/inventory?selectedMedicineId=${medicine._id}`)}
                    >
                      <td className="p-3">{medicine.name}</td>
                      <td className="p-3">{medicine.batchNumber || 'N/A'}</td>
                      <td className="p-3">{medicine.totalQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inventory Details Section */}
        {selectedItem && (
          <div className="w-full md:w-2/3 bg-white dark:bg-white/[0.03] border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Medicine Details</h2>
              <Link to={userRole === 'admin'
                ? `/medicine/inventory/${selectedItem._id}/add-update`
                : `/medicine/inventory/${selectedItem._id}/add`}>
                <Button>Add new stock</Button>
              </Link>
            </div>

            <div className="w-full mb-8 text-gray-700 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Medicine Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-5">
                {Object.entries(selectedItem)
                  .filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="border p-3 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                      <p className="text-gray-800 font-medium dark:text-white">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-gray-600 dark:text-white">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Inventory Table */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Inventory Details</h2>
              {inventoryData.length === 0 ? (
                <p className="text-gray-500">No inventory details available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="border-collapse">
                    <TableHeader className="sticky top-0 bg-gray-100 dark:bg-gray-800 dark:text-white">
                      <TableRow>
                        <th className="px-2 py-3 text-left font-medium">Batch Number</th>
                        <th className="px-2 py-3 text-left font-medium">Expiry Date</th>
                        <th className="px-2 py-3 text-left font-medium">MRP</th>
                        <th className="px-2 py-3 text-left font-medium">Purchase Price</th>
                        <th className="px-2 py-3 text-left font-medium">Selling Price</th>
                        <th className="px-2 py-3 text-left font-medium">Quantity</th>
                        <th className="px-2 py-3 text-left font-medium">Min Stock Level</th>
                        <th className="px-2 py-3 text-left font-medium">Shelf Location</th>
                        {userRole === 'admin' && <th className="px-2 py-3 text-left font-medium">Action</th>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockLoader ? (
                        <TableRow>
                          <td colSpan={9} className="text-center p-3">Loading...</td>
                        </TableRow>
                      ) : (
                        inventoryData.map((stock, index) => (
                          <tr key={index} className="hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white">
                            <td className="p-3">{stock.batchNumber || '-'}</td>
                            <td className="p-3">{stock.expiryDate ? new Date(stock.expiryDate).toLocaleDateString() : '-'}</td>
                            <td className="p-3">{stock.mrp}</td>
                            <td className="p-3">{stock.purchasePrice}</td>
                            <td className="p-3">{stock.sellingPrice}</td>
                            <td className="p-3">{stock.quantityInStock}</td>
                            <td className="p-3">{stock.minimumStockLevel}</td>
                            <td className="p-3">{stock.shelfLocation || '-'}</td>
                            {userRole === 'admin' && (
                              <td className="p-3 cursor-pointer" onClick={() => {
                                navigate(`/medicine/inventory/${selectedItem._id}/add-update?batchNumber=${stock.batchNumber}&expiryDate=${stock.expiryDate}`, { replace: true });
                              }}>
                                <PencilIcon />
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
