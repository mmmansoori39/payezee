import axios from "axios";
import { generateSignatureHash } from "./crypto.js";

export const notifyMerchant = async (data) => {
  const url = data?.url?.callbackUrl;
  if (url) {
    const response = {
      transaction_id: data.transactionId,
      merchant_invoice_id: data.invoiceId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      fee_amount: "00",
      fee_currency: "INR"
    };
    const Signature = generateSignatureHash(
      data.merchant.apiKey,
      data.merchant.merchantPassphrase,
      response
    );
    const res = await axios.post(url, response, {
      headers: {
        Signature
      }
    });
    return res.status >= 200 || res.status <= 299;
  }
};
