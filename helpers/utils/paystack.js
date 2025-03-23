import Paystack from "paystack";

export const paystack = Paystack(process.env.NEXT_PUBLIC_PAYSTACK_API_KEY_TEST);
