import asyncHandler from "../utils/asyncHandler.js";
import * as analyticsService from "../services/analyticsService.js";

export const getPages = asyncHandler(async (req, res) => {
  const pages = await analyticsService.getDistinctPages();

  res.status(200).json({
    success: true,
    data: pages,
  });
});

export const getOverviewStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getOverviewStats();

  res.status(200).json({
    success: true,
    ...stats,
  });
});
