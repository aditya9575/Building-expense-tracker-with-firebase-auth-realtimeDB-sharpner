import React, { useState } from 'react';
import './expensetracker.css';
import { useNavigate } from 'react-router-dom';

const ExpensesTracker = () => {
  const navigate = useNavigate();  

  const [expenses, setExpenses] = useState([]);
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmt, setExpenseAmt] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("food");
  const [expenseTotal, setExpenseTotal] = useState(0);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Math.random(),
      description: expenseDesc,
      amount: parseFloat(expenseAmt),
      category: expenseCategory,
    };
    setExpenses([...expenses, newExpense]);
    setExpenseDesc("");
    setExpenseAmt("");
    setExpenseTotal(prevTotal => Math.floor(prevTotal + newExpense.amount)); // Using Math.floor
  };

  return (
    <div>
    <button onClick={()=>{navigate(-1)}}>Back</button>
      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          required
          placeholder="Enter Your Expense Description"
          value={expenseDesc}
          onChange={(e) => setExpenseDesc(e.target.value)}
        />
        <input
          type="number"
          required
          placeholder="Enter The Expense Amount"
          value={expenseAmt}
          onChange={(e) => setExpenseAmt(e.target.value)}
        />
        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        >
          <option value="food">Food</option>
          <option value="petrol">Petrol</option>
          <option value="groceries">Groceries</option>
          <option value="emi">EMI</option>
        </select>
        <button type="submit">Add Expense</button>
      </form>

      {expenses.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>${item.amount}</td>
                  <td>{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Your Expenses Total to: ${Math.floor(expenseTotal)}</h2> {/* Using Math.floor */}
        </div>
      ) : (
        <h2>No Items Added Yet!</h2>
      )}
    </div>
  );
};

export default ExpensesTracker;
