const Product = require("../models/Product");

const transactionsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const search = req.query.search ? req.query.search.toLowerCase() : "";
    const selectedMonth = (req.query.month || "march").toLowerCase();

    const monthMap = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };

    const numericMonth = monthMap[selectedMonth];

    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    if (!isNaN(parseFloat(search))) {
      query.$or.push({ price: parseFloat(search) });
    }

    const transactions = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({ page, perPage, transactions });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = transactionsController;
