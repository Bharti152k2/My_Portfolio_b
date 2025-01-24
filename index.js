const express = require("express");
const cors = require("cors");
const routes = require("./routes/contact.route");
const connectdb = require("./database/connectDB");
let app = express();
app.use(express.json());
app.use(cors());
app.use("/api", routes);
app.get('/', (req, res) => {
  res.send('Hello, Vercel!');
});
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