import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { updateMedicineById } from '../../features/medicine/medicineApi';
import Label from '../../components/form/Label';
import { useNavigate, useParams } from 'react-router';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import { DropdownOption, Medicine } from '../../helpers/interfaces';
import { toast } from 'react-toastify';

const UNIT_ENUM = ['pieces', 'boxes', 'bottles', 'packs', 'strips'];

const UpdateMedicineForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { medicines, loading, error,message,success } = useSelector((state: RootState) => state.medicine);
    const { dropdowns, loading: DDLoading } = useSelector((state: RootState) => state.dropDown);
    const { id } = useParams<{ id: string }>();

    const [initialValues, setInitialValues] = useState<Partial<Medicine>>({
        _id: '',
        name: '',
        genericName: '',
        form: '',
        strength: '',
        unit: '',
        prescriptionRequired: false,
    });

    useEffect(() => {
        const medicine = medicines.find((med) => med._id === id);
        if (medicine) {
            setInitialValues({
                _id: medicine._id,
                name: medicine.name,
                genericName: medicine.genericName,
                form: medicine.form,
                strength: medicine.strength,
                unit: medicine.unit,
                prescriptionRequired: medicine.prescriptionRequired,
            });
        }
    }, [id, medicines]);

    const validationSchema = Yup.object().shape({
        _id: Yup.string().required('Medicine ID is required'),
        name: Yup.string().required('Name is required'),
        genericName: Yup.string().required('Generic Name is required'),
        form: Yup.string().required('Form is required'),
        strength: Yup.string().required('Strength is required'),
        unit: Yup.string().required('Unit is required'),
        prescriptionRequired: Yup.boolean(),
    });

    const handleSubmit = async (values: Partial<Medicine>, { setSubmitting }: FormikHelpers<Partial<Medicine>>) => {
        try {
            await dispatch(updateMedicineById({ id: values._id as string, medicineData: values }));
            alert('Medicine updated successfully!');
            navigate(-1);
        } catch (error) {
            console.error('Error updating medicine:', error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (error) {
          toast.error(message);
          // Optionally, clear the error state here if needed
        }
      
        if (success && message) {
          toast.success(message);
          // Optionally, reset success state here if needed
        }
      }, [error, success, message]);


    if (loading) return <LoadingOverlay isLoading={loading} />;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <Formik<Partial<Medicine>> initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
            {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                    <h2 className="text-3xl font-medium mt-3 mb-5">Update Medicine Detail</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.keys(initialValues)
                            .filter((key) => !['_id', 'createdAt', 'updatedAt', '__v', 'totalQuantity', 'batchNumber'].includes(key))
                            .map((key) => {
                                // const required = isFieldRequired(key as keyof typeof initialValues);

                                return (
                                    <div key={key} className="mb-4">
                                        <Label>
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                            {true && <span className="text-red-500">*</span>}
                                        </Label>

                                        {/* Conditional Field Rendering */}
                                        {key === 'prescriptionRequired' ? (
                                            <Label className="flex items-center cursor-pointer">
                                                <Field name={key} type="checkbox">
                                                    {({ field }: FieldProps) => (
                                                        <div className="relative">
                                                            <input {...field} type="checkbox" className="hidden" />
                                                            <span className="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition duration-300">
                                                                <span
                                                                    className={`${
                                                                        field.value ? 'translate-x-6' : 'translate-x-0'
                                                                    } bg-white w-4 h-4 rounded-full shadow-md transform duration-300`}
                                                                />
                                                            </span>
                                                        </div>
                                                    )}
                                                </Field>
                                            </Label>
                                        ) : key === 'form' || key === 'strength' ? (
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
                                            <Select
                        options={UNIT_ENUM.map((unit) => ({
                          label: unit.charAt(0).toUpperCase() + unit.slice(1),
                          value: unit,
                        }))}
                        name={key}
                        isLoading={DDLoading}
                        value={
                          UNIT_ENUM.find((unit) => unit === values[key]) ? {
                            label: (values[key] ?? '').charAt(0).toUpperCase() + (values[key] ?? '').slice(1),
                            value: values[key],
                          } : null
                        }
                        onChange={(selectedOption) =>
                          setFieldValue(key, selectedOption ? selectedOption.value : '')
                        }
                        className="react-select-container dark:bg-transparent"
                        classNamePrefix="react-select"
                        placeholder={`Select ${key}`}/>
                                            
                                        ) : (
                                            <Field
                                                disabled={key === 'medicineCode'}
                                                name={key}
                                                className={`h-9 w-full appearance-none rounded-md border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                                                    key === 'medicineCode' ? 'bg-blue-200' : 'bg-white'
                                                } text-gray-400 dark:text-gray-400`}
                                            />
                                        )}

                                        <ErrorMessage name={key} component="div" className="text-red-500 text-sm" />
                                    </div>
                                );
                            })}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                        {isSubmitting ? 'Updating...' : 'Update Medicine'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default UpdateMedicineForm;
