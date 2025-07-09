import { Router } from "express";
import { getOrderOrderKey, getOrderProducts, getOrders } from "../controllers/orders.controller";

const router = Router();

router.get("/", getOrders);
router.get("/:orderKey/products", getOrderProducts);
router.get("/:orderKey", getOrderOrderKey);

export default router;