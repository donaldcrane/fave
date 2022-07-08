import { Request, Response } from 'express';
import models from "../models";
import { successResponse, errorResponse } from "../utils/responses";
import { ICart } from "../utils/interface";

/**
 * @class CartController
 * @description create, seller Cart
 * @exports CartController
 */
export default class CartController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
    static async addProductToCart(req: Request, res: Response) {
    const { products } = req.body;
    const cart = await models.Cart.findOne({ user: req.user._id });
    if (cart) { 
        await models.Cart.updateOne(
            { _id: cart._id }, { $addToSet: { products: [products] } },
        );
        await models.Cart.findByIdAndUpdate(
            { _id: cart._id }, { $inc: { quantity: products.length } }
          );
    }
    if (!cart) { 
        await models.Cart.create({ user: req.user._id, products, quantity: products.length });
      }
    const createdCart = await models.Cart.findOne({ user: req.user._id }).populate("products");
    
    return successResponse( res, 201, "Cart created successfully", createdCart );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async deleteCart(req: Request, res: Response) {
    const { cartId } = req.params;
    const { _id } = req.user;
    console.log(cartId)
    console.log(_id?.toString())
    const cart = await models.Cart.findOne({ _id: cartId, user: _id?.toString() });
    if (!cart) { return errorResponse(res, 404, "Cart not found.") }

    await models.Cart.findByIdAndRemove(cartId);
    return successResponse(
      res,
      200,
      "Successfully Deleted Cart.",
    );
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async removeProductFromCart(req: Request, res: Response) {
    const { cartId, productId } = req.query;
    const cart = await models.Cart.findOne({_id: cartId, user: req.user._id});
    if (!cart) { return errorResponse(res, 404, "Cart not found."); }
    await models.Cart.updateOne(
      { _id: cartId },
      { $pull: { products: productId } }
    );
    await models.Cart.findByIdAndUpdate(
      cartId, { $inc: { quantity: -1 } }
    );
    const updatedCart = await models.Cart.findById(cartId).populate("products");
    return successResponse(res, 200, "Product successfully removed from Cart.", updatedCart);
  }

   /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getUserCart(req: Request, res: Response) {
    const { _id } = req.user;
    const cart = await models.Cart.findOne({ user: _id?.toString() }).populate("products");
    if(!cart) { return errorResponse(res, 404, "User does not exist kindly create one.")}
    return successResponse(
      res,
      200,
      "Successfully retrieved user cart.",
      cart
    );
  }
}
 