import { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';
import {  RootState } from '../../features/store';

import { PencilIcon, TrashBinIcon } from '../../icons';
import LoadingOverlay from '../../components/loader/LoadingOverlay';

import Button from '../../components/ui/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table/index';
import { Link, useSearchParams } from 'react-router';
import { Medicine } from '../../helpers/interfaces';


export default function MedicineList() {
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicine);
  const [searchParams]=useSearchParams();
  const [filteredData, setFilteredData] = useState<Medicine[]>([])

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
  if (error) return <p>Error: {error}</p>;
  if (medicines?.length === 0) {
    return <div className='flex justify-center items-center flex-col' ><div className="p-8 text-center text-gray-500 text-lg">No medicine history available.</div><Button > <Link to={"/medicine/items/add"}>Add Medicine</Link> </Button></div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
      <div className='w-full p-4 flex justify-between items-center'>
      <div className='text-3xl font-medium'>Medicine List</div>
      <Button> <Link to={"/medicine/items/add"}>Add Medicine</Link> </Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full text-left border-collapse">
          <TableHeader className='bg-gray-100 dark:bg-gray-800'>
            <TableRow>
              {['Medicine ID', 'Name', 'Generic Name',  'Form', 'Strength',].map((header) => (
                <th key={header} className="px-5 py-3 font-medium text-gray-500">{header}</th>
              ))}
              <th className='px-5 py-3 font-medium text-gray-500'>Action</th>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.map((medicine: Medicine) => (
              <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 ' key={medicine._id}>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.medicineCode}</TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300" ><p title={medicine.name} className='whitespace-nowrap max-w-[100px] text-ellipsis overflow-hidden'>{medicine.name}</p></TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.genericName}</TableCell>
                {/* <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.category}</TableCell> */}
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.form}</TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.strength}</TableCell>
                {/* <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    medicine.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>{medicine.status}</span>
                </TableCell> */}
                <TableCell className=''>
                  <div className='w-full h-full flex gap-2 justify-around items-center'>

                <Link to={`/medicine/items/${medicine._id}/edit`} 
               
                
                >
                  <PencilIcon className='dark:text-white' />
                </Link>
                {/* <Link to={`/medicine/item/${medicine._id}/delete`}> */}
                <Link to="#">
                <TrashBinIcon className='dark:text-white' />
                </Link>
                  </div>

                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}


