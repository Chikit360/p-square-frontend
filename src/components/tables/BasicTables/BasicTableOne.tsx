import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import { Link } from "react-router";

interface headingI {
  title: string;
  key: string | null;
}

interface BasicTableOneProps {
  tableData: any[];
  tableHeadings: headingI[];
  actionList: ReactNode[]
}

export default function BasicTableOne({
  tableData,
  tableHeadings,

}: BasicTableOneProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {tableHeadings.map((headingData: headingI) => (
                <TableCell
                  isHeader
                  key={headingData.title} // Add a unique key for each TableCell
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {headingData.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((user, userIndex) => (
              <TableRow key={user._id || userIndex}> {/* Ensure a unique key for each row */}
                {tableHeadings.map((headingData: headingI,) => (
                  <TableCell
                    key={headingData.title} // Add key for each TableCell in the row
                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    {headingData.key === null ? (
                      // Custom content for Action column (for example, a button)
                      <div className="flex justify-start items-center gap-1">
                        <Link to={`/customer-list/${user._id}/purchase-history`}>View History</Link>
                        {/* {actionList.map(actionBtn=>(<button className="text-blue-500 hover:text-blue-700">
                          {actionBtn}
                          </button>))} */}
                      </div>
                    ) : (
                      // Default content for other columns
                      user[headingData.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
