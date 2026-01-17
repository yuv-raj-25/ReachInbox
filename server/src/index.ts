import app from './app.js'
import { connectDB } from "./db/index.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to start server due to DB connection issue:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

startServer();