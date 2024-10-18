import mongoose, { Schema, Types } from "mongoose";

export interface OrderItem {
  name: string;
  productId: Types.ObjectId;
  price: number;
  quantity: number;
}

export interface Order {
  grandTotal: number;
  orderItems: OrderItem[];
  createdBy: Types.ObjectId;
  status: "pending" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
  name: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Products", required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, max: 5 },
});

const OrderSchema = new Schema<Order>(
  {
    grandTotal: { type: Number, required: true },
    orderItems: { type: [OrderItemSchema], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<Order>("Order", OrderSchema);

export default OrderModel;
