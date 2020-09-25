import mongoose from "mongoose";

// initDB
export default async (): Promise<void> => {
  while (true) {
    try {
      await mongoose.connect(process.env.MONGO_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
      break;
    } catch {
      console.error("Failed to connect to DB. Retrying");
      setTimeout(() => {}, 1000);
    }
  }
};
