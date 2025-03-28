import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { getAllMedicines, updateMedicineById } from '../../features/medicine/medicineApi';
import { PencilIcon, TrashBinIcon } from '../../icons';
import { Modal } from '../../components/ui/modal';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface Medicine {
  medicineId: string;
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
  const dispatch = useDispatch<AppDispatch>();
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicine);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dataForUpdate, setDataForUpdate] = useState<Partial<Medicine> | null>(null);

  useEffect(() => {
    dispatch(getAllMedicines());
  }, [dispatch]);

  if (loading) return <LoadingOverlay isLoading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {['Medicine ID', 'Name', 'Generic Name', 'Category', 'Form', 'Strength', 'Status'].map((header) => (
                <th key={header} className="px-5 py-3 font-medium text-gray-500">{header}</th>
              ))}
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
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
                <td onClick={() => {
                  setIsOpenModal(true);
                  setDataForUpdate({
                    medicineId: medicine.medicineId,
                    name: medicine.name,
                    genericName: medicine.genericName,
                    manufacturer: medicine.manufacturer,
                    category: medicine.category,
                    form: medicine.form,
                    strength: medicine.strength,
                    unit: medicine.unit,
                    prescriptionRequired: medicine.prescriptionRequired,
                    notes: medicine.notes,
                    status: medicine.status,
                  });
                }}>
                  <PencilIcon />
                </td>
                <td><TrashBinIcon /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpenModal && (
        <Modal className='m-5 py-7 px-5' isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
          <UpdateMedicineForm data={dataForUpdate} onClose={() => setIsOpenModal(false)} />
        </Modal>
      )}
    </div>
  );
}

const UpdateMedicineForm = ({ data, onClose }: { data: Partial<Medicine> | null; onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues = data || {
    medicineId: '',
    name: '',
    genericName: '',
    manufacturer: '',
    category: '',
    form: '',
    strength: '',
    unit: '',
    prescriptionRequired: false,
    notes: '',
    status: 'active',
  };

  const validationSchema = Yup.object().shape({
    medicineId: Yup.string().required('ID is required'),
    name: Yup.string().required('Name is required'),
    genericName: Yup.string().required('Generic Name is required'),
    manufacturer: Yup.string().required('Manufacturer is required'),
    category: Yup.string().required('Category is required'),
    form: Yup.string().required('Form is required'),
    strength: Yup.string().required('Strength is required'),
    unit: Yup.string().required('Unit is required'),
    prescriptionRequired: Yup.boolean(),
    status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  });

  const handleSubmit = async (values: Partial<Medicine>, { setSubmitting }: FormikHelpers<Partial<Medicine>>) => {
    try {
      console.log('Submitting values:', values);
      if(values.medicineId){
        await dispatch(updateMedicineById({id: values.medicineId||'',medicineData:values}));
        alert('Medicine updated successfully!');
        onClose();

      }else{
        alert('Medicine ID is required!');
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(initialValues).map(([key, value]) => (
              
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-medium">{key}</label>
                {
                  key==="prescriptionRequired" ?  <label className="flex items-center cursor-pointer">
                  <Field name={key}>
                    {({ field }: FieldProps) => (
                      <div className="relative">
                        <input
                          {...field}
                          type="checkbox"
                          className="hidden"
                          id={key}
                        />
                        <span className="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition duration-300">
                          <span
                            className={`${
                              field.value ? "translate-x-6" : "translate-x-0"
                            } bg-white w-4 h-4 rounded-full shadow-md transform duration-300`}
                          />
                        </span>
                      </div>
                    )}
                  </Field>
                </label> :
                <Field name={key} className="w-full p-2 border rounded" />
              }
              <ErrorMessage name={key} component="div" className="text-red-500 text-sm" />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            {isSubmitting ? 'Updating...' : 'Update Medicine'}
          </button>
        </Form>
      )}
    </Formik>
  );
};
