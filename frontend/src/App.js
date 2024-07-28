// src/App.js
import React, { useState } from 'react';
import './App.css';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/TransactionsStatistics';
import TransactionsBarChart from './components/TransactionsBarChart';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="App">
      <div className='oval'>
      <h1 className='main'> Transaction Dashboard</h1>
      </div>
      
      <div className='head' style={{display:'flex'}}>
        <input
          type="text"
          placeholder="Search transaction"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <TransactionsTable selectedMonth={selectedMonth} searchTerm={searchTerm} />
      <Statistics selectedMonth={selectedMonth} />
      <TransactionsBarChart selectedMonth={selectedMonth} />
    </div>
  );
};

export default App;
