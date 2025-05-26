import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { FileUploader } from "react-drag-drop-files";
import { PencilIcon, TrashBinIcon } from '../../icons';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import Button from '../../components/ui/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table/index';
import { Medicine } from '../../helpers/interfaces';
import { toast } from 'react-toastify';
import { clearMedicineMessage } from '../../features/medicine/medicine.slice';
import { bulkUploadInventory } from '../../features/file-upload/fileUploadThunk';
import Label from '../../components/form/Label';
import { Modal } from '../../components/ui/modal';
import DropzoneComponent from '../../components/form/form-elements/DropZone';

export default function MedicineList() {
  const { medicines, loading, error, message } = useSelector((state: RootState) => state.medicine);
  const { loading: fileUploadLoading, error: fileUploadError } = useSelector((state: RootState) => state.uploadFile);
  const [searchParams] = useSearchParams();
  const [filteredData, setFilteredData] = useState<Medicine[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()


  useEffect(() => {
    const q = searchParams.get('q');
    if (!q) {
      setFilteredData(medicines);
    } else {
      setFilteredData(
        medicines.filter((item) => item.name.toLowerCase().includes(q.toLowerCase()))
      );
    }
  }, [searchParams, medicines]);



  useEffect(() => {
    if (error) toast.error(message);
    return () => {
      dispatch(clearMedicineMessage());
    };
  }, [error, message]);
  useEffect(() => {
    if (error) toast.error(message);
    return () => {
      dispatch(clearMedicineMessage());
    };
  }, [error, message]);

  const handleSubmit = async () => {
    if (!file) return toast.warning('Please select a file first');

    const formData = new FormData();
    formData.append('file', file);

    const result = await dispatch(bulkUploadInventory(formData));
    if (bulkUploadInventory.fulfilled.match(result)) {
      const { resultTable, resultFile } = result.payload;
      if (resultTable && resultFile) {

        navigate("/file-upload/response", {
          state: { resultTable, resultFile },
        });
      }
    }
    setShowModal(false);
    setFile(null);
  };

  if (loading || fileUploadLoading) return <LoadingOverlay isLoading={true} />;
  if (error || fileUploadError) return <p>Error: {fileUploadError || error}</p>;

  if (medicines.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col">
        <div className="p-8 text-center text-gray-500 text-lg">No medicine history available.</div>
        <Button>
          <Link to="/medicine/items/add">Add Medicine</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
        <div className="w-full p-4 flex justify-between items-center">
          <div className="text-3xl font-medium">Medicine List</div>
          <div className="flex gap-2">
            <Button>
              <Link to="/medicine/items/add">Add Medicine</Link>
            </Button>
            <Button onClick={() => setShowModal(true)}>{fileUploadLoading ? "wait..." : "Bulk Upload"}</Button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table className="w-full text-left border-collapse">
            <TableHeader className="bg-gray-100 dark:bg-gray-800">
              <TableRow>
                {['Medicine ID', 'Name', 'Generic Name', 'Form', 'Strength'].map((header) => (
                  <th key={header} className="px-5 py-3 font-medium text-gray-500">
                    {header}
                  </th>
                ))}
                <th className="px-5 py-3 font-medium text-gray-500">Action</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((medicine: Medicine) => (
                <TableRow
                  key={medicine._id}
                  className="border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                    {medicine.medicineCode ?? "NA"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                    <p title={medicine.name} className="whitespace-nowrap max-w-[250px] text-ellipsis overflow-hidden">
                      {medicine.name ?? "NA"}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                    {medicine.genericName ? medicine.genericName : "NA"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                    {medicine.form === "" ? "NA" : medicine.form}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                    {medicine.strength === "" ? "NA" : medicine.strength}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-around items-center">
                      <Link to={`/medicine/items/${medicine._id}/edit`}>
                        <PencilIcon className="dark:text-white" />
                      </Link>
                      <Link to="#">
                        <TrashBinIcon className="dark:text-white" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      <Modal className="!w-1/2 !max-w-2xl m-auto rounded-xl shadow-lg" isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Medicine Inventory</h2>

          {/* Drag & Drop Uploader */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all duration-300">
            <DropzoneComponent
              accept={{
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
              }}
              multiple={false}
              onDrop={(files) => {
                setFile(files[0] || null)
                console.log("Only one XLSX file allowed:", files[0]);
              }}
            />
            <p className="text-sm text-gray-500 mt-2">Drag & drop or browse to upload Excel file</p>
          </div>

          {file && (
            <p className="text-sm text-gray-600">
              Selected file: <strong className="text-blue-700">{file.name}</strong>
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 mt-4">
            <div>
              <a download={true} href="./sample/bulk-medicine-upload-sample.xlsx">download sample</a>
            </div>
            <div>
              <Button
                variant="outline"
                className="px-4 py-2 border-gray-300 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={fileUploadLoading}
                onClick={handleSubmit}
              >
                {fileUploadLoading ? "Uploading..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

    </>
  );
}
