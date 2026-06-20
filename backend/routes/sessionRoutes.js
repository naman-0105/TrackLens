import { Router } from "express";
import {
  getSessions,
  getSessionJourney,
} from "../controllers/sessionController.js";

const router = Router();

router.get("/", getSessions);
router.get("/:sessionId", getSessionJourney);

export default router;
