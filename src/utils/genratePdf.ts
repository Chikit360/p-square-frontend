const fs = require('fs');
const ejs = require('ejs');

const html2pdf = require('html2pdf.js');

export const generatePDF = async (saleData:any, customer:any, discount = 0, gst = 0) => {
  // Calculate totals
  const subtotal = saleData.reduce((acc:any, item:any) => acc + item.quantity * item.medicine.sellingPrice, 0);
  const totalAfterDiscount = subtotal - discount;
  const gstAmount = gst ? (totalAfterDiscount * gst) / 100 : 0;
  const totalAmount = totalAfterDiscount + gstAmount;

  // Prepare template data
  const invoiceData = {
    invoiceId: `INV-${new Date().getTime()}`,
    date: new Date().toLocaleDateString(),
    customer: customer,
    saleData: saleData,
    subtotal: subtotal,
    discount: discount,
    gst: gst,
    gstAmount: gstAmount,
    totalAmount: totalAmount,
  };

  // Read the EJS template
  const template = fs.readFileSync('invoiceTemplate.ejs', 'utf-8');
  
  // Render the template with the data
  const htmlOutput = ejs.render(template, invoiceData);


  
  // Convert the HTML to PDF (using html2pdf or jsPDF's html support)
  html2pdf()
    .from(htmlOutput)
    .save(`Invoice-${invoiceData.invoiceId}.pdf`);

  console.log('PDF generated successfully!');
};

// Example Usage:
const saleData = [
  { medicine: { name: 'Paracetamol', sellingPrice: 5.0 }, quantity: 2 },
  { medicine: { name: 'Ibuprofen', sellingPrice: 7.5 }, quantity: 3 },
];

const customer = {
  name: 'John Doe',
  mobile: '1234567890',
  contact: '9876543210',
};

generatePDF(saleData, customer, 5, 18); // Discount of $5, GST of 18%
