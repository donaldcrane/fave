import Joi from "joi";
import { IProduct } from '../utils/interface';
import objectId from "./common";

export const validateProduct = (product: IProduct) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required()
  });
  return schema.validate(product);
};

export const validateUpdateProduct = (product: IProduct) => {
  const schema = Joi.object({
    name: Joi.string(),
    price: Joi.number(),
    quantity: Joi.number(),
    productId: objectId.messages({
      "any.required": "Product id is required.",
      "string.length": "Product id must be a valid mongoose id.",
    }),
  });
  return schema.validate(product);
};


export const validateProductId = (product: IProduct) => {
  const schema = Joi.object({
    productId: objectId.messages({
      "any.required": "Product id is required.",
      "string.length": "Product id must be a valid mongoose id.",
    }),
  });
  return schema.validate(product);
};

