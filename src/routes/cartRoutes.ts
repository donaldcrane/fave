import { Router } from "express";
import CartController from "../controllers/cart";
import Authentication from "../middlewares/authenticate";
import validator from "../middlewares/validator";

import { validateAddToCart, validateRemoveFromCart, validateCartId } from "../validations/cart";

const router = Router();
const { verifyToken } = Authentication;
const {
  addProductToCart, removeProductFromCart, deleteCart, getUserCart
} = CartController;


router.get("/", verifyToken, getUserCart);

router.patch("/product", verifyToken, validator(validateAddToCart), addProductToCart);
router.patch("/remove", verifyToken, validator(validateRemoveFromCart), removeProductFromCart);

router.delete("/:cartId", verifyToken, validator(validateCartId), deleteCart);

export default router;
