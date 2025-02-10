"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "./styles.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setTasks(data);
  };

  const addTask = async () => {
    if (input.trim() === "") return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: input, completed: false }])
      .select();
      
    if (!error) {
      setTasks([data[0], ...tasks]);
      setInput("");
    }
  };

  const toggleTask = async (id, completed) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .match({ id });
    if (!error) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
    }
  };
  const removeTask = async (id) => {
    const { error } = await supabase.from("todos").delete().match({ id });
    if (!error) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
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
        {tasks.map((task) => (
          <li key={task.id} className="task">
            <span className={task.completed ? "completed" : ""}>
              {task.text}
            </span>
            <button onClick={() => toggleTask(task.id, task.completed)}>
              {task.completed ? "Add to List" : "Complete"}
            </button>
            <button onClick={() => removeTask(task.id)} className="removeButton">
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
