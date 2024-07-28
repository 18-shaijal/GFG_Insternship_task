const Product = require("../models/Product");

const fetchStatistics = async (numericMonth) => {
  const statistics = await Product.aggregate([
    {
      $match: {
        $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
      },
    },
    {
      $group: {
        _id: null,
        totalSaleAmount: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
        totalSoldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
        totalNotSoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } },
      },
    },
  ]);

  if (!statistics.length) {
    return { error: "No data found for the selected month." };
  }

  return {
    totalSaleAmount: statistics[0].totalSaleAmount || 0,
    totalSoldItems: statistics[0].totalSoldItems || 0,
    totalNotSoldItems: statistics[0].totalNotSoldItems || 0,
  };
};

module.exports = fetchStatistics;
