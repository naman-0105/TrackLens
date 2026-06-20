import mongoose, { Schema } from "mongoose";

const clickSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: false },
);

const eventSchema = new Schema(
  {
    session_id: {
      type: String,
      required: [true, "session_id is required"],
      trim: true,
      index: true,
    },

    event_type: {
      type: String,
      required: [true, "event_type is required"],
      enum: {
        values: ["page_view", "click"],
        message: 'event_type must be either "page_view" or "click"',
      },
    },

    page_url: {
      type: String,
      required: [true, "page_url is required"],
      trim: true,
    },

    timestamp: {
      type: Date,
      required: [true, "timestamp is required"],
    },

    click: {
      type: clickSchema,
      default: undefined,
    },

    user_agent: {
      type: String,
    },

    referrer: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

eventSchema.index({
  session_id: 1,
  timestamp: 1,
});

eventSchema.index({
  page_url: 1,
  event_type: 1,
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
