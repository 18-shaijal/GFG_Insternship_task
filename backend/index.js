
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const axios = require("axios");

// const app = express();
// app.use(cors());
// app.use(express.json());
// require('dotenv').config();

// const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

// // MongoDB connection
// mongoose.connect(process.env.DATABASE_URL, {
// }) .then(() => {
//        console.log('Connected to MongoDB!');
//       })
//       .catch((err) => {
//         console.log(err);
//       });;

// const productSchema = new mongoose.Schema({
//   title: String,
//   price: Number,
//   description: String,
//   category: String,
//   image: String,
//   sold: Boolean,
//   dateOfSale: Date,
// });

// const Product = mongoose.model("Product", productSchema);

// const seedDatabase = async () => {
//   try {
//     const response = await axios.get(url);
//     const jsonData = response.data;

//     await Product.deleteMany({});
//     await Product.insertMany(jsonData);

//     console.log("Database initialized with seed data.");
//   } catch (error) {
//     console.error("Error fetching data from the URL:", error.message);
//   }
// };

// seedDatabase();

// app.listen(process.env.PORT, () => {
//   console.log("Server Started ");
// });

// // API to list all transactions with search and pagination
// app.get("/transactions", async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const perPage = parseInt(req.query.perPage) || 10;
//       const search = req.query.search ? req.query.search.toLowerCase() : "";
//       const selectedMonth = (req.query.month || "march").toLowerCase();
  
//       const monthMap = {
//         january: 1,
//         february: 2,
//         march: 3,
//         april: 4,
//         may: 5,
//         june: 6,
//         july: 7,
//         august: 8,
//         september: 9,
//         october: 10,
//         november: 11,
//         december: 12,
//       };
  
//       const numericMonth = monthMap[selectedMonth];
  
//       const query = {
//         $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
//         $or: [
//           { title: { $regex: search, $options: "i" } },
//           { description: { $regex: search, $options: "i" } },
//         ],
//       };
  
//       if (!isNaN(parseFloat(search))) {
//         query.$or.push({ price: parseFloat(search) });
//       }
  
//       const transactions = await Product.find(query)
//         .skip((page - 1) * perPage)
//         .limit(perPage);
  
//       res.json({ page, perPage, transactions });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// // API to get statistics for a selected month
// app.get("/statistics", async (req, res) => {
//   try {
//     const selectedMonth = req.query.month || "march";

//     const monthMap = {
//       january: 0,
//       february: 1,
//       march: 2,
//       april: 3,
//       may: 4,
//       june: 5,
//       july: 6,
//       august: 7,
//       september: 8,
//       october: 9,
//       november: 10,
//       december: 11,
//     };

//     const numericMonth = monthMap[selectedMonth.toLowerCase()];

//     const statistics = await Product.aggregate([
//       { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth + 1] } } },
//       {
//         $group: {
//           _id: null,
//           totalSaleAmount: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
//           totalSoldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
//           totalNotSoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } },
//         },
//       },
//     ]);

//     res.json({
//       selectedMonth,
//       totalSaleAmount: statistics[0].totalSaleAmount || 0,
//       totalSoldItems: statistics[0].totalSoldItems || 0,
//       totalNotSoldItems: statistics[0].totalNotSoldItems || 0,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get('/bar-chart', async (req, res) => {
//   try {
//     const selectedMonth = req.query.month || 'march';

//     // Convert month names to numbers
//     const monthMap = {
//       'january': '01',
//       'february': '02',
//       'march': '03',
//       'april': '04',
//       'may': '05',
//       'june': '06',
//       'july': '07',
//       'august': '08',
//       'september': '09',
//       'october': '10',
//       'november': '11',
//       'december': '12',
//     };

//     if (!selectedMonth) {
//       return res.status(400).json({ error: 'Month parameter is required.' });
//     }

//     const numericMonth = monthMap[selectedMonth.toLowerCase()];

//     const priceRanges = [
//       { range: '0 - 100', min: 0, max: 100 },
//       { range: '101 - 200', min: 101, max: 200 },
//       { range: '201 - 300', min: 201, max: 300 },
//       { range: '301 - 400', min: 301, max: 400 },
//       { range: '401 - 500', min: 401, max: 500 },
//       { range: '501 - 600', min: 501, max: 600 },
//       { range: '601 - 700', min: 601, max: 700 },
//       { range: '701 - 800', min: 701, max: 800 },
//       { range: '801 - 900', min: 801, max: 900 },
//       { range: '901-above', min: 901, max: Number.MAX_VALUE },
//     ];

//     const startDate = new Date(`2022-${numericMonth}-01`); // Assuming year 2022 for consistency
//     const endDate = new Date(startDate);
//     endDate.setMonth(endDate.getMonth() + 1);

//     const promises = priceRanges.map(async (range) => {
//       const count = await Product.countDocuments({
//         dateOfSale: { $gte: startDate, $lt: endDate },
//         price: { $gte: range.min, $lt: range.max },
//       });
//       return { priceRange: range.range, itemCount: count };
//     });

//     const barChartData = await Promise.all(promises);

//     res.json(barChartData);
//   } catch (e) {
//     console.error(e.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // API to get pie chart data for a selected month
// app.get("/pie-chart", async (req, res) => {
//   try {
//     const selectedMonth = req.query.month || "march";

//     const monthMap = {
//       january: 0,
//       february: 1,
//       march: 2,
//       april: 3,
//       may: 4,
//       june: 5,
//       july: 6,
//       august: 7,
//       september: 8,
//       october: 9,
//       november: 10,
//       december: 11,
//     };

//     const numericMonth = monthMap[selectedMonth.toLowerCase()];

//     const pieChartData = await Product.aggregate([
//       { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth + 1] } } },
//       {
//         $group: {
//           _id: "$category",
//           itemCount: { $sum: 1 },
//         },
//       },
//     ]);

//     res.json(pieChartData);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/combined-response", async (req, res) => {
//     try {
//       const selectedMonth = (req.query.month || "march").toLowerCase();
//       const { search = "", page = 1, perPage = 10 } = req.query;
  
//       const monthMap = {
//         january: 1,
//         february: 2,
//         march: 3,
//         april: 4,
//         may: 5,
//         june: 6,
//         july: 7,
//         august: 8,
//         september: 9,
//         october: 10,
//         november: 11,
//         december: 12,
//       };
  
//       const numericMonth = monthMap[selectedMonth.toLowerCase()];
  
//       console.log("Fetching transactions...");
//       const transactionsData = await fetchTransactions(numericMonth, search, page, perPage);
//       console.log("Transactions fetched:", transactionsData.length);
  
//       console.log("Fetching statistics...");
//       const statisticsData = await fetchStatistics(numericMonth);
//       console.log("Statistics fetched:", statisticsData);
  
//       console.log("Fetching bar chart data...");
//       const barChartData = await fetchBarChart(numericMonth);
//       console.log("Bar chart data fetched:", barChartData);
  
//       console.log("Fetching pie chart data...");
//       const pieChartData = await fetchPieChart(numericMonth);
//       console.log("Pie chart data fetched:", pieChartData);
  
//       const combinedResponse = {
//         transactions: transactionsData,
//         statistics: statisticsData,
//         barChart: barChartData,
//         pieChart: pieChartData,
//       };
  
//       res.json(combinedResponse);
//     } catch (error) {
//       console.error("Error in /combined-response:", error.message);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });


  
// async function fetchTransactions(numericMonth, search, page, perPage) {
//     const matchStage = {
//         $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] }
//     };

//     if (search) {
//         matchStage.$or = [
//             { title: { $regex: search, $options: 'i' } },
//             { description: { $regex: search, $options: 'i' } },
//             { price: { $regex: search, $options: 'i' } }
//         ];
//     }

//     const transactionsData = await Product.aggregate([
//         { $match: matchStage },
//         { $skip: (page - 1) * perPage },
//         { $limit: perPage }
//     ]);

//     return { page, perPage, transactions: transactionsData };
// }

// async function fetchStatistics(numericMonth) {
//     const statistics = await Product.aggregate([
//         {
//             $match: {
//                 $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] }
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalSaleAmount: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
//                 totalSoldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
//                 totalNotSoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } }
//             }
//         }
//     ]);

//     if (!statistics.length) {
//         return { error: 'No data found for the selected month.' };
//     }

//     return {
//         totalSaleAmount: statistics[0].totalSaleAmount || 0,
//         totalSoldItems: statistics[0].totalSoldItems || 0,
//         totalNotSoldItems: statistics[0].totalNotSoldItems || 0
//     };
// }

// async function fetchBarChart(numericMonth) {
//     const barChartData = await Product.aggregate([
//         {
//             $match: {
//                 $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] }
//             }
//         },
//         {
//             $bucket: {
//                 groupBy: "$price",
//                 boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
//                 default: "901-above",
//                 output: {
//                     itemCount: { $sum: 1 }
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 priceRange: "$_id",
//                 itemCount: 1
//             }
//         }
//     ]);

//     return barChartData;
// }

// async function fetchPieChart(numericMonth) {
//     const pieChartData = await Product.aggregate([
//         {
//             $match: {
//                 $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] }
//             }
//         },
//         {
//             $group: {
//                 _id: "$category",
//                 itemCount: { $sum: 1 }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 category: "$_id",
//                 itemCount: 1
//             }
//         }
//     ]);

//     return pieChartData;
// }

//   module.exports = app;
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file

// const db = require("./db");
const seedDatabase = require("./controllers/seedDatabase");
const transactionsController = require("./controllers/transactionsController");
const statisticsController = require("./controllers/statisticsController");
const barChartController = require("./controllers/barChartController");
const pieChartController = require("./controllers/pieChartController");
const combinedResponseController = require("./controllers/combinedResponseController");

const app = express();
app.use(cors());
app.use(express.json());




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});



  mongoose.connect(process.env.DATABASE_URL, {})
    .then(() => {
      console.log('Connected to MongoDB!');
    })
    .catch((err) => {
      console.error(err);
    });

seedDatabase();

app.get("/transactions", transactionsController);
app.get("/statistics", statisticsController);
app.get("/bar-chart", barChartController);
app.get("/pie-chart", pieChartController);
app.get("/combined-response", combinedResponseController);

// module.exports = index;
