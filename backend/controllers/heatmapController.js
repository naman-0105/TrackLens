import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import * as analyticsService from "../services/analyticsService.js";

export const getHeatmapData = asyncHandler(async (req, res) => {
  const { pageUrl } = req.query;

  if (!pageUrl) {
    throw new ApiError(400, "pageUrl query parameter is required");
  }

  const { points, clickCount, totalSessions, snapshot } =
    await analyticsService.getHeatmapData(String(pageUrl));

  res.status(200).json({
    success: true,
    page_url: pageUrl,
    click_count: clickCount,
    total_sessions: totalSessions,
    snapshot,
    data: points,
  });
});
