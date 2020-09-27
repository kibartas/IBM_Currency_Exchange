import LastFetchModel, { ILastFetch } from "../db/models/lastFetch";
import { initDB, initDBInformation } from "../db/startup";

export const init = async (): Promise<void> => {
  try {
    await initDB();
  } catch (e) {
    console.error(e);
    console.error("Failed to connect to DB. Exiting");
    process.exit(1);
  }
  let lastFetch: ILastFetch | null = await LastFetchModel.findOne({});
  if (
    lastFetch === null
  ) {
    await initDBInformation();
    await new LastFetchModel({ lastFetch: Date.now() }).save();
  } else if (lastFetch.lastFetch.getDay() !== new Date().getDay()) {
    await initDBInformation();
    await LastFetchModel.updateOne({}, { lastFetch: new Date(Date.now()) });
  }
};
