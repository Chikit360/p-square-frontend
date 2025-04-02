import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppDispatch, RootState } from '../../features/store';
import { createSale } from '../../features/sale/saleApi';
import { activeMedicines } from '../../features/medicine/medicineApi';
import Select from 'react-select'
import Label from '../../components/form/Label';
import { Modal } from '../../components/ui/modal';

interface Medicine {
  _id: string;
  name: string;
  sellingPrice: number;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface SaleData {
  customerName?: string;
  customerContact?: string;
  items: { medicineId: string; name: string; quantity: number }[];
}

const SaleForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeMedicineList } = useSelector((state: RootState) => state.activeMedicines);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [_, setSelectedMedicineId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null); // Store PDF Blob for preview


  useEffect(() => {
    dispatch(activeMedicines());
  }, [dispatch]);

  const handleAddToCart = (medicine: Medicine): void => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.medicine._id === medicine._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.medicine._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { medicine, quantity: 1 }];
    });
    setSelectedMedicineId('');
  };

  const handleQuantityChange = (id: string, change: number): void => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.medicine._id === id ? { ...item, quantity: Math.max(item.quantity + change, 1) } : item
      )
    );
  };

  const handleRemove = (id: string): void => {
    setCart((prevCart) => prevCart.filter((item) => item.medicine._id !== id));
  };

  const calculateTotal = (): { subtotal: number; total: number } => {
    const subtotal = cart.reduce((sum, item) => sum + item.medicine.sellingPrice * item.quantity, 0);
    const discount = subtotal * discountPercentage * 0.01;
    return { subtotal, total: subtotal - discount };
  };

  const generatePDF = (saleData: CartItem[], customer: { name: string; mobile: string; }, discount: number = 0, gst: number = 0): void => {
    const doc = new jsPDF();
  
    // Header: Invoice Title (Bold, Larger Font Size)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('INVOICE', 105, 20, { align: 'center' });  // Center-align the title
  
    // Customer Information Section (Clear Spacing)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customer.name}`, 14, 30);
    doc.text(`Mobile: ${customer.mobile}`, 14, 35);
    doc.text(`GST Registered, Tax ID: XYZ123456`, 14, 40);  // GST info on the left top
  
    // Invoice ID (Right Aligned, Positioned Near the Top-Right Corner)
    const invoiceID = `INV-${new Date().getTime()}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoiceID}`, 200, 30, { align: 'right' });  // Right-align the invoice ID
  
    // Add a Horizontal Line Below the Header (To separate the header section)
    doc.setLineWidth(0.5);
    doc.line(14, 45, 200, 45);  // Line from left to right below header
  
    // Table: Item List (With a Stylish Table Layout)
    const tableData = saleData.map((item, index) => [
      index + 1,
      item.medicine.name,
      item.quantity,
      `${item.medicine.sellingPrice.toFixed(2)}`,
      `${(item.quantity * item.medicine.sellingPrice).toFixed(2)}`
    ]);
  
    autoTable(doc, {
      head: [['#', 'Medicine', 'Quantity', 'Price', 'Total']],
      body: tableData,
      startY: 50,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3, font: 'helvetica' },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontStyle: 'bold' }, // Stylish header row
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] }, // Dark text for the body
      columnStyles: { 0: { halign: 'center' }, 1: { halign: 'left' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' } }, // Column alignments
    });
  
    const finalY = (doc as any).lastAutoTable.finalY || 80;
  
    // Total Calculation Section (Using Improved Layout)
    doc.setFontSize(12);
    const subtotal = saleData.reduce((acc, item) => acc + item.quantity * item.medicine.sellingPrice, 0);
    const totalAfterDiscount = subtotal - discount;
    const gstAmount = gst ? (totalAfterDiscount * gst) / 100 : 0;
    const totalAmount = totalAfterDiscount + gstAmount;
  
    // Total Calculation Section (With Clear Formatting)
    doc.text(`Subtotal: ${subtotal.toFixed(2)} INR`, 155, finalY + 10);
    doc.text(`Discount: -${discount.toFixed(2)} INR`, 155, finalY + 15);
    doc.text(`GST (${gst}%): +${gstAmount.toFixed(2)} INR`, 155, finalY + 20);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: ${totalAmount.toFixed(2)} INR`, 145, finalY + 30);
  
    // Add a Horizontal Line After Totals (To separate totals from the signature)
    doc.setLineWidth(0.5);
    doc.line(14, finalY + 35, 200, finalY + 35);  // Line below totals
  
    // Sign and Seal Section (Left-Aligned with Signature Box)
    
    const sealY = finalY + 40;
    doc.setFont('helvetica', 'italic');
    doc.text('Authorized Signatory',14, sealY+35);
    doc.setLineWidth(0.3);
    doc.rect(14, sealY, 50, 25); // Placeholder for seal box
  
    // Save the PDF
    doc.save(`Invoice-${invoiceID}.pdf`);
  
    // Generate PDF Blob (Optional, if you need to use it for something else)
    const pdfOutput = doc.output('blob');
    setPdfBlob(pdfOutput); // Store the generated PDF as a Blob (you can handle this in your state)
  };
  
  


  const validationSchema = Yup.object({
    customerName: Yup.string().optional(),
    customerContact: Yup.string().required("Mobile Number is required"),
  });

  const { subtotal, total } = calculateTotal();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-gray-300 rounded-lg border p-8 mb-4 shadow bg-white dark:bg-white/[0.03]">
          <Formik
            initialValues={{ customerName: '', customerContact: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const saleData: SaleData = {
                ...values,
                items: cart.map((c) => ({
                  medicineId: c.medicine._id,
                  name: c.medicine.name,
                  sellingPrice:c.medicine.sellingPrice,
                  quantity: c.quantity,
                })),
              };
              dispatch(createSale(saleData));
              generatePDF(cart,{name:values.customerName,mobile:values.customerContact});
              setIsOpen(true)
              resetForm();
              setCart([]);
              setSelectedMedicineId('');
            }}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <Label>Customer Name</Label>
                  
                  <Field name="customerName" className="border p-2 w-full" />
                  <ErrorMessage name="customerName" component="div" className="text-red-500" />
                </div>
                <div>
                  <Label ><span>Customer Contact</span> <span className='text-red-500'>*</span></Label>
                  <Field name="customerContact" className="border p-2 w-full" />
                </div>

                <div className="flex flex-col items-start space-y-4">
                  <div className="w-full">
                    <Label>Select Medicine</Label>
                  <Select
                  className='dark:text-black'
                  isSearchable={true}
                  options={activeMedicineList
                        .filter(med => !cart.some(item => item.medicine._id === med._id))
                        .map((medicine:Medicine) => (
                          {
                            ...medicine,
                            value:medicine._id,
                            label:`${medicine.name} - ${medicine.sellingPrice}`
                          }
                          
                        ))}
                        
                        onChange={(data) => {
                          const selectedMedicine = activeMedicineList.find((m) => m._id === data?._id);
                          if (selectedMedicine) {
                            handleAddToCart(selectedMedicine);
                          }
                        }}
                        
                        />

                        
                    
                  </div>
                </div>

                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Purchase
                </button>
              </Form>
            )}
          </Formik>
        </div>
     

      {/* Cart Summary */}
      <div className="border-gray-300 dark:border-gray-900 rounded-lg border p-8 shadow flex flex-col justify-start bg-white dark:bg-white/[0.03]">
        <div className='w-full h-1/2'>
  <h2 className="text-lg font-bold mb-4">Cart Summary</h2>
  {cart.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">#</th>
            <th className="border p-2 text-left">Medicine</th>
            <th className="border p-2 text-center">Price (INR)</th>
            <th className="border p-2 text-center">Quantity</th>
            <th className="border p-2 text-center">Total</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={item.medicine._id} className="border-t">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{item.medicine.name}</td>
              <td className="border p-2 text-center">{item.medicine.sellingPrice}</td>
              <td className="border p-2 text-center flex justify-center items-center gap-2">
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
              </td>
              <td className="border p-2 text-center">{item.quantity * item.medicine.sellingPrice}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleRemove(item.medicine._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </td>
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
              <span>Discount (%):</span> <span><input type="number" className="text-right" value={discountPercentage} max={100} min={0} onChange={(e) => setDiscountPercentage(Number(e.target.value))} /></span>
            </p>
            <p className="font-bold flex justify-between">
              <span>Total:</span> <span>INR {total.toFixed(2)}</span>
            </p>
          </div>
        </div>

      <Modal className='max-h-[80vh] max-w-1/3 mt-[10%]' isOpen={isOpen} onClose={()=>setIsOpen(false)} >

        {/* Invoice Preview */}
       <div className="w-full">
        <h2 className="text-lg text-center font-bold mb-4 dark:text-black">Invoice Preview</h2>
        <div className='bg-white w-full h-auto'>
        {pdfBlob ? (
          <object  data={URL.createObjectURL(pdfBlob)} type="application/pdf" width="100%" height="400px">
            <p>Your browser does not support PDF viewing. <a href={URL.createObjectURL(pdfBlob)}>Download PDF</a></p>
          </object>
        ) : (
          <div className='flex justify-center items-center'>
            <p className='p-5'>No invoice generated yet.</p>

          </div>
        )}

        </div>
      </div>

      </Modal>
       
    </div>
  );
};

export default SaleForm;





