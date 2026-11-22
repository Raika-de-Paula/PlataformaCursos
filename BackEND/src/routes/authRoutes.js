//src/routes/authRoutes

const express = require("express");
const router = express.Router();


const validateMiddleware = require("../middlewares/validateMiddleware");

const {
  registerValidator,
  loginValidator
} = require("../validators/authValidator");

const {
  register,
  login
} = require("../controllers/authController");

router.post(
    "/register",
    registerValidator,
    validateMiddleware,
    register);

router.post(
    "/login",
    loginValidator,
    validateMiddleware,
    login);

module.exports = router;