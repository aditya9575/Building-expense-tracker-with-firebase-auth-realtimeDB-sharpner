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
  const [editItemId, setEditItemId] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [editAmt, setEditAmt] = useState("");
  const [editCat, setEditCat] = useState("food");
  

// fetching expense items from firebase 
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses.json"
      );

      const fetchedData = [];
      for (const key in response.data) {
        fetchedData.push({ id: key, ...response.data[key] });
      }
      setExpenses(fetchedData);

      const totalAmount = fetchedData.reduce(
        (total, expense) => total + parseFloat(expense.amount),
        0
      );
      setExpenseTotal(Math.floor(totalAmount));
    } catch (err) {
      console.log(
        "Error in fetching the expenses from firebase realtime database ->" + err
      );
    }
  };

//adding useEffect here to have the functionality of running the fetch function everytime we add a new product or the app reloads  
  useEffect(() => {
    fetchExpenses();
  }, []);

//adding expense to firebase 
  const handleAddExpense = async (e) => {
    e.preventDefault();
    const newExpense = {
      description: expenseDesc,
      amount: parseFloat(expenseAmt),
      category: expenseCategory,
    };

    try {
      await axios.post(
        "https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses.json",
        newExpense
      );
      fetchExpenses(); // Fetch expenses after adding a new one
    } catch (err) {
      console.log(err);
    }

    setExpenseDesc("");
    setExpenseAmt("");
  };

//deleting the expenses from firebase 
// ->copy the item id and after our file name add it and it should be just before .json method 
// and then ultimately send the delete request to it
const handleExpenseDelete = async (deleteItemID) => {
    try {
      const response = await axios.delete(
        `https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses/${deleteItemID}.json`
      );
      console.log(response);
      await fetchExpenses(); // Wait for expenses to be fetched after deletion
    } catch (error) {
      console.log("Error in deleting the item -> " + error);
    }
  };
  
// FOR EDITING WE JUST HAVE TO SEND A PUT REQUEST to that very item id so ->
// copy the item id and after our file name add it and it should be just before .json method 
const handleExpenseEdit = async () => {
    try {
      const updatedExpense = {
        description: editDesc,
        amount: parseFloat(editAmt),
        category: editCat,
      };

      await axios.put(
        `https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses/${editItemId}.json`,
        updatedExpense
      );
      await fetchExpenses();
      setEditItemId(null);
    } catch (error) {
      console.log("Error in editing the item -> " + error);
    }
  };

  const handleEditClick = (item) => {
    setEditItemId(item.id);
    setEditDesc(item.description);
    setEditAmt(item.amount);
    setEditCat(item.category);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
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
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.id}>
                  <td>
                    {editItemId === item.id ? (
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td>
                    {editItemId === item.id ? (
                      <input
                        type="number"
                        value={editAmt}
                        onChange={(e) => setEditAmt(e.target.value)}
                      />
                    ) : (
                      `₹${item.amount}`
                    )}
                  </td>
                  <td>
                    {editItemId === item.id ? (
                      <select
                        value={editCat}
                        onChange={(e) => setEditCat(e.target.value)}
                      >
                        <option value="food">Food</option>
                        <option value="petrol">Petrol</option>
                        <option value="groceries">Groceries</option>
                        <option value="emi">EMI</option>
                      </select>
                    ) : (
                      item.category
                    )}
                  </td>
                  <td>
                    {editItemId === item.id ? (
                      <button onClick={handleExpenseEdit}>Done</button>
                    ) : (
                      <button onClick={() => handleEditClick(item)}>Edit</button>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleExpenseDelete(item.id)}>Delete Item</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Your Expenses Total to: ₹{Math.floor(expenseTotal)}</h2>
        </div>
      ) : (
        <h2>No Items Added Yet!</h2>
      )}
    </div>
  );
};

export default ExpensesTracker;
