import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { faker } from '@faker-js/faker';
import { createMedicine } from '../../features/medicine/medicineApi';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import { useNavigate } from 'react-router';
import ConfirmationPopup from '../../components/ui/pop-up/ConfirmationPopUp';
import Label from '../../components/form/Label';
import { ChevronDownIcon } from '../../icons';
import Alert from '../../components/ui/Alert/Alert';

const FORM_ENUM = ['tablet', 'capsule', 'syrup', 'injection', 'ointment'];
const STRENGTH_ENUM = ['100 mg', '250 mg', '500 mg', '1 g', '2 g'];
const UNIT_ENUM = ['pieces', 'boxes', 'bottles', 'packs', 'strips'];
const STATUS_ENUM = ['active', 'inactive'];

// Initially empty form
const initialValues = {
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

// Generate fake data using faker
const generateFakeData = () => ({
  name: faker.commerce.productName(),
  genericName: faker.lorem.word(),
  manufacturer: faker.company.name(),
  category: faker.commerce.department(),
  form: faker.helpers.arrayElement(FORM_ENUM),
  strength: faker.helpers.arrayElement(STRENGTH_ENUM),
  unit: faker.helpers.arrayElement(UNIT_ENUM),
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
  prescriptionRequired: Yup.boolean(),
});

const CreateMedicineForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate()
  const [openConfirmationBox, setOpenConfirmationBox] = useState<boolean>(false)
  const { loading,success } = useSelector((state: RootState) => state.medicine);

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    console.log(values)
    await dispatch(createMedicine(values));
    setOpenConfirmationBox(true)
    resetForm();
  };

  

  return (
    <>
    
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add Medicine</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setValues }) => (
          <Form>
             <Alert status={success} variant='success' message='Medicine created' title='Success' />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(initialValues).map((key) => (
                <div key={key} className="mb-4">
                  <Label>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </Label>
                  {key === 'manufactureDate' || key === 'expiryDate' ? (
                    <Field type="date" name={key} className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      "text-gray-400 dark:text-gray-400"
                    }`} />
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
                  ) :['status', 'form', 'strength', 'unit'].includes(key) ? (
                    <div className="relative w-full">
                      {/* Select Field */}
                      <Field
                        as="select"
                        name={key}
                        className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      >
                        <option value="">{`Select ${key}`}</option>
                        {(key === 'status' ? STATUS_ENUM : key === 'form' ? FORM_ENUM : key === 'strength' ? STRENGTH_ENUM : UNIT_ENUM).map(
                          (item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          )
                        )}
                      </Field>
                  
                      {/* Chevron Icon Inside Input */}
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                  ): (
                    <Field name={key} className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                      "text-gray-400 dark:text-gray-400"
                    }`} />
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
                className="bg-gray-500 text-white py-2 px-4 rounded hidden"
              >
                Generate Fake Data
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
   
    <ConfirmationPopup title='Aleart' message='Do you want to add inventory right now' onConfirm={()=>{
      navigate("/medicine/inventory")
    }} onCancel={()=>setOpenConfirmationBox(false)} isOpen={openConfirmationBox} />
    </>
  );
};

export default CreateMedicineForm;
