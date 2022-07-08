import { Request, Response } from 'express';
import models from "../models";
import { successResponse, errorResponse } from "../utils/responses";
import { IProductQuery, IProduct } from "../utils/interface";

/**
 * @class ProductController
 * @description create, seller Product
 * @exports ProductController
 */
export default class ProductController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async createProduct(req: Request, res: Response) {
    const { name, price, quantity } = req.body;
    const product = await models.Product.create({ name, price, quantity });
    return successResponse( res, 201, "Product created successfully", product );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async deleteProduct(req: Request, res: Response) {
    const { productId } = req.params;
    const product = await models.Product.findById(productId);
    if (!product) { return errorResponse(res, 404, "Product not found.") }

    await models.Product.findByIdAndRemove(productId);
    return successResponse(
      res,
      200,
      "Successfully Deleted Product.",
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getProducts(req: Request, res: Response) {
     const { page = 1, limit = 10, title } = req.query;
    const filters = {} as IProductQuery;
    if (title) {
      filters.$text = {
        $search : title as string
      };
    }
    const Products = await models.Product.find({})
    .sort({ createdAt: 1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
    return successResponse(
      res,
      200,
      "Successfully retrieved all Products.",
      Products
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getProductById(req: Request, res: Response) {
    const { productId } = req.params;
    const product = await models.Product.findById(productId)
    if (!product) { return errorResponse(res, 404, "Product not found."); }
    return successResponse( res, 200, "Successfully retrieved Product.", product);
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async editProduct(req: Request, res: Response) {
    const { productId } = req.params;
    const product = await models.Product.findById(productId);
    if (!product) { return errorResponse(res, 404, "Product not found."); }
    const newProduct = await models.Product.findByIdAndUpdate(
      productId, req.body, { new: true }
    );
    return successResponse(res, 200, "Successfully updated Product.", newProduct);
  }
}
