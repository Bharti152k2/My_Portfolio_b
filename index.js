const express = require("express");
const cors = require("cors");
const routes = require("./routes/contact.route");
const connectdb = require("./database/connectDB");
const app = express();

// Single CORS configuration
app.use(
  cors({
    origin: ["https://my-portfolio-f-five.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", routes);

// Modified server startup for Vercel compatibility
const PORT = process.env.PORT;

let startServer = async () => {
  try {
    await connectdb();
    // console.log("MongoDB connected successfully");
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.log("Server Error:", error);
    throw error;
  }
};

startServer();
module.exports = app;
