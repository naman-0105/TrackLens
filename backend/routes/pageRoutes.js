import { Router } from "express";
import { getPages } from "../controllers/pageController.js";

const router = Router();

router.get("/", getPages);

export default router;
