import axios from "axios";
import { envVariable } from "../../config";

// Define the input type for initiatePayment
interface PaymentPayload {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;

}

// Define the expected response type (you can make this more detailed based on actual response)
interface AamarPayResponse {
  payment_url?: string;
  [key: string]: any;
}

export const initiatePayment = async ({
  amount,
  transactionId,
  name,
  email,
  phone,
  address,
  city,
}: PaymentPayload): Promise<AamarPayResponse> => {
  const payload = {
    store_id: envVariable.AAMARPAY_STORE_ID,
    signature_key: envVariable.AAMARPAY_SIGNATURE_KEY,
    currency: "BDT",
    amount,
    cus_add1: address,
    cus_add2: address,
    cus_city: city,
    cus_country: 'Bangladesh',
    tran_id: transactionId,
    success_url: `${envVariable.SUCCESS_URL}?transactionId=${transactionId}`,
    fail_url: `${envVariable.FAIL_URL}?transactionId=${transactionId}`,
    cancel_url:`${envVariable.CANCEL_URL}?transactionId=${transactionId}`,
    cus_name: name,
    cus_email: email,
    cus_phone: phone,
    desc: `Booking for room`,
    type: "json",
  };

  
  const response = await axios.post("https://sandbox.aamarpay.com/jsonpost.php", payload);

  return response.data;
};



export const verifyPayment = async (transactionId: string) => {
  console.log("Transaction ID:", transactionId);

  try {
    const verificationUrl = `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php`;

    const response = await axios.get(`${verificationUrl}`, {
      params: {
        store_id: envVariable.AAMARPAY_STORE_ID,
        signature_key: envVariable.AAMARPAY_SIGNATURE_KEY,
        request_id: transactionId,
        type: 'json',
      },
    });
   

    const {pay_status,amount,status_title,payment_type} = response.data;
    return {pay_status,amount,status_title,payment_type}
  } catch (error: any) {
    
    return {
      status: "error",
      message: "Verification failed",
      error: error.message || error,
    };
  }
};


