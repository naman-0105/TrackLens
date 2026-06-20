import { Router } from "express";
import { getHeatmapData } from "../controllers/heatmapController.js";

const router = Router();

router.get("/", getHeatmapData);

export default router;
