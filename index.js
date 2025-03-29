const express = require("express");
const cors = require("cors");
const routes = require("./routes/contact.route");
const connectdb = require("./database/connectDB");
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ["https://my-portfolio-f-five.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());
app.use(
  cors({
    origin: "https://my-portfolio-f-five.vercel.app", 
    methods: "GET, POST", 
  })
);
app.use("/api", routes);

let startServer = async () => {
  try {
    await connectdb();
    console.log("MongoDB connected successfully");
    app.listen(5001, () => {
      console.log(`Server is running on port 5001`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
module.exports = app;
