import Joi from "joi";
import { ICart } from '../utils/interface';
import objectId from "./common";

export const validateAddToCart = (cart: ICart) => {
  const schema = Joi.object({
    products: Joi.array().items(
      objectId.messages({
        "any.required": "Product id is required.",
        "string.length": "Product id must be a valid mongoose id.",
      })
    ),
  });
  return schema.validate(cart);
};

export const validateRemoveFromCart = (cart: ICart) => {
  const schema = Joi.object({
    cartId: objectId.messages({
      "any.required": "cart id is required.",
      "string.length": "cart id must be a valid mongoose id.",
    }),
    productId: objectId.messages({
      "any.required": "product id is required.",
      "string.length": "product id must be a valid mongoose id.",
    }),
  });
  return schema.validate(cart);
};


export const validateCartId = (cart: ICart) => {
  const schema = Joi.object({
    cartId: objectId.messages({
      "any.required": "cart id is required.",
      "string.length": "cart id must be a valid mongoose id.",
    })
  });
  return schema.validate(cart);
};

