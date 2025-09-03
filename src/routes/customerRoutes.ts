import { Router } from "express";
import { createCustomer } from "../controllers/customerController";
import { authenticate } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

router.post("/", authenticate, requireRole("admin"), createCustomer);

export default router;
