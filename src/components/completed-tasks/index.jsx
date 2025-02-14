import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ExpandIcon from "../../../public/assets/svgs/expand.svg";

export default function CompletedTasks({
  tasks,
  setTasks,
  user,
  expandedTaskId,
  handleToggleExpand,
  handleDeleteClick,
  confirmDelete,
  showConfirmModal,
  setShowConfirmModal,
}) {
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [taskToRestore, setTaskToRestore] = useState(null);

  const restoreTask = async (taskId) => {
    if (!user || !user.id) {
      console.error("User is not logged in or user ID is missing.");
      return;
    }

    const { error } = await supabase
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
    setShowRestoreModal(false);
    setTaskToRestore(null);
  };

  const handleRestoreClick = (e, taskId) => {
    e.stopPropagation();
    setTaskToRestore(taskId);
    setShowRestoreModal(true);
  };

  return (
    <>
      {tasks.some((task) => task.completed) ? (
        <>
          <h2 className="completed-tasks-header">Completed:</h2>
          <ul className="completed-tasks-list">
            {tasks
              .filter((task) => task.completed)
              .map((task) => (
                <li
                  key={task.id}
                  className={`completed-task ${
                    expandedTaskId === task.id ? "completed-task-expanded" : ""
                  }`}
                >
                  <div
                    className="completed-task-preview"
                    onClick={() => handleToggleExpand(task.id)}
                  >
                    <Image
                      className="expand-task-icon"
                      src={ExpandIcon}
                      alt="expand-icon"
                    />
                    <span className="completed-task-text">{task.text}</span>

                    <button
                      className="restore-btn"
                      onClick={(e) => handleRestoreClick(e, task.id)}
                    >
                      ♻️ Reactivate Activity
                    </button>

                    <button
                      className="remove-btn"
                      onClick={(e) => handleDeleteClick(e, task.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {/* Expanded Task Details */}
                  {expandedTaskId === task.id && (
                    <div className="completed-task-details">
                      <div>
                        <h4>Activity</h4>
                        <p className="completed-full-title">{task.text}</p>
                      </div>
                      <div>
                        <h4>Description</h4>
                        <p className="completed-task-description">
                          {task.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </>
      ) : (
        tasks.some((task) => !task.completed) && (
          <p className="no-completed-tasks-message">No completed activities!</p>
        )
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <p>Are you sure you want to delete this Activity?</p>
            <button className="confirm-btn" onClick={confirmDelete}>
              Confirm
            </button>
            <button
              className="cancel-btn"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <p>Would you like to reactivate this Activity?</p>
            <button
              className="confirm-btn"
              onClick={() => restoreTask(taskToRestore)}
            >
              Reactivate
            </button>
            <button
              className="cancel-btn"
              onClick={() => setShowRestoreModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
