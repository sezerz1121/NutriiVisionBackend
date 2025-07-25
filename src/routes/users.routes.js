import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken,authRedirect,getUserHistory,generateFoodReport} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
// router.route("/pdf").get(PDF);
router.route("/signin").post(loginUser);

//secured routes
router.route("/redirect").post(verfiyJWT,authRedirect);
router.route("/signout").post(verfiyJWT,logoutUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/getHistory").post(verfiyJWT,getUserHistory);
router.route("/getPdf").post(verfiyJWT,generateFoodReport);
export default router