import Event from "../models/Event.js";
import { getIO } from "../socket.js";
import { ensureSnapshotExists } from "../services/pageSnapshotManager.js";

export const receiveEvents = async (req, res, next) => {
  try {
    const events = req.validatedEvents;

    const documents = events.map((event) => ({
      session_id: event.session_id,
      event_type: event.event_type,
      page_url: event.page_url,
      timestamp: new Date(event.timestamp),

      ...(event.event_type === "click" && {
        click: {
          x: event.click.x,
          y: event.click.y,
        },
      }),

      ...(event.user_agent && {
        user_agent: event.user_agent,
      }),

      ...(event.referrer && {
        referrer: event.referrer,
      }),
    }));

    const insertedEvents = await Event.insertMany(documents, {
      ordered: false,
    });

    // Generate snapshots for page_view events
    const pageViewEvents = events.filter((event) => event.event_type === "page_view");
    const uniquePageUrls = [...new Set(pageViewEvents.map((event) => event.page_url))];

    Promise.all(uniquePageUrls.map((pageUrl) => ensureSnapshotExists(pageUrl))).catch(
      (error) => console.error("[Event] Error generating snapshots:", error)
    );

    const io = getIO();
    const clientCount = io.engine.clientsCount;
    console.log(`[Event] ${insertedEvents.length} events inserted, broadcasting to ${clientCount} connected clients`);
    
    io.sockets.emit("analytics:update", {
      count: insertedEvents.length,
      timestamp: new Date().toISOString(),
    });
    console.log(`[Event] Broadcast sent with event ID: analytics:update`);

    return res.status(201).json({
      success: true,
      message: `${insertedEvents.length} event(s) recorded`,
      count: insertedEvents.length,
    });
  } catch (error) {
    next(error);
  }
};
