const contactData = require("../model/contact.model");

//^ DEFAULT API

let defaultRoute = async (req, res) => {
  console.log("Hii connected");
};

//^ POST CONTACT API = TO POST THE CONTACT INFO
let contactApi = async (req, res, next) => {
  console.log("post api for contact form"); 
};

module.exports = {
  defaultRoute,
  contactApi,
};
