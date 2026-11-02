import { Router } from "express";
import validate from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import { loginSchema } from "../validators/auth.validator.js";
import { login, getMe, refresh } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);
router.post("/refresh", refresh);

export default router;
