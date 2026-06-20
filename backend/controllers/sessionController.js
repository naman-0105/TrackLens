import * as analyticsService from "../services/analyticsService.js";

export const getSessions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      sortBy = "last_event",
      sortOrder = "desc",
    } = req.query;

    const result = await analyticsService.getSessions({
      page: Math.max(1, parseInt(page, 10) || 1),

      limit: Math.min(100, Math.max(1, parseInt(limit, 10) || 20)),

      search: String(search).trim(),
      sortBy: String(sortBy),
      sortOrder: String(sortOrder),
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSessionJourney = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    const journey = await analyticsService.getSessionJourney(sessionId);

    if (journey.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No events found for session "${sessionId}"`,
      });
    }

    return res.status(200).json({
      success: true,
      session_id: sessionId,
      data: journey,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
