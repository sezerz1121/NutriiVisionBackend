import { Router } from "express";
import { Scan } from "../controllers/scan.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/scan").post(
    upload.fields([
        {
            name:"imageScan",
            maxCount: 1
        }
    ]),Scan)


export default router