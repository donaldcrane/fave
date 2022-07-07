import { Router } from "express";
import ProductController from "../controllers/product";
import Authentication from "../middlewares/authenticate";
import validator from "../middlewares/validator";

import { validateProduct, validateUpdateProduct, validateProductId } from "../validations/product";

const router = Router();
const { verifyToken, verifyAdmin } = Authentication;
const {
  createProduct, getProducts, getProductById, deleteProduct, editProduct
} = ProductController;


router.post("/", verifyToken, verifyAdmin,  validator(validateProduct), createProduct);

router.get("/", verifyToken, getProducts);
router.get("/:productId", verifyToken, validator(validateProductId), getProductById);

router.patch("/:productId", verifyToken, verifyAdmin, validator(validateUpdateProduct), editProduct);
router.delete("/:productId", verifyToken, verifyAdmin, validator(validateProductId), deleteProduct);

export default router;
