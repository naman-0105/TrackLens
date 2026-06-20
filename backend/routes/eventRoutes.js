import express from "express";
import { receiveEvents } from "../controllers/eventController.js";
import { validateEventPayload } from "../middleware/validateEvent.js";

const router = express.Router();

router.post("/", validateEventPayload, receiveEvents);

export default router;
