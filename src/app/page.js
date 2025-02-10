"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import "./styles.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

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
      .insert([
        {
          text: input,
          description: taskDescription,
          completed: false,
          user_id: user.id,
        },
      ])
      .select();

    if (!error) {
      setTasks([data[0], ...tasks]);
      setInput("");
      setTaskDescription("");
    }
  };

  const handleToggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const toggleTask = async (id, completed) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .match({ id });
    if (!error) {
      setShowConfetti(true);
      setFadeOut(false);

      setTimeout(() => {
        setFadeOut(true);
      }, 2500);

      setTimeout(() => setShowConfetti(false), 4000);

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
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 2s ease-out",
          }}
        />
      )}

      <h1 className="title">To-Do List</h1>
      <button className="log-out-btn" onClick={handleSignOut}>
        Log Out
      </button>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="input"
        />
        <button onClick={addTask} className="add-button">
          Add
        </button>
      </div>
      <ul className="list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task ${expandedTaskId === task.id ? "expanded" : ""}`}
          >
            <div
              className="task-preview"
              onClick={() => handleToggleExpand(task.id)}
            >
              <span className={task.completed ? "completed" : ""}>
                {task.text}
              </span>
              <button
                className="complete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(task.id, task.completed);
                }}
              >
                {task.completed ? "Add to List" : "Complete"}
              </button>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTask(task.id);
                }}
              >
                ✖
              </button>
            </div>

            {expandedTaskId === task.id && (
              <div className="task-details">
                <div>
                  <h4>Title</h4>
                  <p className="full-title">{task.text}</p>
                </div>
                <div>
                  <h4>Description</h4>
                  <p className="task-description">{task.description}</p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
