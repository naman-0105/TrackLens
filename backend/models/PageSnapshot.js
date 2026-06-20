import mongoose from "mongoose";

const pageSnapshotSchema = new mongoose.Schema(
  {
    page_url: {
      type: String,
      required: true,
      unique: true,
    },

    snapshot: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PageSnapshot",
  pageSnapshotSchema
);