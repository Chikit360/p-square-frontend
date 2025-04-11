import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchInventoryDetailsByMedicineId } from '../../features/inventory/inventoryApi';
import Button from '../../components/ui/button/Button';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import { Table, TableBody, TableHeader, TableRow } from '../../components/ui/table';
import { Medicine } from '../../helpers/interfaces';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { getUserRole } from '../../features/auth/user.slice';
import { PencilIcon } from '../../icons';
import { clearInventoryMessage } from '../../features/inventory/inventory.slice';
import { toast } from 'react-toastify';


const Stock: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate=useNavigate()
  const { inventoryData, loading: stockLoader,message } = useSelector((state: RootState) => state.inventory);
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicine);
  const [selectedItem, setSelectedItem] = useState<Medicine | null>(null);
  const [filteredData, setFilteredData] = useState<Medicine[]>([])
  const userRole = useSelector(getUserRole);

  useEffect(() => {
    if (selectedItem !== null) {
      dispatch(fetchInventoryDetailsByMedicineId(selectedItem._id));
    }
  }, [dispatch, selectedItem]);

  useEffect(() => {
      if (error) {
        toast.error(message);
      }
      
      return ()=>{
        dispatch(clearInventoryMessage())
      }
    }, [error, message]);

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
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      {/* Layout Section */}
      <div className="w-full h-full flex justify-between items-start gap-1">
        {/* Medicine List Section */}
        <div className={`transition-all duration-300 ${selectedItem ? 'w-0 md:w-1/3' : 'w-full'} bg-white dark:bg-white/[0.03] border-gray-200 dark:border-gray-900 rounded-lg shadow-sm`}>
          {filteredData?.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-gray-500">No stock available.</p>
              <Button onClick={() => console.log('Add Inventory')}>Add Inventory</Button>
            </div>
          ) : (
            <div className=" max-h-[calc(100vh-200px)] overflow-x-auto overflow-y-auto rounded-lg">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="p-3 text-left px-5 py-3 font-medium text-gray-500">Name</th>
                    <th className="p-3 text-left px-5 py-3 font-medium text-gray-500">Batch Number</th>
                    {/* <th className="p-3 text-left px-5 py-3 font-medium text-gray-500">Category</th> */}
                    <th className="p-3 text-left px-5 py-3 font-medium text-gray-500">Stock</th>
                  </tr>
                </thead>
                <tbody >
                  {filteredData?.map((medicine) => (
                    <tr
                      key={medicine._id}
                      className={`mx-1 cursor-pointer transition duration-200 ${String(medicine._id) === String(selectedItem?._id) ? 'bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'}`}
                      onClick={() => setSelectedItem(medicine)}
                    >
                      <td className="p-3">{medicine.name}</td>
                      <td className="p-3">{medicine.batchNumber || 'N/A'}</td>
                      {/* <td className="p-3">{medicine.category}</td> */}
                      <td className="p-3">{medicine.totalQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Medicine Details & Inventory Details Section */}
        {selectedItem && (
          <div className="w-full md:w-2/3 bg-white dark:bg-white/[0.03] border-gray-200 dark:border-gray-900 rounded-lg p-6 shadow-sm relative">

            <div className='flex justify-between items-center mb-6'>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Medicine Details</h2>
              <Button className='float-right'> <Link to={userRole==='admin' ? `/medicine/inventory/${selectedItem._id}/add-update`:`/medicine/inventory/${selectedItem._id}/add`}>Add new stock</Link> </Button>
            </div>

            {/* Medicine Details */}
            <div className="w-full mb-8 text-gray-700  max-h-[calc(100vh-300px)] overflow-y-auto">

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 p-5'>
                {Object.entries(selectedItem)
                  .filter(([key]) => !['createdAt', 'updatedAt', '_id', '__v'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="border p-3 rounded-lg shadow-sm bg-white dark:bg-gray-900">
                      <p className="text-gray-800 font-medium dark:text-white">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </p>
                      <p className="text-gray-600 dark:text-white">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Inventory Details */}
              <br />
              <div className='w-full text-theme-xs leading-tight m-auto '>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Inventory Details</h2>
                {inventoryData.length === 0 ? (
                  <p className="text-gray-500">No inventory details available.</p>
                ) : (
                  <div className='overflow-hidden w-full h-full'>
                    <div className="w-full overflow-x-auto">
                      <Table className="border-collapse">
                        <TableHeader className="sticky top-0 dark:text-white bg-gray-100 dark:bg-gray-800 ">
                          <TableRow>
                            <th className="text-left px-2 text-wrap py-3 font-medium text-gray-500">Batch Number</th>
                            
                            <th className=" text-left px-2 text-wrap py-3 font-medium text-gray-500">Expiry Date</th>
                            <th className=" text-left px-2 text-wrap py-3 font-medium text-gray-500">MRP</th>
                            <th className=" text-left px-2 text-wrap py-3 font-medium text-gray-500">Purchase Price</th>
                            <th className=" text-left px-2 text-wrap py-3 font-medium text-gray-500">Selling Price</th>
                            <th className=" text-left px-2 text-wrap py-3 font-medium text-gray-500">Quantity</th>
                            <th className=" text-left px-2 text-wrap py-3 font-medium text-gray-500">Min Stock Level</th>
                            <th className=" text-left px-2 text-wrap py-3 font-medium text-gray-500">Shelf Location</th>
                            {
                              userRole==="admin"?
                              <th className=" text-left px-2 text-wrap py-3 font-medium text-gray-500">Action</th>:null

                            }
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stockLoader ? (
                            <TableRow>
                              <td className="h-[100px] text-center p-2" colSpan={9}>Loading...</td>
                            </TableRow>
                          ) : inventoryData.map((stock, index) => (
                            <tr key={index} className="hover:bg-gray-200 transition dark:hover:bg-gray-800 dark:text-white">
                              <td className=" p-3">{stock.batchNumber || '-'}</td>
                              
                              <td className=" p-3">
                                {stock.expiryDate ? new Date(stock.expiryDate).toLocaleDateString() : '-'}
                              </td>
                              <td className=" p-3">{stock.mrp}</td>
                              <td className=" p-3">{stock.purchasePrice}</td>
                              <td className=" p-3">{stock.sellingPrice}</td>
                              <td className=" p-3">{stock.quantityInStock}</td>
                              <td className=" p-3">{stock.minimumStockLevel}</td>
                              <td className=" p-3">{stock.shelfLocation || '-'}</td>
                              {
                                userRole==="admin"?
                                <td className="cursor-pointer p-3"><div onClick={()=>{
                                  navigate(`/medicine/inventory/${selectedItem._id}/add-update?batchNumber=${stock.batchNumber}&expiryDate=${stock.expiryDate}`,{
                                   replace:true
                                  })
                                }} ><PencilIcon/></div> </td>:null
                              }
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
