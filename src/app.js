const express = require("express");
const api = require("./api");
const globalErrorHandler = require("./handler/errorHandler");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: (origin, callback) => {
    // Check if the origin starts with the allowed origin
    if (origin && origin.startsWith("https://desolint-frontend.vercel.app/")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running...",
  });
});

app.use("/api", api);
app.use(globalErrorHandler);

module.exports = app;
