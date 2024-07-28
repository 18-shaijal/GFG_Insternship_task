import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchBarChartData } from '../apiService';

const TransactionsBarChart = ({ selectedMonth }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBarChartData(selectedMonth)
      .then(response => {
        console.log('Bar Chart Data:', response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching bar chart data:', error);
      });
  }, [selectedMonth]);

  return (
    <div>
      <h1>Bar Chart Stats - {selectedMonth}</h1>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="priceRange" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="itemCount" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default TransactionsBarChart;
