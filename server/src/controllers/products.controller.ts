import { Request, Response } from "express";
import { successResponse } from "../utils/successResponse.utils";
import { StatusCodes } from "http-status-codes";
import httpLogger from "../services/logger.service";
import productService from "../services/product.service";
import NotFoundError from "../errors/notFoundError.error";
import { IProductQuery } from "../types/product.type";

export async function getProducts(request: Request<{}, {}, IProductQuery>, response: Response) {
  httpLogger.info(`Getting products from WooCommerce API`);
  const products = await productService.getProducts(request.query);

  return response.send(successResponse(StatusCodes.OK, products));
}

export async function getProductBySlug(
  request: Request<{ slug: string }>,
  response: Response
) {
  httpLogger.info(`Getting product by slug from database`);
  const { slug } = request.params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    throw new NotFoundError(
      "Product not found",
      `Product with slug ${slug} not found`
    );
  }

  return response.send(successResponse(StatusCodes.OK, product));
}
