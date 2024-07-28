const Product = require("../models/Product");

const fetchBarChart = async (numericMonth) => {
  const barChartData = await Product.aggregate([
    {
      $match: {
        $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
      },
    },
    {
      $bucket: {
        groupBy: "$price",
        boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
        default: "901-above",
        output: {
          itemCount: { $sum: 1 },
        },
      },
    },
    {
      $project: {
        _id: 0,
        priceRange: "$_id",
        itemCount: 1,
      },
    },
  ]);

  return barChartData;
};

module.exports = fetchBarChart;
