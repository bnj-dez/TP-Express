import express from "express";
const router = express.Router();

import HomeController from "../controllers/home.js";
import RegisterController from "../controllers/register.js"
import LoginController from "../controllers/login.js"
import LoginFormController from "../controllers/loginForm.js"

router.get("/", HomeController);
router.post("/", RegisterController)

router.get("/login", LoginFormController)
router.post("/login", LoginController)

export default router;
