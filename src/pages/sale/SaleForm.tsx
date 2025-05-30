import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppDispatch, RootState } from '../../features/store';
import { createSale } from '../../features/sale/saleApi';
import { activeMedicines } from '../../features/medicine/medicineApi';
import Select, { components, MenuListProps, MultiValue } from 'react-select'
import Label from '../../components/form/Label';
import { toast } from 'react-toastify';
import { clearSalesMessage } from '../../features/sale/sale.slice';
import LoadingOverlay from '../../components/loader/LoadingOverlay';

interface DiscountTypeOptionIF {
  label: string,
  value: string
}
const discountTypeOptions = [
  {
    label: "Overall Discount",
    value: "overall_discount"
  },
  {
    label: "Manual Discount",
    value: "manual_discount"
  },

]

interface Medicine {
  _id: string;
  name: string;
  // sellingPrice: number;
  mrp: number;
  purchasePrice: number;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
  discount: number;
}

interface SaleData {
  customerName?: string;
  customerContact?: string;
  items: { medicineId: string; name: string; quantity: number }[];
}

const SaleForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeMedicineList, loading, totalPages, } = useSelector((state: RootState) => state.activeMedicines);
  const [discountType, setDiscountType] = useState<DiscountTypeOptionIF | null>(discountTypeOptions[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [_, setSelectedMedicineId] = useState<string>('');
  const [, setIsOpen] = useState(false)
  const [discountAmountFinal, setDiscountAmountFinal] = useState<number>(0);
  const { error, message, success } = useSelector((state: RootState) => state.sales);

  const [page, setPage] = useState(1);
  const [, setPdfBlob] = useState<Blob | null>(null); // Store PDF Blob for preview


  useEffect(() => {
    dispatch(activeMedicines(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (error) {
      toast.error(message);
      // Optionally, clear the error state here if needed
    }

    if (success && message) {
      toast.success(message);
      // Optionally, reset success state here if needed
    }
    return () => {
      dispatch(clearSalesMessage())
    }
  }, [error, success, message]);

  const handleAddToCart = (selectedArray: MultiValue<any> = []): void => {
    // Convert selectedArray to a Set of selected IDs
    const selectedIds = new Set(selectedArray.map(item => item.value));

    setCart((prevCart) => {
      const updatedCart: typeof prevCart = [];

      // Keep only selected items and update quantities if needed
      selectedIds.forEach(id => {
        const medicine = activeMedicineList.find(m => m._id === id);
        if (!medicine) return;

        const existingItem = prevCart.find(item => item.medicine._id === id);
        if (existingItem) {
          updatedCart.push(existingItem); // Keep as-is
        } else {
          updatedCart.push({ discount: 0, medicine, quantity: 1 }); // Add new
        }
      });

      return updatedCart;
    });

    // Optional: Clear local medicine ID tracker if needed
    setSelectedMedicineId('');
  };



  const handleQuantityChange = (id: string, change: number): void => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.medicine._id === id ? { ...item, quantity: Math.max(item.quantity + change, 1) } : item
      )
    );
  };

  // const handleRemove = (id: string): void => {
  //   setCart((prevCart) => prevCart.filter((item) => item.medicine._id !== id));
  // };

  const calculateTotal = (): { subtotal: number; total: number; totalDiscount: number } => {
    const subtotal = cart.reduce((sum, item) => sum + item.medicine.mrp * item.quantity, 0);

    let totalDiscount = 0;

    // If the user selected manual discount, sum up the individual item discounts
    if (discountType?.value === "manual_discount") {
      totalDiscount = cart.reduce((sum, item) => sum + item.discount * 0.01 * item.medicine.mrp, 0);
    } else if (discountType?.value === "overall_discount") {
      // If overall discount, apply it after calculating subtotal
      totalDiscount = discountAmountFinal * 0.01 * subtotal;
    }

    // Ensure the discount doesn't exceed the subtotal
    totalDiscount = Math.min(totalDiscount, subtotal);

    return { subtotal, total: subtotal - totalDiscount, totalDiscount };
  };


  const generatePDF = (saleData: CartItem[], customer: { name: string; mobile: string; }, discount: number = 0, gst: number = 0): void => {
    const doc = new jsPDF();

    // Header: Invoice Title (Bold, Larger Font Size)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('INVOICE', 105, 20, { align: 'center' });  // Center-align the title

    // Customer Information Section (Clear Spacing)
    const invoiceID = `INV-${new Date().getTime()}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoiceID}`, 14, 30);
    doc.setFontSize(10);
    doc.text(`Customer Name: ${customer.name}`, 14, 35);
    doc.text(`Mobile: ${customer.mobile}`, 14, 40);
    doc.text(`GST Registered, Tax ID: XYZ123456`, 14, 45);  // GST info on the left top

    // Invoice ID (Right Aligned, Positioned Near the Top-Right Corner)

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`P SQUARE PHARMACY`, 200, 30, { align: 'right' });  // Right-align the invoice ID
    doc.setFontSize(10);
    doc.text(`BLOCK C-A/1 HOLI CHOWK SANGAM VIHAR`, 200, 35, { align: 'right' });  // Right-align the invoice ID
    doc.text(`NEAR POST OFFICE, NEW DELHI`, 200, 40, { align: 'right' });  // Right-align the invoice ID
    doc.text(`Contact us: +917011072245`, 200, 45, { align: 'right' });  // Right-align the invoice ID

    // Add a Horizontal Line Below the Header (To separate the header section)
    doc.setLineWidth(0.5);
    doc.line(14, 50, 200, 50);  // Line from left to right below header

    // Table: Item List (With a Stylish Table Layout)
    const tableData = saleData.map((item, index) => [
      index + 1,
      item.medicine.name,
      item.quantity,
      `${item.medicine.mrp.toFixed(2)}`,
      `${(item.quantity * item.medicine.mrp).toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['#', 'Medicine', 'Quantity', 'Price', 'Total']],
      body: tableData,
      startY: 60,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3, font: 'helvetica' },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontStyle: 'bold' }, // Stylish header row
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] }, // Dark text for the body
      columnStyles: { 0: { halign: 'center' }, 1: { halign: 'left' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' } }, // Column alignments
    });

    const finalY = (doc as any).lastAutoTable.finalY || 80;

    // Total Calculation Section (Using Improved Layout)
    doc.setFontSize(12);
    const subtotal = saleData.reduce((acc, item) => acc + item.quantity * item.medicine.mrp, 0);
    const totalAfterDiscount = subtotal - (discountType?.value === "overall_discount" ? subtotal * discount * 0.01 : discount);
    const gstAmount = gst ? (totalAfterDiscount * gst) / 100 : 0;
    const totalAmount = totalAfterDiscount + gstAmount;

    // Total Calculation Section (With Clear Formatting)
    doc.text(`Subtotal: ${subtotal.toFixed(2)} INR`, 155, finalY + 10);
    doc.text(`Discount: -${discount.toFixed(2)} ${discountType?.value === "manual_discount" ? "INR" : "%"}`, 155, finalY + 15);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: ${totalAmount.toFixed(2)} INR`, 145, finalY + 30);

    // Add a Horizontal Line After Totals (To separate totals from the signature)
    doc.setLineWidth(0.5);
    doc.line(14, finalY + 35, 200, finalY + 35);  // Line below totals

    // Sign and Seal Section (Left-Aligned with Signature Box)

    const sealY = finalY + 40;
    doc.setFont('helvetica', 'italic');
    doc.text('Authorized Signatory', 14, sealY + 35);
    doc.setLineWidth(0.3);
    doc.rect(14, sealY, 50, 25); // Placeholder for seal box

    // Save the PDF
    doc.save(`Invoice-${invoiceID}.pdf`);

    // Generate PDF Blob (Optional, if you need to use it for something else)
    const pdfOutput = doc.output('blob');

    // Open the PDF in a new tab
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl, '_blank');


    setPdfBlob(pdfOutput); // Store the generated PDF as a Blob (you can handle this in your state)
  };



  const validationSchema = Yup.object({
    customerName: Yup.string().optional(),
    customerContact: Yup.string()
      .required("Mobile Number is required")
    // .matches(/^\d{10}$/, "Mobile Number must be exactly 10 digits"),
  });

  const { subtotal, total, totalDiscount } = calculateTotal();

  const handleIndividualDiscount = (e: React.ChangeEvent<HTMLInputElement>, medicineId: string): void => {
    const discountValue = Number(e.target.value);

    if (isNaN(discountValue) || discountValue < 0) {
      return; // Don't allow negative values or invalid inputs
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.medicine._id === medicineId
          ? { ...item, discount: discountValue } // Apply the individual discount for the selected item
          : item
      )
    );
  };


  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-[40%] border-gray-300 rounded-lg border p-8 mb-4 shadow bg-white dark:bg-white/[0.03]">
        <Formik
          initialValues={{ customerName: '', customerContact: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm, }) => {
            const saleData: SaleData = {
              ...values,
              items: cart.map((c) => ({
                medicineId: c.medicine._id,
                name: c.medicine.name,
                // sellingPrice: c.medicine.sellingPrice,
                quantity: c.quantity,
                mrp: c.medicine.mrp,
              })),
            };
            try {
              await dispatch(createSale(saleData));
              generatePDF(cart, { name: values.customerName, mobile: values.customerContact }, discountType?.value === "manual_discount" ? totalDiscount : discountAmountFinal, 0);
              setIsOpen(true)
              resetForm();
              setCart([]);
              setSelectedMedicineId('');

            } catch (error: any) {
              toast.error(error)
            }

          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label>Customer Name</Label>

                <Field name="customerName" className="h-9 w-full appearance-none rounded-md border bg-white border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                <ErrorMessage name="customerName" component="div" className="text-red-500" />
              </div>
              <div>
                <Label ><span>Customer Contact</span> <span className='text-red-500'>*</span></Label>
                <Field name="customerContact" className="h-9 w-full appearance-none rounded-md border bg-white border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                <ErrorMessage name="customerContact" component="div" className="text-xs text-red-500" />
              </div>

              <div className="flex flex-col items-start space-y-4">
                <div className="w-full">
                  <Label>Select Medicine</Label>
                  <Select
                    className="dark:text-black dark:bg-transparent"
                    isSearchable
                    isMulti
                    isLoading={loading}
                    options={activeMedicineList.map(medicine => ({
                      value: medicine._id,
                      label: `${medicine.name} - ${medicine.totalStock}`
                    }))}
                    onChange={(selectedArray) => {
                      handleAddToCart([...selectedArray]); // spread to ensure mutable array
                    }}
                    // 🔍 Custom filter for case-insensitive search
                    filterOption={(option, inputValue) =>
                      option.label.toLowerCase().includes(inputValue.toLowerCase())
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col items-start space-y-4">
                <div className="w-full">
                  <Label>Select Discount Type</Label>
                  <Select
                    isSearchable={false}
                    className='dark:text-black dark:bg-transparent'

                    value={discountType}
                    options={discountTypeOptions}

                    onChange={(data) => setDiscountType(data as DiscountTypeOptionIF)}

                  />



                </div>
              </div>

              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                {isSubmitting ? <LoadingOverlay isLoading={true} /> : "Purchase"}
              </button>
            </Form>
          )}
        </Formik>
      </div>


      {/* Cart Summary */}
      <div className="w-full md:w-[60%] border-gray-300 dark:border-gray-900 rounded-lg border p-8 shadow flex flex-col justify-between bg-white dark:bg-white/[0.03]">
        <div className='w-full h-1/2'>
          <h2 className="text-lg font-bold mb-4">Cart Summary</h2>
          {cart.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">#</th>
                    <th className="border p-2 text-left">Medicine</th>
                    <th className="border p-2 text-center">MRP (INR)</th>
                    <th className="border p-2 text-center">Purchase Price (INR)</th>
                    <th className="border p-2 text-center">Quantity</th>
                    <th className="border p-2 text-center">Total</th>
                    {discountType?.value === 'manual_discount' && <th className="border p-2 text-center">Discount %</th>}
                    {/* <th className="border p-2 text-center">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.medicine._id} className="border-t">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{item.medicine.name}</td>
                      <td className="border p-2 text-center">{item.medicine.mrp}</td>
                      <td className="border p-2 text-center">{item.medicine.purchasePrice}</td>
                      <td className="border m-auto p-2 text-center flex justify-center items-center gap-2">
                        <div className=''>
                          <button
                            onClick={() => handleQuantityChange(item.medicine._id, -1)}
                            className="bg-gray-300 text-black px-2 py-1 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.medicine._id, 1)}
                            className="bg-gray-300 text-black px-2 py-1 rounded"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="border p-2 text-center">{item.quantity * item.medicine.mrp}</td>
                      {discountType?.value === 'manual_discount' && <td className="border p-2 text-center"><input onChange={(e) => handleIndividualDiscount(e, item.medicine._id)} min={0} max={100} className='w-15 h-9  appearance-none rounded-md border bg-white border-gray-300 px-4 py-2.5 pr-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800' type="number" /></td>}
                      {/* <td className="border p-2 text-center">
                        <button
                          onClick={() => handleRemove(item.medicine._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Remove
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No items in the cart</p>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm flex justify-between">
            <span>Subtotal:</span> <span>INR {subtotal.toFixed(2)}</span>
          </p>
          <p className="text-sm flex justify-between">
            <span>Discount ({discountType?.value === "manual_discount" ? "INR" : "%"}):</span> <span> {discountType?.value === 'manual_discount' ? totalDiscount : <input type="number" className="text-right w-15 h-9 my-3  appearance-none rounded-md border bg-white border-gray-300 px-4 py-2.5 pr-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" value={discountAmountFinal} max={100} min={0} onChange={(e) => setDiscountAmountFinal(Number(e.target.value))} />}  </span>
          </p>
          <p className="font-bold flex justify-between">
            <span>Total:</span> <span>INR {total.toFixed(2)}</span>
          </p>
        </div>
      </div>



    </div>
  );
};




export default SaleForm;





