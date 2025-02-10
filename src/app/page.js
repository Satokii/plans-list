"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import "./styles.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchTasks(user.id);
      }
    };
    checkUser();
  }, [router]);

  const fetchTasks = async (userId) => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId);
    if (!error) setTasks(data);
  };

  const addTask = async () => {
    if (!user || input.trim() === "") return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: input, completed: false, user_id: user.id }])
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="container">
      <h1 className="title">To-Do List</h1>
      <button className="log-out-btn" onClick={handleSignOut}>Log Out</button>
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
            <button className="complete-btn" onClick={() => toggleTask(task.id, task.completed)}>
              {task.completed ? "Add to List" : "Complete"}
            </button>
            <button
              onClick={() => removeTask(task.id)}
              className="remove-btn"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
