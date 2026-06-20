import Event from "../models/Event.js";
import PageSnapshot from "../models/PageSnapshot.js";

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getSessions = async ({
  page = 1,
  limit = 20,
  search = "",
  sortBy = "last_event",
  sortOrder = "desc",
}) => {
  const matchStage = search
    ? {
        session_id: {
          $regex: escapeRegex(search),
          $options: "i",
        },
      }
    : {};

  const validSortFields = [
    "total_events",
    "session_duration",
    "first_event",
    "last_event",
  ];

  const sortField = validSortFields.includes(sortBy) ? sortBy : "last_event";

  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const pipeline = [
    ...(search ? [{ $match: matchStage }] : []),

    {
      $group: {
        _id: "$session_id",

        total_events: {
          $sum: 1,
        },

        first_event: {
          $min: "$timestamp",
        },

        last_event: {
          $max: "$timestamp",
        },

        total_clicks: {
          $sum: {
            $cond: [
              {
                $eq: ["$event_type", "click"],
              },
              1,
              0,
            ],
          },
        },

        total_page_views: {
          $sum: {
            $cond: [
              {
                $eq: ["$event_type", "page_view"],
              },
              1,
              0,
            ],
          },
        },

        pages_visited: {
          $addToSet: "$page_url",
        },
      },
    },

    {
      $addFields: {
        session_id: "$_id",

        session_duration: {
          $divide: [
            {
              $subtract: ["$last_event", "$first_event"],
            },
            1000,
          ],
        },
      },
    },

    {
      $project: {
        _id: 0,
      },
    },

    {
      $sort: {
        [sortField]: sortDirection,
      },
    },

    {
      $facet: {
        data: [
          {
            $skip: (pageNumber - 1) * limitNumber,
          },
          {
            $limit: limitNumber,
          },
        ],

        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    },
  ];

  const result = await Event.aggregate(pipeline);

  const data = result[0]?.data || [];

  const totalCount = result[0]?.totalCount?.[0]?.count || 0;

  return {
    data,

    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalCount,

      totalPages: Math.ceil(totalCount / limitNumber) || 1,
    },
  };
};

export const getSessionJourney = async (sessionId) => {
  return Event.find({
    session_id: sessionId,
  })
    .sort({
      timestamp: 1,
    })
    .select("event_type page_url timestamp click -_id")
    .lean();
};

export const getHeatmapData = async (pageUrl) => {
  const [points, sessionStats, snapshot] = await Promise.all([
    Event.find({
      page_url: pageUrl,
      event_type: "click",
    })
      .select("click.x click.y -_id")
      .lean(),

    Event.aggregate([
      {
        $match: {
          page_url: pageUrl,
        },
      },
      {
        $group: {
          _id: null,
          sessions: {
            $addToSet: "$session_id",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSessions: {
            $size: "$sessions",
          },
        },
      },
    ]),

    PageSnapshot.findOne({
      page_url: pageUrl,
    }).lean(),
  ]);

  return {
    snapshot: snapshot?.snapshot,

    points: points
      .map((event) => ({
        x: event.click?.x,
        y: event.click?.y,
      }))
      .filter((point) => point.x != null && point.y != null),

    clickCount: points.length,

    totalSessions: sessionStats[0]?.totalSessions || 0,
  };
};

export const getDistinctPages = async () => {
  const pages = await Event.distinct("page_url");

  return pages.sort();
};

export const getOverviewStats = async () => {
  const [totals, topPages, eventDistribution] = await Promise.all([
    Event.aggregate([
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalClicks: {
            $sum: { $cond: [{ $eq: ["$event_type", "click"] }, 1, 0] },
          },
          totalPageViews: {
            $sum: { $cond: [{ $eq: ["$event_type", "page_view"] }, 1, 0] },
          },
          sessions: { $addToSet: "$session_id" },
        },
      },
      {
        $project: {
          _id: 0,
          totalEvents: 1,
          totalClicks: 1,
          totalPageViews: 1,
          totalSessions: { $size: "$sessions" },
        },
      },
    ]),
    Event.aggregate([
      { $group: { _id: "$page_url", visits: { $sum: 1 } } },
      { $sort: { visits: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, page_url: "$_id", visits: 1 } },
    ]),
    Event.aggregate([
      { $group: { _id: "$event_type", count: { $sum: 1 } } },
      { $project: { _id: 0, event_type: "$_id", count: 1 } },
    ]),
  ]);

  return {
    summary: totals[0] || {
      totalEvents: 0,
      totalClicks: 0,
      totalPageViews: 0,
      totalSessions: 0,
    },
    topPages,
    eventDistribution,
  };
};
