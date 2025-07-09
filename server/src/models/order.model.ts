import { Schema, model } from "mongoose";
import { IOrder } from "../types/order.type";

const orderSchema = new Schema<IOrder>({
  id: { type: String, required: true },
  number: { type: String, required: true },
  order_key: { type: String, required: true },
  status: { type: String, required: true },
  date_created: { type: Date, required: true },
  total: { type: Number, required: true },
  customer_id: { type: String, required: true },
  customer_note: { type: String, required: false },
  billing: { type: Object, required: true },
  shipping: { type: Object, required: true },
  line_items: {
    type: [Schema.Types.ObjectId],
    ref: "Product",
    required: false,
    default: [],
  },
});

orderSchema.index({
  id: "text",
  number: "text",
  "billing.first_name": "text",
  "billing.last_name": "text",
  "billing.email": "text",
  "billing.phone": "text",
  "billing.address_1": "text",
  "billing.address_2": "text",
  "shipping.first_name": "text",
  "shipping.last_name": "text",
  "shipping.phone": "text",
  "shipping.address_1": "text",
  "shipping.address_2": "text",
  "line_items.name": "text",
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
