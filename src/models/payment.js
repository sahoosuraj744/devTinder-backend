import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
    },
    paymentId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["created", "authorized", "failed", "refunded", "captured"],
      required: true,
      default: "created",
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
    },
    receipt: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      membershipType: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true },
);
export const Payment = mongoose.model("Payment", paymentSchema);
