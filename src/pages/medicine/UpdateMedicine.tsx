import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { updateMedicineById } from '../../features/medicine/medicineApi';
import Label from '../../components/form/Label';
import { useNavigate, useParams } from 'react-router';
import { ChevronDownIcon } from '../../icons';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import { Medicine } from '../../helpers/interfaces';

const FORM_ENUM = ['tablet', 'capsule', 'syrup', 'injection', 'ointment'];
const STRENGTH_ENUM = ['100 mg', '250 mg', '500 mg', '1 g', '2 g'];
const UNIT_ENUM = ['pieces', 'boxes', 'bottles', 'packs', 'strips'];
const STATUS_ENUM = ['active', 'inactive'];



const UpdateMedicineForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const { medicines, loading, error } = useSelector((state: RootState) => state.medicine);
    const { id } = useParams<{ id: string }>();

    const [initialValues, setInitialValues] = useState<Partial<Medicine>>({
        _id: '',
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
    });

    // Load data into initialValues
    useEffect(() => {
        const medicine = medicines.find((med) => med._id === id);
        if (medicine) {
            setInitialValues({ ...medicine });
        }
    }, [id, medicines]);

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        _id: Yup.string().required('Medicine ID is required'),
        name: Yup.string().required('Name is required'),
        genericName: Yup.string().required('Generic Name is required'),
        manufacturer: Yup.string().required('Manufacturer is required'),
        category: Yup.string().required('Category is required'),
        form: Yup.string().required('Form is required'),
        strength: Yup.string().required('Strength is required'),
        unit: Yup.string().required('Unit is required'),
        prescriptionRequired: Yup.boolean(),
        status: Yup.string().oneOf(STATUS_ENUM).required('Status is required'),
    });

    // Submit Handler
    const handleSubmit = async (values: Partial<Medicine>, { setSubmitting }: FormikHelpers<Partial<Medicine>>) => {
        try {
            await dispatch(updateMedicineById({ id: values._id as string, medicineData: values }));
            alert('Medicine updated successfully!');
            navigate(-1)
        } catch (error) {
            console.error('Error updating medicine:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Show Loader or Error
    if (loading) return <LoadingOverlay isLoading={loading} />;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <Formik<Partial<Medicine>> initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
            {({ isSubmitting }) => (
                <Form>
                    <h2 className='text-3xl font-medium mt-3 mb-5'>Update Medicine Detail</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        {Object.keys(initialValues)
                            .filter((key) => !['_id', 'createdAt', 'updatedAt', '__v'].includes(key))
                            .map((key) => (
                                <div key={key} className="mb-4">
                                    <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</Label>

                                    {/* Conditional Field Rendering */}
                                    {key === 'prescriptionRequired' ? (
                                        <Label className="flex items-center cursor-pointer">
                                            <Field name={key} type="checkbox">
                                                {({ field }: FieldProps) => (
                                                    <div className="relative">
                                                        <input {...field} type="checkbox" className="hidden" />
                                                        <span className="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition duration-300">
                                                            <span
                                                                className={`${field.value ? 'translate-x-6' : 'translate-x-0'
                                                                    } bg-white w-4 h-4 rounded-full shadow-md transform duration-300`}
                                                            />
                                                        </span>
                                                    </div>
                                                )}
                                            </Field>
                                        </Label>
                                    ) : ['status', 'form', 'strength', 'unit'].includes(key) ? (
                                        <div className="relative w-full">
                                            <Field
                                                as="select"
                                                name={key}
                                                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                            >
                                                <option value="">Select {key}</option>
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

                                    ) : (
                                        <Field disabled={key === "medicineCode"} name={key} className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${"text-gray-400 dark:text-gray-400"
                                            }`} />
                                    )}

                                    <ErrorMessage name={key} component="div" className="text-red-500 text-sm" />
                                </div>
                            ))}
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
