import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { Payment } from "../models/payment.js";
const paymentRouter = express.Router();
import razorpayInstace from "../utils/razorpay.js";
import { User } from "../models/user.js";
import membershipAmount from "../utils/constants.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstace.orders.create({
      amount: membershipAmount[membershipType] * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt01",
      notes: {
        firstName: firstName,
        lastName: lastName,
        emailId: emailId,
        membershipType: membershipType,
      },
    });
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
      // membershipType: order.notes.membershipType,
    });
    const savePayment = await payment.save();

    res
      .status(200)
      .json({ ...savePayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebHokValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );
    if (!isWebHokValid) {
      return res.status(400).json({ msg: "WebHook signature is invalid" });
    }
    const paymentDetails= req.body.payload.payment.entity;
    const payment=await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status=paymentDetails.status;
    await payment.save();
    const user=await User.findById({ _id: payment.userId });
    user.isPremium=true;
    user.membershipType=payment.notes.membershipType;
    await user.save();
    if (req.body.event === "payment.captured") {  
    }
    if (req.body.event === "payment.failed") {
    }
    res.status(200).json({ msg: "Webhook received successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
export default paymentRouter;
