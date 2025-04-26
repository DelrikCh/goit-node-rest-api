import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import contactsRouter from "./routes/contactsRouter.js";
import Contact from "./db/models/contacts.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const syncDb = async () => {
  console.log("Connecting to database...");
  try {
    await Contact.sync({ alter: true });
    console.log("Tables synced!");
  } catch (error) {
    console.error("DB sync error:", error.message);
  }
};

syncDb();

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
