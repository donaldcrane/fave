import {Router} from "express";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import cartRoutes from "./cartRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/carts", cartRoutes);

export default router;
