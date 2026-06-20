const VALID_EVENT_TYPES = ["page_view", "click"];

const findEventProblems = (event, index) => {
  const problems = [];

  const prefix = `events[${index}]`;

  if (!event || typeof event !== "object") {
    return [`${prefix} must be an object`];
  }

  if (!event.session_id || typeof event.session_id !== "string") {
    problems.push(`${prefix}.session_id is required and must be a string`);
  }

  if (!event.event_type || typeof event.event_type !== "string") {
    problems.push(`${prefix}.event_type is required and must be a string`);
  } else if (!VALID_EVENT_TYPES.includes(event.event_type)) {
    problems.push(
      `${prefix}.event_type must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
    );
  }

  if (!event.page_url || typeof event.page_url !== "string") {
    problems.push(`${prefix}.page_url is required and must be a string`);
  }

  if (!event.timestamp) {
    problems.push(`${prefix}.timestamp is required`);
  } else if (Number.isNaN(new Date(event.timestamp).getTime())) {
    problems.push(`${prefix}.timestamp must be a valid ISO date string`);
  }

  if (event.event_type === "click") {
    if (!event.click || typeof event.click !== "object") {
      problems.push(`${prefix}.click is required when event_type is "click"`);
    } else {
      if (typeof event.click.x !== "number") {
        problems.push(`${prefix}.click.x must be a number`);
      }

      if (typeof event.click.y !== "number") {
        problems.push(`${prefix}.click.y must be a number`);
      }
    }
  }

  return problems;
};

// Middleware for validating analytics events.
export const validateEventPayload = (req, res, next) => {
  const { body } = req;

  if (!body || typeof body !== "object") {
    return res.status(400).json({
      success: false,
      message: "Request body must be a JSON object",
    });
  }

  const events = Array.isArray(body.events) ? body.events : [body];

  if (events.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No events provided",
    });
  }

  if (events.length > 500) {
    return res.status(400).json({
      success: false,
      message: "A single batch cannot contain more than 500 events",
    });
  }

  const errors = events.flatMap((event, index) =>
    findEventProblems(event, index),
  );

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Event validation failed",
      errors,
    });
  }

  req.validatedEvents = events;

  next();
};
