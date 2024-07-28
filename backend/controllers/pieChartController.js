const Product = require("../models/Product");

const pieChartController = async (req, res) => {
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

    const pieChartData = await Product.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth + 1] } } },
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 },
        },
      },
    ]);

    res.json(pieChartData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = pieChartController;
