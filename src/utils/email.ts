import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { Order } from "../models/order.model";
import UserModel from "../models/user.model";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendInvoiceEmail = async (order: Order) => {
  const user = await UserModel.findById(order.createdBy);
  if (!user) {
    throw new Error("User not found");
  }

  const templatePath = path.join(__dirname, "../../templates/invoice.ejs");
  const html = await ejs.renderFile(templatePath, {
    customerName: user.fullName,
    orderItems: order.orderItems,
    grandTotal: order.grandTotal,
    contactEmail: process.env.CONTACT_EMAIL,
    companyName: process.env.COMPANY_NAME,
    year: new Date().getFullYear(),
  });

  await transporter.sendMail({
    from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Your Invoice",
    html: html,
  });
};
