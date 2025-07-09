import { Schema, model } from "mongoose";
import { IProduct } from "../types/product.type";

const productSchema = new Schema<IProduct>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    product_id: { type: Number, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    meta_data: { type: [Object], required: true, default: [] },
    sku: { type: String, required: false },
    stock_status: { type: String, required: true },
    categories: { type: [Object], required: true, default: [] },
    price: { type: String, required: false },
    images: { type: [{
        id: { type: Number, required: false, default: null },
        src: { type: String, required: false, default: null },
        name: { type: String, required: false, default: null },
        alt: { type: String, required: false, default: null },
    }], required: false, default: [] },
});

productSchema.index({
    name: "text",
    sku: "text",
    description: "text",
});

const Product = model<IProduct>("Product", productSchema);

export default Product;