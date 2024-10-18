import OrderModel, { Order } from "../models/order.model";
import ProductsModel from "../models/products.model";
import { Types } from "mongoose";

export const createOrder = async (orderData: Order): Promise<Order> => {
  const session = await OrderModel.startSession();
  session.startTransaction();

  try {
    // Validate and update product quantities
    for (const item of orderData.orderItems) {
      const product = await ProductsModel.findById(item.productId);
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
        { session }
      );
    }

    // Create the order
    const order = await OrderModel.create([orderData], { session });

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (error) {
    await session.abortTransaction();
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
