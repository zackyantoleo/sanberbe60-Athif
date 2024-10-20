import OrderModel, { Order } from "../models/order.model";
import ProductsModel from "../models/products.model";
import { Types } from "mongoose";
import { sendInvoiceEmail } from "../utils/email";

export const createOrder = async (orderData: Order): Promise<Order> => {
  const session = await OrderModel.startSession();
  session.startTransaction();

  try {
    // Validate and update product quantities
    for (const item of orderData.orderItems) {
      const product = await ProductsModel.findById(item.productId).session(
        session
      );
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (product.qty < item.quantity) {
        throw new Error(`Insufficient quantity for product: ${product.name}`);
      }

      // Update product quantity
      await ProductsModel.findByIdAndUpdate(
        item.productId,
        { $inc: { qty: -item.quantity } },
        { session, new: true }
      );
    }

    // Create the order
    const order = await OrderModel.create([orderData], { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send invoice email after the transaction is committed
    try {
      await sendInvoiceEmail(order[0]);
    } catch (emailError) {
      console.error("Failed to send invoice email:", emailError);
      // Note: We don't throw here because the order has already been created
    }

    return order[0];
  } catch (error) {
    // Only abort if the transaction hasn't been committed
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};

export const getUserOrders = async (
  userId: Types.ObjectId,
  page: number = 1,
  limit: number = 10
): Promise<{
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    OrderModel.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    OrderModel.countDocuments({ createdBy: userId }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    orders,
    total,
    page,
    totalPages,
  };
};
