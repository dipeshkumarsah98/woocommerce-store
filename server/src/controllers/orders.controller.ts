import { Request, Response } from "express";

import httpLogger from "../services/logger.service";
import { successResponse } from "../utils/successResponse.utils";
import { StatusCodes } from "http-status-codes";
import orderService from "../services/order.service";
import NotFoundError from "../errors/notFoundError.error";
import productService from "../services/product.service";
import { IOrderQuery } from "../types/order.type";

export async function getOrders(request: Request<{}, {}, IOrderQuery>, response: Response) {
    httpLogger.info(`Getting orders from database`);

    const orders = await orderService.getOrders(request.query);

    return response.send(
        successResponse(
            StatusCodes.OK,
            orders,
        )
    );

}

export async function getOrderOrderKey(request: Request<{ orderKey: string }>, response: Response) {
    httpLogger.info(`Getting order by order key from database`);
    const { orderKey } = request.params;
    const order = await orderService.getOrderOrderKey(orderKey);

    if (!order) {
        throw new NotFoundError("Order not found", `Order with order key ${orderKey} not found`);
    }

    return response.send(
        successResponse(
            StatusCodes.OK,
            order,
        )
    );
}

export async function getOrderProducts(request: Request<{ orderKey: string }>, response: Response) {
    httpLogger.info(`Getting order products by order key from database`);
    const { orderKey } = request.params;
    const products = await orderService.getOrderProducts(orderKey);

    if (!products) {
        throw new NotFoundError("Products not found", `Products with order key ${orderKey} not found`);
    }

    return response.send(
        successResponse(
            StatusCodes.OK,
            products,
        )
    );
}