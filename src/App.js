import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/goals")
      .then((res) => res.json())
      .then((data) => setGoals(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleAddGoal = (e) => {
    e.preventDefault();

    const newGoal = {
      name,
      amount: parseFloat(amount),
      category,
      deadline,
      saved: 0
    };

    fetch("http://localhost:3000/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGoal)
    })
      .then((res) => res.json())
      .then((data) => {
        setGoals([...goals, data]);
        setName("");
        setAmount("");
        setCategory("");
        setDeadline("");
      })
      .catch((err) => console.error("POST error:", err));
  };

  const handleDeleteGoal = (id) => {
    fetch(`http://localhost:3000/goals/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setGoals(goals.filter((goal) => goal.id !== id));
      })
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <div className="container">
      <h1>Smart Goal Planner</h1>
      <form onSubmit={handleAddGoal} className="goal-form">
        <input
          type="text"
          placeholder="Enter your goal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Target amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button type="submit">Add Goal</button>
      </form>

      <div className="goal-list">
        {goals.map((goal) => (
          <div key={goal.id} className="goal-card">
            <h3>{goal.name}</h3>
            <p><strong>Target:</strong> ${goal.amount}</p>
            <p><strong>Saved:</strong> ${goal.saved}</p>
            <p><strong>Category:</strong> {goal.category}</p>
            <p><strong>Deadline:</strong> {goal.deadline}</p>
            <button onClick={() => handleDeleteGoal(goal.id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
