import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { getAllMedicines } from '../../features/medicine/medicineApi';



interface Medicine {
  medicineId: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  form: string;
  strength: string;
  unit: string;
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string;
  mrp: number;
  purchasePrice: number;
  sellingPrice: number;
  quantityInStock: number;
  minimumStockLevel: number;
  shelfLocation: string;
  prescriptionRequired: boolean;
  notes?: string;
  status: string;
}

export default function MedicineTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicine);

  useEffect(() => {
    dispatch(getAllMedicines());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              {['Medicine ID', 'Name', 'Generic Name', 'Category', 'Form', 'Strength', 'Status'].map((header) => (
                <th key={header} className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {medicines?.map((medicine: Medicine) => (
              <tr key={medicine.medicineId}>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.medicineId}</td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.name}</td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.genericName}</td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.category}</td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.form}</td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{medicine.strength}</td>
                <td className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    medicine.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>{medicine.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}