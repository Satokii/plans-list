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
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const markTaskAsComplete = async (taskId) => {
    if (!user || !user.id) {
      console.error("User is not logged in or user ID is missing.");
      return;
    }

    const { data, error } = await supabase
      .from("todos")
      .update({ completed: true })
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error("Error updating task:", error);
      return;
    }

    setShowConfetti(true);
    setFadeOut(false);
    setTimeout(() => {
      setFadeOut(true);
    }, 2500);
    setTimeout(() => setShowConfetti(false), 4000);

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  const restoreTask = async (taskId) => {
    if (!user || !user.id) {
      console.error("User is not logged in or user ID is missing.");
      return;
    }

    const { data, error } = await supabase
      .from("todos")
      .update({ completed: false })
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error("Error restoring task:", error);
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: false } : task
      )
    );
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

      {/* Input for new tasks */}
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

      {/* Active Tasks Section */}
      <h2>Active Tasks</h2>
      <ul className="list">
        {tasks
          .filter((task) => !task.completed)
          .map((task) => (
            <li
              key={task.id}
              className={`task ${expandedTaskId === task.id ? "expanded" : ""}`}
            >
              <div
                className="task-preview"
                onClick={() => handleToggleExpand(task.id)}
              >
                <span className="task-text">{task.text}</span>

                <button
                  className="complete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    markTaskAsComplete(task.id);
                  }}
                >
                  Complete
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
                    <p className="task-description">
                      {task.description || "No description provided"}
                    </p>
                  </div>
                </div>
              )}
            </li>
          ))}
      </ul>

      {/* Completed Tasks Section */}
      <div className="completed-tasks-container">
        <h2 className="completed-tasks-header">Completed Tasks</h2>
        <ul className="completed-tasks-list">
          {tasks.filter((task) => task.completed).length === 0 ? (
            <p>No completed tasks yet!</p>
          ) : (
            tasks
              .filter((task) => task.completed)
              .map((task) => (
                <li
                  key={task.id}
                  className={`completed-task ${
                    expandedTaskId === task.id ? "expanded" : ""
                  }`}
                >
                  <div
                    className="task-preview"
                    onClick={() => handleToggleExpand(task.id)}
                  >
                    <span className="task-text">{task.text}</span>
                    <button
                      className="restore-btn"
                      onClick={() => restoreTask(task.id)}
                    >
                      Restore to Main List
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
                        <p className="task-description">
                          {task.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  );
}
