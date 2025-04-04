import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AppDispatch, RootState } from "../../features/store";
import { addDropdownOption, deleteDropdownOption, updateDropdownOption } from "../../features/dropDown/dropDownApi";
import ConfirmationPopup from "../../components/ui/pop-up/ConfirmationPopUp";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useSearchParams } from "react-router";

const StrengthDropDown = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dropdowns, loading } = useSelector((state: RootState) => state.dropDown);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  
  const [confrmBox, setConfrmBox] = useState(false);  // Confirmation popup state
  const [deleteItem, setDeleteItem] = useState<any | null>(null);  // Store item to be deleted
  const [editId, setEditId] = useState<string | null>("");

  useEffect(() => {
    const q = searchParams.get('q');
    console.log(q);

    if (!q) {
      setFilteredData(dropdowns["strength"]);
    } else {
      setFilteredData(dropdowns['strength'].filter(item => item.label.toLowerCase().includes(q?.toLowerCase() || '')));
    }
  }, [searchParams, dropdowns]);

  const formik = useFormik({
    initialValues: {
      label: "",
      value: "",
      status: "active",
    },
    validationSchema: Yup.object({
      label: Yup.string().required("Label is required"),
      value: Yup.string().required("Value is required"),
      status: Yup.string().oneOf(["active", "inactive"], "Invalid status"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (editId) {
        dispatch(updateDropdownOption({_id: editId, inputFieldName: "strength", ...values}));
        setEditId(null);
      } else {
        dispatch(addDropdownOption({ inputFieldName: "strength", ...values }));
      }
      resetForm();
      setIsModalOpen(false);
    },
  });

  const handleEdit = (option: any) => {
    setEditId(option._id);
    formik.setValues(option);
    setIsModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setDeleteItem(item);  // Store the item to be deleted
    setConfrmBox(true);  // Open confirmation popup
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Strength Options</h2>
        <button
          onClick={() => {
            formik.resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Add Strength Option
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Label</th>
              <th className="border px-4 py-2">Value</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item: any) => (
              <tr key={item._id} className="text-center">
                <td className="border px-4 py-2">{item.label}</td>
                <td className="border px-4 py-2">{item.value}</td>
                <td className="border px-4 py-2">{item.status}</td>
                <td className="border px-4 py-2 flex">
                  <span onClick={() => handleEdit(item)} className="text-blue-600 mr-2">
                    <PencilIcon />
                  </span>
                  <span className="text-blue-600 mr-2">
                    <TrashBinIcon
                      className="text-red-500"
                      onClick={() => handleDelete(item)}  // Pass item to delete
                    />
                    <ConfirmationPopup
                      isOpen={confrmBox}
                      message="Do you want to delete?"
                      title="Delete Strength Option"
                      onCancel={() => setConfrmBox(false)}
                      onConfirm={async () => {
                        if (deleteItem) {
                          await dispatch(deleteDropdownOption(deleteItem)); // Delete correct item
                          setConfrmBox(false);
                          setDeleteItem(null);  // Reset delete item after action
                        }
                      }}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 dark:border p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">{editId ? "Edit Strength Option" : "Add Strength Option"}</h3>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label className="block font-medium">Label</label>
                <input
                  type="text"
                  name="label"
                  value={formik.values.label}
                  onChange={formik.handleChange}
                  className="border px-3 py-2 w-full rounded"
                />
                {formik.touched.label && formik.errors.label && (
                  <p className="text-red-500 text-sm">{formik.errors.label}</p>
                )}
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <label className="block font-medium">Value</label>
                  <span className="flex justify-center items-center gap-1">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          formik.setFieldValue("value", formik.getFieldProps('label').value);
                        } else {
                          formik.setFieldValue("value", '');
                        }
                      }}
                    />
                    <label htmlFor="">same as label</label>
                  </span>
                </div>
                <input
                  type="text"
                  name="value"
                  value={formik.values.value}
                  onChange={formik.handleChange}
                  className="border px-3 py-2 w-full rounded"
                />
                {formik.touched.value && formik.errors.value && (
                  <p className="text-red-500 text-sm">{formik.errors.value}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block font-medium">Status</label>
                <select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  className="border px-3 py-2 w-full rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrengthDropDown;
