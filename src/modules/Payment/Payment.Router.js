import express from "express";
import axios from "axios";

const router = express.Router();

// 1- Get auth token من Paymob
router.post("/pay", async (req, res, next) => {
  try {
    const { amount, email, phone } = req.body;

    // 1. Authentication
    const authRes = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: process.env.PAYMOB_API_KEY,
    });
    const token = authRes.data.token;

    // 2. Order registration
    const orderRes = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
      auth_token: token,
      delivery_needed: "false",
      amount_cents: amount * 100, // لازم بالقرش
      currency: "EGP",
      items: [],
    });
    const orderId = orderRes.data.id;

    // 3. Payment key request
    const paymentKeyRes = await axios.post("https://accept.paymob.com/api/acceptance/payment_keys", {
      auth_token: token,
      amount_cents: amount * 100,
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        apartment: "NA",
        email: email || "customer@example.com",
        floor: "NA",
        first_name: "Customer",
        last_name: "Test",
        street: "NA",
        building: "NA",
        phone_number: phone || "+201000000000",
        shipping_method: "NA",
        postal_code: "NA",
        city: "Cairo",
        country: "EG",
        state: "NA",
      },
      currency: "EGP",
      integration_id: process.env.PAYMOB_INTEGRATION_ID, // بتاخديها من داشبورد بايموب
    });

    const paymentToken = paymentKeyRes.data.token;

    // 4. Link للـ iframe
    const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;

    res.json({ iframeURL });
  } catch (err) {
    next(err);
  }
});

export default router;
