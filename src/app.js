import express from "express";
import cors from "cors";
import connectDatabase from "./config/dbConnect.js";
import initializeRoutes from "./routes/router.js";

const connection = await connectDatabase();

connection.on("error", (erro) => {
  console.error("Error connecting to the database!", erro);
});

connection.once("open", () => {
  console.log(">> Database successfully connected!");
  console.log();
});

const app = express();

app.use(cors());

initializeRoutes(app);

export default app;
