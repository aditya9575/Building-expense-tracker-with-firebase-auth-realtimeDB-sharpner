import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./expensetracker.css";

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

  const userId = localStorage.getItem("userId");

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses/${userId}.json`
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
      console.error("Error fetching expenses from Firebase:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchExpenses();
    }
  }, [userId]);

  // Add new expense to Firebase
  const handleAddExpense = async (e) => {
    e.preventDefault();
    const newExpense = {
      description: expenseDesc,
      amount: parseFloat(expenseAmt),
      category: expenseCategory,
    };

    try {
      await axios.post(
        `https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses/${userId}.json`,
        newExpense
      );
      fetchExpenses(); // Fetch expenses after adding a new one
    } catch (err) {
      console.error("Error adding expense:", err);
    }

    setExpenseDesc("");
    setExpenseAmt("");
  };

  // Delete an expense from Firebase
  const handleExpenseDelete = async (deleteItemID) => {
    try {
      await axios.delete(
        `https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses/${userId}/${deleteItemID}.json`
      );
      fetchExpenses(); // Fetch expenses after deletion
    } catch (error) {
      console.error("Error deleting the item:", error);
    }
  };

  // Handle click to start editing an expense
  const handleEditClick = (item) => {
    setEditItemId(item.id);
    setEditDesc(item.description);
    setEditAmt(item.amount);
    setEditCat(item.category);
  };

  // Save the edited expense
  const handleExpenseEdit = async (e) => {
    e.preventDefault();
    const updatedExpense = {
      description: editDesc,
      amount: parseFloat(editAmt),
      category: editCat,
    };

    try {
      await axios.put(
        `https://sharpner-expensetracker-default-rtdb.firebaseio.com/expenses/${userId}/${editItemId}.json`,
        updatedExpense
      );
      fetchExpenses(); // Fetch updated expenses
      setEditItemId(null); // Reset editing state
    } catch (error) {
      console.error("Error editing the item:", error);
    }
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
                      <button onClick={handleExpenseEdit}>Save</button>
                    ) : (
                      <button onClick={() => handleEditClick(item)}>Edit</button>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleExpenseDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Your Expenses Total to: ₹{expenseTotal}</h2>
        </div>
      ) : (
        <h2>No Items Added Yet!</h2>
      )}
    </div>
  );
};

export default ExpensesTracker;
