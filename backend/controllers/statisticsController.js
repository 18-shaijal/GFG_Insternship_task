const Product = require("../models/Product");

const statisticsController = async (req, res) => {
  try {
    const selectedMonth = req.query.month || "march";

    const monthMap = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };

    const numericMonth = monthMap[selectedMonth.toLowerCase()];

    const statistics = await Product.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth + 1] } } },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
          totalSoldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
          totalNotSoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      selectedMonth,
      totalSaleAmount: statistics[0].totalSaleAmount || 0,
      totalSoldItems: statistics[0].totalSoldItems || 0,
      totalNotSoldItems: statistics[0].totalNotSoldItems || 0,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = statisticsController;
