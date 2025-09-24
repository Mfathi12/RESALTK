import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Unified Intention API (Paymob New Version)
router.post("/pay", async (req, res, next) => {
  try {
    const { name, email, phoneNumber, country, realprice } = req.body;

    // تحويل السعر إلى قرش (Paymob لازم بالـ cents)
    let finalPrice = Number(realprice) * 100;

    // 👇 لو عاوزة conversion (مثلاً من USD لـ EGP) تقدري تحطي هنا
    // finalPrice = convertedValue * 100;

    // ✅ طلب إنشاء Intention
    const intentionRes = await axios.post(
      process.env.PAYMOB_API_URL,
      {
        amount: finalPrice,
        currency: "EGP",
        payment_methods: ["card"], // أو Integration ID مباشر
        items: [
          {
            name: "Service/Donation",
            amount: finalPrice,
            description: "Payment through Resaltk",
            quantity: 1,
          },
        ],
        billing_data: {
          first_name: name || "Guest",
          last_name: name || "User",
          email: email,
          phone_number: phoneNumber,
          country: country || "EG",
          street: "NA",
          building: "NA",
          floor: "NA",
          apartment: "NA",
          state: "NA",
        },
        customer: {
          first_name: name || "Guest",
          last_name: name || "User",
          email: email,
          country: country || "EG",
          phone_number: phoneNumber,
        },
        extras: {
          project: "RESALTK",
        },
      },
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = intentionRes.data;
    const clientSecret = data.client_secret;

    // ✅ Unified Checkout URL
    const checkoutUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;

    res.json({
      success: true,
      checkoutUrl,
      paymentDetails: data,
    });
  } catch (err) {
    console.error("Payment error:", err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: err?.response?.data || err.message,
    });
  }
});

export default router;
