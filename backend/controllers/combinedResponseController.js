const fetchTransactions = require("../helpers/fetchTransactions");
const fetchStatistics = require("../helpers/fetchStatistics");
const fetchBarChart = require("../helpers/fetchBarChart");
const fetchPieChart = require("../helpers/fetchPieChart");

const combinedResponseController = async (req, res) => {
  try {
    const selectedMonth = (req.query.month || "march").toLowerCase();
    const { search = "", page = 1, perPage = 10 } = req.query;

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

    const numericMonth = monthMap[selectedMonth.toLowerCase()];

    console.log("Fetching transactions...");
    const transactionsData = await fetchTransactions(numericMonth, search, page, perPage);
    console.log("Transactions fetched:", transactionsData.length);

    console.log("Fetching statistics...");
    const statisticsData = await fetchStatistics(numericMonth);
    console.log("Statistics fetched:", statisticsData);

    console.log("Fetching bar chart data...");
    const barChartData = await fetchBarChart(numericMonth);
    console.log("Bar chart data fetched:", barChartData);

    console.log("Fetching pie chart data...");
    const pieChartData = await fetchPieChart(numericMonth);
    console.log("Pie chart data fetched:", pieChartData);

    const combinedResponse = {
      transactions: transactionsData,
      statistics: statisticsData,
      barChart: barChartData,
      pieChart: pieChartData,
    };

    res.json(combinedResponse);
  } catch (error) {
    console.error("Error in /combined-response:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = combinedResponseController;
