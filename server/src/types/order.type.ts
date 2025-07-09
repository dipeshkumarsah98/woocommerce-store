import { Types } from "mongoose";
import { IProduct } from "./product.type";

export interface IOrder {
    _id?: Types.ObjectId;
    id: string;
    number: string;
    order_key: string;
    status: string;
    date_created: Date;
    total: number;
    customer_id: string;
    customer_note: string;
    billing: any;
    shipping: any;
    line_items: Types.ObjectId[];
}

export interface IOrderQuery {
    search?: string;
    status?: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'failed';
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    lineItem?: string;
}