"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ConfettiEffect from "@/components/confetti-effect";
import TaskInput from "@/components/task-input";
import ActiveTasks from "@/components/active-tasks";
import CompletedTasks from "@/components/completed-tasks";
import LogoutButton from "@/components/logout-button";

import "./styles.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
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

  const removeTask = async (id) => {
    const { error } = await supabase.from("todos").delete().match({ id });
    if (!error) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // const handleSignOut = async () => {
  //   await supabase.auth.signOut();
  //   router.push("/login");
  // };

  return (
    <div className="container">
      {showConfetti && <ConfettiEffect fadeOut={fadeOut} />}

      <h1 className="title">To-Do List</h1>
      <LogoutButton />
      {/* <button className="log-out-btn" onClick={handleSignOut}>
        Log Out
      </button> */}

      <TaskInput
        tasks={tasks}
        setTasks={setTasks}
        user={user}
        input={input}
        setInput={setInput}
        description={description}
        setDescription={setDescription}
      />

      <ActiveTasks
        tasks={tasks}
        expandedTaskId={expandedTaskId}
        handleToggleExpand={handleToggleExpand}
        markTaskAsComplete={markTaskAsComplete}
        removeTask={removeTask}
      />

      <CompletedTasks
        tasks={tasks}
        setTasks={setTasks}
        user={user}
        expandedTaskId={expandedTaskId}
        handleToggleExpand={handleToggleExpand}
      />
    </div>
  );
}
