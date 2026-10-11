import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { Order } from '../../types/ecommerce';

interface PrintableInvoiceProps {
  order: Order;
  onClose?: () => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 sm:p-6 flex items-center justify-center">
      <div className="relative w-full max-w-3xl bg-white text-zinc-900 rounded-xl shadow-2xl p-8 sm:p-12 overflow-hidden print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none">
        {/* Floating action controls (hidden in print) */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded bg-zinc-100 text-zinc-600 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Invoice Paper Body */}
        <div className="space-y-8 border-b-2 border-zinc-900 pb-8">
          {/* Header Row */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-serif text-3xl font-extrabold tracking-widest text-zinc-950">
                RICH PEOPLE
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-600 mt-1">
                Luxury Menswear Atelier · Dhaka
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Banani, Dhaka-1213, Bangladesh · +880 1712-345678
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-zinc-100 border border-zinc-300 rounded font-mono text-xs font-bold text-zinc-900">
                INVOICE
              </span>
              <p className="font-mono text-sm font-bold text-zinc-950 mt-2">
                {order.id}
              </p>
              <p className="text-xs text-zinc-600">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Billed To / Shipping Address */}
          <div className="grid grid-cols-2 gap-8 text-xs border-t border-zinc-200 pt-6">
            <div>
              <span className="uppercase tracking-widest font-bold text-zinc-500 block mb-1">
                Recipient / Customer
              </span>
              <strong className="text-sm font-semibold text-zinc-950 block">
                {order.customerName}
              </strong>
              <p className="text-zinc-700 mt-0.5">Phone: {order.customerPhone}</p>
              {order.customerEmail && <p className="text-zinc-700">Email: {order.customerEmail}</p>}
            </div>

            <div>
              <span className="uppercase tracking-widest font-bold text-zinc-500 block mb-1">
                Shipping Destination
              </span>
              <p className="text-zinc-800 leading-relaxed">
                {order.shippingAddress.fullAddress}, {order.shippingAddress.area},{' '}
                {order.shippingAddress.district}, {order.shippingAddress.division}
                {order.shippingAddress.postCode && ` - ${order.shippingAddress.postCode}`}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Method: <strong>{order.deliveryMethod}</strong>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 text-zinc-900 font-bold uppercase tracking-wider">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Size</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3">
                      <strong className="text-zinc-950">{item.name}</strong>
                      <span className="block text-[11px] text-zinc-500">{item.color}</span>
                    </td>
                    <td className="py-3 text-center font-mono">{item.size}</td>
                    <td className="py-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">৳{item.price.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono font-bold">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Advance Breakdown */}
          <div className="flex justify-end pt-4">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal:</span>
                <span className="font-mono text-zinc-900 font-medium">৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-rose-700">
                  <span>Discount ({order.couponCode || 'Privilege'}):</span>
                  <span className="font-mono">-৳{order.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Fee:</span>
                <span className="font-mono text-zinc-900">
                  {order.shippingCharge === 0 ? 'FREE' : `৳${order.shippingCharge}`}
                </span>
              </div>

              <div className="border-t border-zinc-300 pt-2 flex justify-between font-bold text-sm text-zinc-950">
                <span>Order Total:</span>
                <span className="font-mono">৳{order.grandTotal.toLocaleString()}</span>
              </div>

              <div className="bg-zinc-100 p-2.5 rounded border border-zinc-300 space-y-1 text-xs mt-2">
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Advance Paid ({order.paymentMethod}):</span>
                  <span className="font-mono">৳{order.advancePaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-zinc-950 pt-1 border-t border-zinc-200">
                  <span>Remaining Cash on Delivery:</span>
                  <span className="font-mono">৳{order.remainingCOD.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Verification footer */}
          <div className="border-t border-zinc-200 pt-4 grid grid-cols-2 text-[11px] text-zinc-600">
            <div>
              <p><strong>Payment Method:</strong> {order.paymentMethod} Send Money</p>
              <p><strong>Transaction ID:</strong> <span className="font-mono">{order.transactionId}</span></p>
              <p><strong>Sender Mobile:</strong> <span className="font-mono">{order.senderPhone}</span></p>
            </div>
            <div className="text-right">
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p><strong>Order Status:</strong> {order.orderStatus}</p>
              <p className="italic mt-1">Thank you for choosing Rich People Menswear.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
