import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../apiService';

const TransactionsTable = ({ selectedMonth, searchTerm }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchTransactions(selectedMonth, searchTerm, page, perPage)
      .then(response => {
        console.log('Transactions:', response.data.transactions);
        setTransactions(response.data.transactions);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, [selectedMonth, searchTerm, page, perPage]);

  return (
    <div style={{display:'flex' , flexDirection:'column' ,gap:'10px',flexWrap:'wrap'}}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{transaction._id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td><img src={transaction.image} alt={transaction.title} width="50" /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{display:"flex",justifyContent:'space-between'}}>
        <span> Page No: {page} </span>
        <div>
        <button onClick={() => setPage(prev => prev > 1 ? prev - 1 : 1)}>Previous</button>
       
       <button onClick={() => setPage(prev => prev + 1)}>Next</button>
        </div>
        
        <span>Per Page: 10</span>
      </div>

    </div>
  );
};

export default TransactionsTable;
