import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppDispatch, RootState } from '../../features/store';
import { createSale } from '../../features/inventory/inventoryApi';
import { activeMedicines } from '../../features/medicine/medicineApi';

interface Medicine {
  _id: string;
  name: string;
  mrp: number;
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
  const { sales } = useSelector((state: RootState) => state.inventory);
  const { activeMedicineList } = useSelector((state: RootState) => state.activeMedicines);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('');

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

  const calculateTotal = (): { subtotal: number; tax: number; total: number } => {
    const subtotal = cart.reduce((sum, item) => sum + item.medicine.mrp * item.quantity, 0);
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  };

  const generatePDF = (saleData: CartItem[]): void => {
    const doc = new jsPDF();
    doc.text('Invoice', 14, 20);

    const tableData = saleData.map((item, index) => [
      index + 1,
      item.medicine.name,
      item.quantity,
      `$${item.medicine.mrp}`,
      `$${item.quantity * item.medicine.mrp}`,
    ]);

    (autoTable as any)(doc, {
      head: [['#', 'Medicine', 'Quantity', 'Price', 'Total']],
      body: tableData,
      startY: 30,
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 40;
    const totalAmount = saleData.reduce((data, record) => data + record.quantity * record.medicine.mrp, 0);
    doc.text(`Total Amount: $${totalAmount}`, 14, finalY + 10);
    doc.save(`Invoice-${new Date().toUTCString()}.pdf`);
  };

  const validationSchema = Yup.object({
    customerName: Yup.string().optional(),
    customerContact: Yup.string().optional(),
  });

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
      <div className='border-gray-300 rounded-lg border p-8 shadow'>
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
              <div >
                <label className="block">Customer Name</label>
                <Field name="customerName" className="border p-2 w-full" />
                <ErrorMessage name="customerName" component="div" className="text-red-500" />
              </div>
              <div>
                <label className="block">Customer Contact (Optional)</label>
                <Field name="customerContact" className="border p-2 w-full" />
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={selectedMedicineId}
                  className="border p-2 w-full"
                  onChange={(e) => {
                    const selectedMedicine = activeMedicineList.find(m => m._id === e.target.value);
                    if (selectedMedicine) {
                      handleAddToCart(selectedMedicine);
                    }
                  }}
                >
                  <option value="">Select Medicine</option>
                  {activeMedicineList
                    .filter(med => !cart.some(item => item.medicine._id === med._id))
                    .map((medicine) => (
                      <option key={medicine._id} value={medicine._id}>
                        {medicine.name} - ${medicine.mrp}
                      </option>
                    ))}
                </select>
              </div>

              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Purchase</button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Cart Summary */}
      <div className='border-gray-300 rounded-lg border p-8 shadow flex flex-col justify-between'>
        <div>
        <h2 className="text-lg font-bold mb-4">Cart Summary</h2>
        {cart.length>0 ? cart.map((item) => (
          <div key={item.medicine._id} className="flex justify-between items-center border p-2">
            <span>{item.medicine.name} - ${item.medicine.mrp} x {item.quantity}</span>
            <div className="flex items-center space-x-2">
              <button onClick={() => handleQuantityChange(item.medicine._id, -1)} className="bg-gray-300 text-black px-2 py-1">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.medicine._id, 1)} className="bg-gray-300 text-black px-2 py-1">+</button>
            </div>
            <button onClick={() => handleRemove(item.medicine._id)} className="bg-red-500 text-white px-2 py-1">Remove</button>
          </div>
        )): <div  className="flex justify-between items-center border p-2">
        <span>Medicine Name - MRP x 1</span>
        <div className="flex items-center space-x-2">
          <button  className="bg-gray-300 text-black px-2 py-1">-</button>
          <span>1</span>
          <button className="bg-gray-300 text-black px-2 py-1">+</button>
        </div>
        <button className="bg-red-500 text-white px-2 py-1">Remove</button>
      </div>}
        </div>
        <div className="mt-4">
          <p className='text-sm flex justify-between'><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></p>
          <p className='text-sm flex justify-between'><span>Tax (10%):</span> <span>${tax.toFixed(2)}</span></p>
          <p className="font-bold flex justify-between"><span>Total:</span> <span>${total.toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
};

export default SellForm;