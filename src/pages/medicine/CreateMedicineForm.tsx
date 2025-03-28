import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { faker } from '@faker-js/faker';
import { createMedicine } from '../../features/medicine/medicineApi';
import LoadingOverlay from '../../components/loader/LoadingOverlay';

const FORM_ENUM = ['tablet', 'capsule', 'syrup', 'injection', 'ointment'];
const STRENGTH_ENUM = ['100 mg', '250 mg', '500 mg', '1 g', '2 g'];
const UNIT_ENUM = ['pieces', 'boxes', 'bottles', 'packs', 'strips'];
const STATUS_ENUM = ['active', 'inactive'];
const generateMedicineId = () => `MED${Math.floor(10000 + Math.random() * 90000)}`;

// Initially empty form
const initialValues = {
  medicineCode:'',
  name: '',
  genericName: '',
  manufacturer: '',
  category: '',
  form: '',
  strength: '',
  unit: '',
  batchNumber: '',
  manufactureDate: '',
  expiryDate: '',
  mrp: 0,
  purchasePrice: 0,
  sellingPrice: 0,
  quantityInStock: 0,
  minimumStockLevel: 0,
  shelfLocation: '',
  prescriptionRequired: false,
  notes: '',
  status: 'active',
};

// Generate fake data using faker
const generateFakeData = () => ({
  medicineCode:generateMedicineId(),
  name: faker.commerce.productName(),
  genericName: faker.lorem.word(),
  manufacturer: faker.company.name(),
  category: faker.commerce.department(),
  form: faker.helpers.arrayElement(FORM_ENUM),
  strength: faker.helpers.arrayElement(STRENGTH_ENUM),
  unit: faker.helpers.arrayElement(UNIT_ENUM),
  batchNumber: faker.string.alphanumeric(10),
  manufactureDate: faker.date.past().toISOString().split('T')[0],
  expiryDate: faker.date.future().toISOString().split('T')[0],
  mrp: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
  purchasePrice: parseFloat(faker.commerce.price({ min: 5, max: 400 })),
  sellingPrice: parseFloat(faker.commerce.price({ min: 8, max: 450 })),
  quantityInStock: faker.number.int({ min: 10, max: 1000 }),
  minimumStockLevel: faker.number.int({ min: 5, max: 50 }),
  shelfLocation: `Shelf-${faker.number.int({ min: 1, max: 50 })}`,
  prescriptionRequired: faker.datatype.boolean(),
  notes: faker.lorem.sentence(),
  status: faker.helpers.arrayElement(STATUS_ENUM),
});

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Medicine name is required'),
  genericName: Yup.string().required('Generic name is required'),
  manufacturer: Yup.string().required('Manufacturer is required'),
  category: Yup.string().required('Category is required'),
  form: Yup.string().oneOf(FORM_ENUM, 'Invalid form').required('Form is required'),
  strength: Yup.string().oneOf(STRENGTH_ENUM, 'Invalid strength').required('Strength is required'),
  unit: Yup.string().oneOf(UNIT_ENUM, 'Invalid unit').required('Unit is required'),
  batchNumber: Yup.string().required('Batch number is required'),
  manufactureDate: Yup.date().required('Manufacture date is required'),
  expiryDate: Yup.date().required('Expiry date is required'),
  mrp: Yup.number().positive().required('MRP is required'),
  purchasePrice: Yup.number().positive().required('Purchase price is required'),
  sellingPrice: Yup.number().positive().required('Selling price is required'),
  quantityInStock: Yup.number().min(0).required('Stock quantity is required'),
  minimumStockLevel: Yup.number().min(0).required('Minimum stock level is required'),
  shelfLocation: Yup.string().required('Shelf location is required'),
  prescriptionRequired: Yup.boolean(),
});

const CreateMedicineForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.medicine);

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    console.log(values)
    await dispatch(createMedicine(values));
    alert('Medicine added successfully!');
    resetForm();
  };

  return (
    <>
    
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add Medicine to Stock</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setValues }) => (
          <Form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(initialValues).map((key) => (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  {key === 'manufactureDate' || key === 'expiryDate' ? (
                    <Field type="date" name={key} className="w-full p-2 border rounded" />
                  ) : key === 'prescriptionRequired' ? (
                    <label className="flex items-center cursor-pointer">
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
                    </label>
                  ) : key === 'status' ? (
                    <Field as="select" name={key} className="w-full p-2 border rounded">
                      {STATUS_ENUM.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Field>
                  ) : (
                    <Field name={key} className="w-full p-2 border rounded" />
                  )}
                  <ErrorMessage name={key} component="div" className="text-red-500 text-sm" />
                </div>
              ))}
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                {isSubmitting || loading ? 'Submitting...' : 'Create Medicine'}
              </button>
              <button
                type="button"
                onClick={() => setValues(generateFakeData())}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Generate Fake Data
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    <LoadingOverlay isLoading={loading} />
    </>
  );
};

export default CreateMedicineForm;
