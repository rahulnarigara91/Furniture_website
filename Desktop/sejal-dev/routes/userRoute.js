const router = require("express").Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


router.post("/", userController.user_create); //registration
router.post("/login", userController.login);
router.get("/", userController.all_user);
router.get("/:userId", userController.user_details);
router.put("/:userId", userController.user_update);
router.delete("/:userId", userController.user_delete);

router.post("/forgotpassword", userController.forgotPassword);

router.post("/resetpassword", userController.resetPassword);

//router.post("/signup", userController.signup);
//router.use(authController.protect);
module.exports = router;
