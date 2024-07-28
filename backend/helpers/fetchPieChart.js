const Product = require("../models/Product");

const fetchPieChart = async (numericMonth) => {
  const pieChartData = await Product.aggregate([
    {
      $match: {
        $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
      },
    },
    {
      $group: {
        _id: "$category",
        itemCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        itemCount: 1,
      },
    },
  ]);

  return pieChartData;
};

module.exports = fetchPieChart;
