"use client";

import { useState } from "react";
import "./styles.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim() !== "") {
      setTasks([...tasks, { text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleTask = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1 className="title">To-Do List</h1>
      <div className="inputContainer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="input"
        />
        <button onClick={addTask} className="addButton">
          Add
        </button>
      </div>
      <ul className="list">
        {tasks.map((task, index) => (
          <li key={index} className="task">
            <span className={task.completed ? "completed" : ""}>
              {task.text}
            </span>
            <button onClick={() => toggleTask(index)}>
              {task.completed ? "Add to List" : "Complete"}
            </button>
            <button onClick={() => removeTask(index)} className="removeButton">
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
