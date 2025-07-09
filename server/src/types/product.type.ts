import { Types } from "mongoose";

export interface IProduct {
    _id?: Types.ObjectId;
    name: string;
    product_id: number;
    description: string;
    meta_data: any[];
    sku: string | null;
    stock_status: string;
    categories: any[];
    price?: string;
    images?: {
        id: number;
        src: string;
        name: string;
        alt: string;
    }[];
}

export interface IProductQuery {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}