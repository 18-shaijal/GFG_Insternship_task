const Product = require("../models/Product");

const fetchTransactions = async (numericMonth, search, page, perPage) => {
  const matchStage = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
  };

  if (search) {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: { $regex: search, $options: "i" } },
    ];
  }

  const transactionsData = await Product.aggregate([
    { $match: matchStage },
    { $skip: (page - 1) * perPage },
    { $limit: perPage },
  ]);

  return { page, perPage, transactions: transactionsData };
};

module.exports = fetchTransactions;
