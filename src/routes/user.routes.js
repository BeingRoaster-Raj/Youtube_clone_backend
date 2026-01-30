import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateUserAvatar, 
    deleteUserAvatar, 
    changeCurrentUserPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload} from "../middlewares/Multer.middleware.js";
import { veriftJWT } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";

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
router.route("/update-avatar").patch(veriftJWT,upload.single("avatar"),updateUserAvatar) // to support both put and post methods in updating avatar
router.route("/delete-avatar").delete(veriftJWT,deleteUserAvatar) // delete user avatar route
router.route("/cover-image").patch(veriftJWT,upload.single("/coverImage"), updateUserCoverImage)
router.route("/change-password").post(veriftJWT,changeCurrentUserPassword) // change current user password route
router.route("/current-user").get(veriftJWT,getCurrentUser)
router.route("/update-account").patch(veriftJWT, updateAccountDetails) // update account details route
router.route("/c/:username").get(veriftJWT, getUserChannelProfile) // get user channel profile by username route
router.route("/history").get(veriftJWT, getWatchHistory)

export default router