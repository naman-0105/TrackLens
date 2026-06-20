import PageSnapshot from "../models/PageSnapshot.js";
import { captureScreenshot } from "./snapshotService.js";

export const ensureSnapshotExists = async (pageUrl) => {
  let snapshot = await PageSnapshot.findOne({
    page_url: pageUrl,
  });

  if (snapshot) {
    return snapshot;
  }

  const screenshot = await captureScreenshot(pageUrl);

  snapshot = await PageSnapshot.create({
    page_url: pageUrl,
    snapshot: screenshot,
  });

  return snapshot;
};
