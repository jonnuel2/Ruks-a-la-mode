import { useState } from "react";
import PaymentTable from "./payments-table";
import { Payment } from "@/helpers/types";
import PaymentDetails from "./payment-details";

export default function Payments() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  return (
    <div>
      <PaymentTable setSelectedPayment={setSelectedPayment} />
      {selectedPayment && (
        <PaymentDetails
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}
