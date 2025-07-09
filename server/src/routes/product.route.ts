import { Router } from "express";
import { getProducts, getProductBySlug, getProductOrders } from "../controllers/products.controller";

const router = Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.get("/:slug/orders", getProductOrders);

export default router;