const Product = require("../models/Product");

const barChartController = async (req, res) => {
  try {
    const selectedMonth = req.query.month || 'march';

    const monthMap = {
      'january': '01',
      'february': '02',
      'march': '03',
      'april': '04',
      'may': '05',
      'june': '06',
      'july': '07',
      'august': '08',
      'september': '09',
      'october': '10',
      'november': '11',
      'december': '12',
    };

    const numericMonth = monthMap[selectedMonth.toLowerCase()];

    const priceRanges = [
      { range: '0 - 100', min: 0, max: 100 },
      { range: '101 - 200', min: 101, max: 200 },
      { range: '201 - 300', min: 201, max: 300 },
      { range: '301 - 400', min: 301, max: 400 },
      { range: '401 - 500', min: 401, max: 500 },
      { range: '501 - 600', min: 501, max: 600 },
      { range: '601 - 700', min: 601, max: 700 },
      { range: '701 - 800', min: 701, max: 800 },
      { range: '801 - 900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Number.MAX_VALUE },
    ];

    const startDate = new Date(`2022-${numericMonth}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const promises = priceRanges.map(async (range) => {
      const count = await Product.countDocuments({
        dateOfSale: { $gte: startDate, $lt: endDate },
        price: { $gte: range.min, $lt: range.max },
      });
      return { priceRange: range.range, itemCount: count };
    });

    const barChartData = await Promise.all(promises);

    res.json(barChartData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = barChartController;
