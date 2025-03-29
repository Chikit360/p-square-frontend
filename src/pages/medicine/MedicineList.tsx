import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';

import { PencilIcon, TrashBinIcon } from '../../icons';
import { Modal } from '../../components/ui/modal';
import LoadingOverlay from '../../components/loader/LoadingOverlay';

import Button from '../../components/ui/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import { Link } from 'react-router';




interface Medicine {
  medicineId: string;
  _id: string;
  medicineCode: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  form: string;
  strength: string;
  unit: string;
  prescriptionRequired: boolean;
  notes?: string;
  status: string;
}

export default function MedicineTable() {
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicine);

  if (loading) return <LoadingOverlay isLoading={loading} />;
  if (error) return <p>Error: {error}</p>;
  if (medicines.length === 0) {
    return <div className='flex justify-center items-center flex-col' ><div className="p-8 text-center text-gray-500 text-lg">No medicine history available.</div><Button > <Link to={"/medicine/items/add"}>Add Medicine</Link> </Button></div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900">
      <div className='w-full p-4 flex justify-between items-center'>
      <div></div>
      <Button> <Link to={"/medicine/items/add"}>Add Medicine</Link> </Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow>
              {['Medicine ID', 'Name', 'Generic Name', 'Category', 'Form', 'Strength', 'Status'].map((header) => (
                <th key={header} className="px-5 py-3 font-medium text-gray-500">{header}</th>
              ))}
              <th>Action</th>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines?.map((medicine: Medicine) => (
              <TableRow key={medicine.medicineId}>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.medicineCode}</TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.name}</TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.genericName}</TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.category}</TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.form}</TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.strength}</TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    medicine.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>{medicine.status}</span>
                </TableCell>
                <TableCell className='flex gap-2 justify-center items-center'>
                <Link to={`/medicine/item/${medicine._id}/edit`} 
               
                
                >
                  <PencilIcon className='dark:text-white' />
                </Link>
                <Link to={`/medicine/item/${medicine.medicineId}/delete`}>
                <TrashBinIcon className='dark:text-white' />
                </Link>

                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}


