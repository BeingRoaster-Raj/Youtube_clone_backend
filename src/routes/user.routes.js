import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatar, deleteUserAvatar } from "../controllers/user.controller.js";
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
router.route("/update-avatar")
.put(veriftJWT,upload.single("avatar"),updateUserAvatar)
.post(veriftJWT,upload.single("avatar"),updateUserAvatar)  // to support both put and post methods in updating avatar

router.route("/delete-avatar").delete(veriftJWT,deleteUserAvatar) // delete user avatar route

export default router