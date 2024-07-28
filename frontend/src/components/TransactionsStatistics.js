import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../apiService';

const Statistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics(selectedMonth)
      .then(response => {
        console.log('Statistics:', response.data);
        setStatistics(response.data);
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
      });
  }, [selectedMonth]);

  return (
    <div >
      <h1>Statistics - {selectedMonth}</h1>
      <div style={{width:'80%',background:'rgb(250, 226, 168)',padding:'4%', borderRadius:'8%',gap:'0px'}}>
      <p>Total Sale: {statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
      </div>
      
    </div>
  );
};

export default Statistics;
