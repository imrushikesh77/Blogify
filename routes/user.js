const express = require("express")
const router = express.Router();

const {getSignIn,
       getSignUp,
       postSignUp,
       postSignIn,
       getLogout
       } = require("../controller/user");

router.get("/signin",getSignIn);
router.get("/signup",getSignUp);
router.get("/logout",getLogout);
router.post("/signup",postSignUp);
router.post("/signin",postSignIn);

module.exports = router;