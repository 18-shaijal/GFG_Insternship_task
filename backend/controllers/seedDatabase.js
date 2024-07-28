const axios = require("axios");
const Product = require("../models/Product");

const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

const seedDatabase = async () => {
  try {
    const response = await axios.get(url);
    const jsonData = response.data;

    await Product.deleteMany({});
    await Product.insertMany(jsonData);

    console.log("Database initialized with seed data.");
  } catch (error) {
    console.error("Error fetching data from the URL:", error.message);
  }
};

module.exports = seedDatabase;
