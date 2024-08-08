import React, { useEffect, useState } from "react";
import "./expensetracker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExpensesTracker = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmt, setExpenseAmt] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("food");
  const [expenseTotal, setExpenseTotal] = useState(0);

  useEffect(() => {
    axios
      .get(
        "https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses.json"
      )
      .then((response) => {
        // console.log(response.data);
        const fetchedData = [];
        for (const key in response.data) {
          //we are extracting the values from the use of a key , response.data[key]->the response that came it spreads it and extracts the data
          //of that very key from it
          fetchedData.push({ id: key, ...response.data[key] });
        }
        console.log(fetchedData.amount)
        setExpenses(fetchedData);
        
        const totalAmount = fetchedData.reduce((total, expense) => total + parseFloat(expense.amount), 0);
        setExpenseTotal(Math.floor(totalAmount));
      })
      .catch((err) => {
        console.log("Error in fetching the expenses from firebase realtime database ->" + err );
        });
  }, []);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Math.random(),
      description: expenseDesc,
      amount: parseFloat(expenseAmt),
      category: expenseCategory,
    };

    // here we send post request to the firebase realtime database api end point and define our file name where we want to store the above
    axios.post(
        "https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses.json", newExpense
      )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });

    setExpenseDesc("");
    setExpenseAmt("");
    //this is handling the data without the database 
    // setExpenses([...expenses, newExpense]);
    // setExpenseTotal((prevTotal) => Math.floor(prevTotal + newExpense.amount)); // Using Math.floor
  };

  return (
    <div>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </button>
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
                  <td>₹{item.amount}</td>
                  <td>{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Your Expenses Total to: ₹{Math.floor(expenseTotal)}</h2>{" "}
          {/* Using Math.floor */}
        </div>
      ) : (
        <h2>No Items Added Yet!</h2>
      )}
    </div>
  );
};

export default ExpensesTracker;
