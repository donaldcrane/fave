import {Router} from "express";
import UserController from "../controllers/user";
import Authentication from "../middlewares/authenticate";
import validator from "../middlewares/validator";
import parser from "../middlewares/uploads";


import { validateSignup, validateLogin, validateProfile} from "../validations/user";

const router = Router();
const { verifyToken } = Authentication;
const {
  createUser, loginUser, uploadPicture, updateProfile
} = UserController;

router.post("/signin",validator(validateLogin), loginUser);
router.post("/signup", validator(validateSignup), createUser);

router.patch("/picture",verifyToken, parser.single("image"), uploadPicture);

router.patch("/profile", verifyToken,validator(validateProfile), updateProfile);

export default router;
