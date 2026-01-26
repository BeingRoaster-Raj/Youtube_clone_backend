import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload} from "../middlewares/Multer.middleware.js";
import { veriftJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

// Secured Routes 
router.route("/logout").post(veriftJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)  // to be implemented


export default router