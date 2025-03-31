import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchInventoryDetailsByMedicineId } from '../../features/stock/stockApi';
import Button from '../../components/ui/button/Button';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import { Table, TableBody, TableHeader, TableRow } from '../../components/ui/table';
import { Medicine } from '../../helpers/interfaces';
import { Link, useSearchParams } from 'react-router';


const Stock: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams]=useSearchParams();
  const { inventoryData, loading: stockLoader, } = useSelector((state: RootState) => state.stock);
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicine);
  const [selectedItem, setSelectedItem] = useState<Medicine | null>(null);
  const [filteredData, setFilteredData] = useState<Medicine[]>([])

  useEffect(() => {
    if (selectedItem !== null) {
      dispatch(fetchInventoryDetailsByMedicineId(selectedItem._id));
    }
  }, [dispatch, selectedItem]);

  // for default select first item of table
  // useEffect(() => {
  //   if (medicines?.length > 0) {
  //     setSelectedItem(medicines[0]);
  //   }
  // }, [medicines]);

  useEffect(() => {
    const q = searchParams.get('q');
    console.log(q);
  
    if (!q) {
      setFilteredData(medicines);
    } else {
      setFilteredData(medicines.filter(item => item.name.toLowerCase().includes(q?.toLowerCase() || '')));
    }
  }, [searchParams, medicines]);
  
  

  if (loading) return <LoadingOverlay isLoading={loading} />;
  if (error) return <p className="text-red-500">Error: {error}</p>;




  return (
    <div className="p-6 h-full w-full">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      {/* Layout Section */}
      <div className="w-full h-full flex gap-6">
        {/* Medicine List Section */}
        <div className={`transition-all duration-300 ${selectedItem ? 'w-1/3' : 'w-full'} border border-gray-300 rounded-lg p-4 shadow-sm`}>
          {filteredData?.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-gray-500">No stock available.</p>
              <Button onClick={() => console.log('Add Inventory')}>Add Inventory</Button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 max-h-[calc(100vh-200px)] overflow-x-auto overflow-y-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="sticky -top-2 bg-gray-100 dark:bg-gray-900">
                  <tr>
                    <th className="p-3 text-left border border-gray-200">Name</th>
                    <th className="p-3 text-left border border-gray-200">Batch Number</th>
                    <th className="p-3 text-left border border-gray-200">Category</th>
                    <th className="p-3 text-left border border-gray-200">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData?.map((medicine) => (
                    <tr
                      key={medicine._id}
                      className={`cursor-pointer transition duration-200 ${String(medicine._id) === String(selectedItem?._id) ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedItem(medicine)}
                    >
                      <td className="p-3 border border-gray-200">{medicine.name}</td>
                      <td className="p-3 border border-gray-200">{medicine.batchNumber || 'N/A'}</td>
                      <td className="p-3 border border-gray-200">{medicine.category}</td>
                      <td className="p-3 border border-gray-200">{medicine.totalQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Medicine Details & Inventory Details Section */}
        {selectedItem && (
          <div className="w-2/3 border bg-white border-gray-300 dark:bg-gray-900 rounded-lg p-6 shadow-sm relative">

            <div className='flex justify-between items-center mb-6'>
              <h2 className="text-2xl font-semibold text-gray-800">Medicine Details</h2>
              <Button className='float-right'> <Link to={`/medicine/inventory/${selectedItem._id}/add-update`}>Add/Update</Link> </Button>
            </div>

            {/* Medicine Details */}
            <div className=" bg-white dark:bg-gray-900 w-full mb-8 text-gray-700  max-h-[calc(100vh-300px)] overflow-y-auto">

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2'>
                {Object.entries(selectedItem)
                  .filter(([key]) => !['createdAt', 'updatedAt', '_id', '__v'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="border p-3 rounded-lg shadow-sm bg-white dark:bg-gray-900">
                      <p className="text-gray-800 font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </p>
                      <p className="text-gray-600">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Inventory Details */}
              <br />
              <div className='w-full text-xs'>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Inventory Details</h2>
                {inventoryData.length === 0 ? (
                  <p className="text-gray-500">No inventory details available.</p>
                ) : (
                  <div className='overflow-hidden w-full h-full'>
                    <div className="w-full overflow-x-auto">
  <Table className="min-w-[1000px] border-collapse border border-gray-300">
    <TableHeader className="sticky top-0 bg-gray-100">
      <TableRow>
        <th className="border border-gray-300 p-3 text-left">Batch Number</th>
        <th className="border border-gray-300 p-3 text-left">Manufacture Date</th>
        <th className="border border-gray-300 p-3 text-left">Expiry Date</th>
        <th className="border border-gray-300 p-3 text-left">MRP</th>
        <th className="border border-gray-300 p-3 text-left">Purchase Price</th>
        <th className="border border-gray-300 p-3 text-left">Selling Price</th>
        <th className="border border-gray-300 p-3 text-left">Quantity</th>
        <th className="border border-gray-300 p-3 text-left">Min Stock Level</th>
        <th className="border border-gray-300 p-3 text-left">Shelf Location</th>
      </TableRow>
    </TableHeader>
    <TableBody>
      {stockLoader ? (
        <TableRow>
          <td className="h-[100px] text-center p-2" colSpan={9}>Loading...</td>
        </TableRow>
      ) : inventoryData.map((stock, index) => (
        <tr key={index} className="hover:bg-gray-50 transition">
          <td className="border border-gray-300 p-3">{stock.batchNumber || '-'}</td>
          <td className="border border-gray-300 p-3">
            {stock.manufactureDate ? new Date(stock.manufactureDate).toLocaleDateString() : '-'}
          </td>
          <td className="border border-gray-300 p-3">
            {stock.expiryDate ? new Date(stock.expiryDate).toLocaleDateString() : '-'}
          </td>
          <td className="border border-gray-300 p-3">{stock.mrp}</td>
          <td className="border border-gray-300 p-3">{stock.purchasePrice}</td>
          <td className="border border-gray-300 p-3">{stock.sellingPrice}</td>
          <td className="border border-gray-300 p-3">{stock.quantityInStock}</td>
          <td className="border border-gray-300 p-3">{stock.minimumStockLevel}</td>
          <td className="border border-gray-300 p-3">{stock.shelfLocation || '-'}</td>
        </tr>
      ))}
    </TableBody>
  </Table>
</div>

                  </div>
                )}
              </div>
            </div>


          </div>
        )}

      </div>

    </div>

  );
};

export default Stock;
