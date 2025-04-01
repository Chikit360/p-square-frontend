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

const SellForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeMedicineList } = useSelector((state: RootState) => state.activeMedicines);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [_, setSelectedMedicineId] = useState<string>('');
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

  const generatePDF = (saleData: CartItem[]): void => {
    const doc = new jsPDF();
    doc.text('Invoice', 14, 20);

    const tableData = saleData.map((item, index) => [
      index + 1,
      item.medicine.name,
      item.quantity,
      `$${item.medicine.sellingPrice}`,
      `$${item.quantity * item.medicine.sellingPrice}`,
    ]);

    (autoTable as any)(doc, {
      head: [['#', 'Medicine', 'Quantity', 'Price', 'Total']],
      body: tableData,
      startY: 30,
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 40;
    const totalAmount = saleData.reduce((data, record) => data + record.quantity * record.medicine.sellingPrice, 0);
    doc.text(`Total Amount: $${totalAmount}`, 14, finalY + 10);
    doc.save(`Invoice-${new Date().toUTCString()}.pdf`);

     // Generate PDF Blob
     const pdfOutput = doc.output('blob');
     setPdfBlob(pdfOutput); // Store the generated PDF as a Blob
  };

  const validationSchema = Yup.object({
    customerName: Yup.string().optional(),
    customerContact: Yup.string().optional(),
  });

  const { subtotal, total } = calculateTotal();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="w-full p-8">
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
                  quantity: c.quantity,
                })),
              };
              dispatch(createSale(saleData));
              generatePDF(cart);
              resetForm();
              setCart([]);
              setSelectedMedicineId('');
            }}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label className="block">Customer Name</label>
                  <Field name="customerName" className="border p-2 w-full" />
                  <ErrorMessage name="customerName" component="div" className="text-red-500" />
                </div>
                <div>
                  <label className="block">Customer Contact (Optional)</label>
                  <Field name="customerContact" className="border p-2 w-full" />
                </div>

                <div className="flex flex-col items-start space-y-4">
                  <div className="w-full">
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
        <div className="border-gray-300 dark:border-gray-900 rounded-lg border p-8 shadow flex flex-col justify-between bg-white dark:bg-white/[0.03]">
          <div>
            <h2 className="text-lg font-bold mb-4">Cart Summary</h2>
            {cart.length > 0
              ? cart.map((item) => (
                  <div key={item.medicine._id} className="flex justify-between items-center border p-2">
                    <span>{item.medicine.name} - ${item.medicine.sellingPrice} x {item.quantity}</span>
                    <div className='flex justify-center gap-2'>
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleQuantityChange(item.medicine._id, -1)} className="bg-gray-300 text-black px-2 py-1">
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.medicine._id, 1)} className="bg-gray-300 text-black px-2 py-1">
                        +
                      </button>
                    </div>
                    <button onClick={() => handleRemove(item.medicine._id)} className="bg-red-500 text-white px-2 py-1">
                      Remove
                    </button>
                    </div>
                  </div>
                ))
              : (
                <div className="flex justify-between items-center border p-2">
                  <span>Medicine Name - MRP x 1</span>
                  <div className="flex items-center space-x-2">
                    <button className="bg-gray-300 text-black px-2 py-1">-</button>
                    <span>1</span>
                    <button className="bg-gray-300 text-black px-2 py-1">+</button>
                  </div>
                  <button className="bg-red-500 text-white px-2 py-1 rounded-md">Remove</button>
                </div>
              )}
          </div>
          <div className="mt-4">
            <p className="text-sm flex justify-between">
              <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span>Discount (%):</span> <span><input type="number" className="text-right" value={discountPercentage} max={100} min={0} onChange={(e) => setDiscountPercentage(Number(e.target.value))} /></span>
            </p>
            <p className="font-bold flex justify-between">
              <span>Total:</span> <span>${total.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>

       {/* Invoice Preview */}
       <div className="w-full">
        <h2 className="text-lg font-bold mb-4 dark:text-black">Invoice Preview</h2>
        <div className='bg-white w-full h-[90%]'>
        {pdfBlob ? (
          <object  data={URL.createObjectURL(pdfBlob)} type="application/pdf" width="100%" height="600px">
            <p>Your browser does not support PDF viewing. <a href={URL.createObjectURL(pdfBlob)}>Download PDF</a></p>
          </object>
        ) : (
          <div className='flex justify-center items-center'>
            <p>No invoice generated yet.</p>

          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default SellForm;





