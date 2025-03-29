const mongoose = require("mongoose");

function connectdb() {
  mongoose.connect(process.env.MONGODB_URI);
}
module.exports = connectdb;
