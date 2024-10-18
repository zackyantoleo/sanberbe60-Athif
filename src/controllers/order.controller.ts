import { Request, Response } from "express";
import { createOrder, getUserOrders } from "../services/order.service";
import { IRequestWithUser } from "../middlewares/auth.middleware";
import { Types } from "mongoose";

export default {
  async create(req: IRequestWithUser, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.security = [{
      "bearerAuth": []
     }]
     #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/OrderRequest"
      }
     }
     */
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
          data: null,
        });
      }

      const orderData = {
        ...req.body,
        createdBy: new Types.ObjectId(userId),
      };

      const result = await createOrder(orderData);
      res.status(201).json({
        data: result,
        message: "Order created successfully",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed to create order",
      });
    }
  },

  async getUserOrders(req: IRequestWithUser, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.security = [{
      "bearerAuth": []
     }]
     #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/OrderRequest"
      }
     }
     */
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
          data: null,
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await getUserOrders(
        new Types.ObjectId(userId),
        page,
        limit
      );
      res.status(200).json({
        data: result,
        message: "User orders retrieved successfully",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed to retrieve user orders",
      });
    }
  },
};
