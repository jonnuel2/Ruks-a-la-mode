import { PaymentDetailsProps } from "@/helpers/types";

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  payment,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-3/4">
        <h2 className="text-xl font-bold mb-4">
          Payment Details - {payment.id}
        </h2>
        <p className="mb-2">Customer: {payment.customerName}</p>
        <p className="mb-2">Order ID: {payment.orderId}</p>
        <p className="mb-2">Amount: ${payment.amount.toFixed(2)}</p>
        <p className="mb-2">Method: {payment.method}</p>
        <p className="mb-2">Status: {payment.status}</p>
        <p className="mb-4">Date: {payment.date}</p>

        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentDetails;
