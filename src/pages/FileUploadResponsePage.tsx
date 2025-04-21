import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const FileUploadResponsePage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
  
    const [resultTable, setResultTable] = useState<any[] | null>(null);
    const [resultFile, setResultFile] = useState<string | null>(null);
  
    useEffect(() => {
      if (state?.resultTable && state?.resultFile) {
        setResultTable(state.resultTable);
        setResultFile(state.resultFile);
      } else {
        // Optional: You can navigate back or show error
        console.warn("Missing upload result data, navigating back...");
        // navigate(-1);
      }
    }, [state, navigate]);
  

  if (!resultTable || !resultFile) {
    return <div className="p-6">Loading...</div>;
  }
  
  return (
    <div className="p-6 w-full mx-auto max-w-(--breakpoint-lg)">
      <h2 className="text-2xl font-semibold mb-4">Upload Result</h2>
  
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-xs divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(resultTable[0]).map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-600"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resultTable.map((row: any, idx: number) => (
              <tr key={idx} className="hover:bg-gray-50">
                {Object.values(row).map((value: any, i: number) => (
                  <td
                    key={i}
                    className={`px-4 py-2 text-sm ${
                      String(value).toLowerCase().includes("failed")
                        ? "text-red-600"
                        : String(value).toLowerCase().includes("updated")
                        ? "text-yellow-600"
                        : String(value).toLowerCase().includes("created")
                        ? "text-green-600"
                        : "text-gray-700"
                    }`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          const byteCharacters = atob(resultFile);
          const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
  
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "upload_result.xlsx");
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
        }}
      >
        Download Result XLSX
      </button>
      <div className="mt-8 border-t pt-4 text-sm text-gray-700">
        <h3 className="font-semibold mb-2">Status Explanation:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="text-green-600 font-medium">Created new inventory</span> — A new inventory record was added successfully.
          </li>
          <li>
            <span className="text-yellow-600 font-medium">Updated inventory</span> — Existing inventory was found and updated.
          </li>
          <li>
            <span className="text-red-600 font-medium">Failed: ...</span> — Something went wrong (like invalid data, missing fields, or save errors).
          </li>
        </ul>
      </div>

    </div>
  );
  
};

export default FileUploadResponsePage;
