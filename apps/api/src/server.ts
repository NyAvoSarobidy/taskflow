import app from "./app";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(` Serveur en écoute sur http://localhost:${PORT}`);
      console.log(` Health check : http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error(" Impossible de démarrer le serveur :", error);
    process.exit(1);
  }
}

startServer();
