import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchCustomerPurchaseHistory } from '../../features/customer/customerApi';
import { useParams } from 'react-router';

const CustomerHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const [activeInvoice, setActiveInvoice] = useState("")
  const { purchaseHistory, loading, error } = useSelector(
    (state: RootState) => state.customers
  );
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerPurchaseHistory(id));
    }
  }, [dispatch, id]);

  const handleInvoiceClick = (invoice: any) => {
    setActiveInvoice(invoice.invoiceId)
    setSelectedInvoice(invoice);
  };

  const renderInvoiceTableRows = () => {
    return purchaseHistory?.invoices.map((invoice: any) => (
      <tr
        key={invoice.invoiceId}
        className={`${activeInvoice===invoice.invoiceId ? "bg-gray-200":""} "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"`}
        onClick={() => handleInvoiceClick(invoice)}
      >
        <td className='text-center p-2'>{invoice.invoiceId}</td>
        <td className='text-center p-2'>{invoice.items.length}</td>
        <td className='text-center p-2'>{invoice.totalAmount.toFixed(2)}</td>
        <td className='text-center p-2'>{invoice.createdAt.split("T")[0]}</td>
      </tr>
    ));
  };

  const renderMedicineTable = () => {
    if (!selectedInvoice) return null;

    return (
      <div className='overflow-scroll'>
        <table className="w-full mt-3 border-collapse ">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="p-2">Medicine</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Price</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedInvoice.items?.map((item: any, index: number) => (
            <tr key={index}  className="hover:bg-gray-200 dark:hover:bg-gray-700">
              <td className="p-2 text-center">{item.medicineId.name}</td>
              <td className="p-2 text-center">{item.quantity}</td>
              <td className="p-2 text-center">{item.price}</td>
              <td className="p-2 text-center">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    );
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50 dark:bg-gray-900 text-sm md:text-base">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start h-full">
        {/* Left Top: Customer Details */}
        <div className="w-full md:w-1/2 bg-white dark:bg-white/[0.03] shadow-md rounded-lg p-5">
          <h3 className="text-xl font-semibold mb-3">Customer Details</h3>
          <p className="mb-2">
            <strong>Name:</strong> {purchaseHistory?.customer?.name}
          </p>
          <p className="mb-2">
            <strong>Mobile:</strong> {purchaseHistory?.customer?.mobile}
          </p>
        </div>

        {/* Right Top: Invoice Table (Scrollable) */}
        <div className="w-full md:w-1/2 bg-white dark:bg-white/[0.03] shadow-md rounded-lg p-5">
          <h3 className="text-xl font-semibold mb-3">Invoices</h3>
          <div className="overflow-y-auto max-h-72">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-2">Invoice ID</th>
                  <th className="p-2">Items Count</th>
                  <th className="p-2">Total Amount</th>
                  <th className="p-2">Purchase Date</th>
                </tr>
              </thead>
              <tbody>{renderInvoiceTableRows()}</tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom: Medicine Table */}
      <div className="w-full bg-white dark:bg-white/[0.03] rounded-lg p-5 mt-5">
        <h3 className="text-xl font-semibold mb-3">Medicine Details</h3>
        {renderMedicineTable()}
      </div>
    </div>
  );
};

export default CustomerHistory;
