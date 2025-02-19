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
import "./styles/tasks.css";
import "./keyframes/keyframes.css";
import "./media-queries/media-queries.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".task, .completed-task")) {
        setExpandedTaskId(null);
      }
    };

    if (expandedTaskId !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [expandedTaskId]);

  const removeTask = async (id) => {
    const { error } = await supabase.from("todos").delete().match({ id });
    if (!error) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleDeleteClick = (e, taskId) => {
    e.stopPropagation();
    setTaskToDelete(taskId);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setIsDeleteLoading(true);

      setTimeout(() => {
        removeTask(taskToDelete);
        setShowConfirmModal(false);
        setTaskToDelete(null);
        setIsDeleteLoading(false);
      }, 600);
    }
  };

  return (
    <div className="container">
      {showConfetti && <ConfettiEffect fadeOut={fadeOut} />}

      <h1 className="title">To-Do List</h1>

      <LogoutButton />

      <TaskInput
        tasks={tasks}
        setTasks={setTasks}
        user={user}
        input={input}
        setInput={setInput}
        description={description}
        setDescription={setDescription}
      />

      {tasks.length === 0 ? (
        <p className="no-tasks-message">Add an activity to get started</p>
      ) : (
        <>
          <ActiveTasks
            tasks={tasks}
            setTasks={setTasks}
            user={user}
            setShowConfetti={setShowConfetti}
            setFadeOut={setFadeOut}
            expandedTaskId={expandedTaskId}
            handleToggleExpand={handleToggleExpand}
            removeTask={removeTask}
            handleDeleteClick={handleDeleteClick}
            confirmDelete={confirmDelete}
            showConfirmModal={showConfirmModal}
            setShowConfirmModal={setShowConfirmModal}
            isDeleteLoading={isDeleteLoading}
          />

          <CompletedTasks
            tasks={tasks}
            setTasks={setTasks}
            user={user}
            expandedTaskId={expandedTaskId}
            handleToggleExpand={handleToggleExpand}
            handleDeleteClick={handleDeleteClick}
            confirmDelete={confirmDelete}
            showConfirmModal={showConfirmModal}
            setShowConfirmModal={setShowConfirmModal}
            isDeleteLoading={isDeleteLoading}
          />
        </>
      )}
    </div>
  );
}
