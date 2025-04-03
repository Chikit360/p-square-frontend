import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { faker } from '@faker-js/faker';
import { createMedicine } from '../../features/medicine/medicineApi';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import ConfirmationPopup from '../../components/ui/pop-up/ConfirmationPopUp';
import Label from '../../components/form/Label';
import { DropdownOption } from '../../helpers/interfaces';

const UNIT_ENUM = ['pieces', 'boxes', 'bottles', 'packs', 'strips'];

const initialValues = {
  name: '',
  genericName: '',
  form: '',
  strength: '',
  unit: '',
  prescriptionRequired: false,
};





const validationSchema = Yup.object().shape({
  name: Yup.string().required('Medicine name is required'),
  genericName: Yup.string().required('Generic name is required'),
  form: Yup.string().required('Form is required'),
  strength: Yup.string().required('Strength is required'),
  unit: Yup.string().oneOf(UNIT_ENUM, 'Invalid unit').required('Unit is required'),
  prescriptionRequired: Yup.boolean(),
});

const CreateMedicineForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { recentCreatedMedicineId } = useSelector((state: RootState) => state.medicine);
  const { dropdowns, loading: DDLoading } = useSelector((state: RootState) => state.dropDown);
  const { loading } = useSelector((state: RootState) => state.medicine);
  const [openConfirmationBox, setOpenConfirmationBox] = useState<boolean>(false);

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    
    await dispatch(createMedicine(values));
    setOpenConfirmationBox(true);
    resetForm();
  };

  const generateFakeData = () => ({
    name: faker.commerce.productName(),
    genericName: faker.lorem.word(),
    form: dropdowns.form.length
      ? faker.helpers.arrayElement(dropdowns.form).value
      : '',
    strength: dropdowns.strength.length
      ? faker.helpers.arrayElement(dropdowns.strength).value
      : '',
    unit: faker.helpers.arrayElement(UNIT_ENUM),
    prescriptionRequired: faker.datatype.boolean(),
  });
  

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Add Medicine</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setValues, values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(initialValues).map((key) => (
                  <div key={key} className="mb-4">
                    <Label>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}{<span className='text-red-400' >*</span>}
                    </Label>

                    {/* React-Select for Form & Strength */}
                    {key === 'form' || key === 'strength' ? (
                      <Select
                      options={dropdowns[key]?.map((item: DropdownOption) => ({
                     label: item.label,
                     value: item.value,
                     inputFieldName: item.inputFieldName || '',
                     status: item.status || ''
                   })) || [
                     {
                         label: '',
                         value: '',
                         inputFieldName: '',
                         status: ''
                     }
                   ]}
                     isLoading={DDLoading}
                     value={
                         dropdowns[key]?.find((item: DropdownOption) => item.value === values[key]) || null
                     }
                     onChange={(selectedOption) =>
                         setFieldValue(key, selectedOption ? selectedOption.value : '')
                     }
                     className="react-select-container dark:bg-transparent"
                     classNamePrefix="react-select"
                     placeholder={`Select ${key}`}
                 />
                    
                    ) : key === 'unit' ? (
                      <Field
                        as="select"
                        name={key}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">Select unit</option>
                        {UNIT_ENUM.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </Field>
                    ) : key === 'prescriptionRequired' ? (
                      <label className="flex items-center cursor-pointer">
                        <Field type="checkbox" name={key} className="hidden" />
                        <span className="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition duration-300">
                          <span
                            className={`${
                              values[key] ? 'translate-x-6' : 'translate-x-0'
                            } bg-white w-4 h-4 rounded-full shadow-md transform duration-300`}
                          />
                        </span>
                      </label>
                    ) : (
                      <Field
                        name={key}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
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

      <ConfirmationPopup
        title="Alert"
        message="Do you want to add inventory right now?"
        onConfirm={() => navigate(`/medicine/inventory/${recentCreatedMedicineId}/add-update`)}
        onCancel={() => setOpenConfirmationBox(false)}
        isOpen={openConfirmationBox}
      />
    </>
  );
};

export default CreateMedicineForm;
