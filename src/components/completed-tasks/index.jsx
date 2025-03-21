import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

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
  isDeleteLoading,
}) {
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [taskToRestore, setTaskToRestore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const restoreTask = async (taskId) => {
    if (!user || !user.id) {
      console.error("User is not logged in or user ID is missing.");
      return;
    }

    setIsLoading(true);

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

    setTimeout(() => {
      setIsLoading(false);
      setShowRestoreModal(false);
      setTaskToRestore(null);
    }, 600);
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
              .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
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
                    <div className="carrot-icon">🥕</div>

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
                      <div>
                        <h4>Created:</h4>
                        <p className="task-add-date">
                          {format(
                            new Date(task.created_at),
                            "dd MMM yyyy HH:mm"
                          )}
                        </p>
                      </div>
                      <div>
                        <h4>Completed:</h4>
                        <p className="task-complete-date">
                          {format(
                            new Date(task.completed_at),
                            "dd MMM yyyy HH:mm"
                          )}
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
            {isDeleteLoading ? (
              <span className="carrot-spinner">🥕</span>
            ) : (
              <>
                <button className="confirm-btn" onClick={confirmDelete}>
                  Confirm
                </button>
                <button
                  className="cancel-modal-btn"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <p>Would you like to reactivate this Activity?</p>
            {isLoading ? (
              <span className="carrot-spinner">🥕</span>
            ) : (
              <>
                <button
                  className="confirm-btn"
                  onClick={() => restoreTask(taskToRestore)}
                >
                  Reactivate
                </button>
                <button
                  className="cancel-modal-btn"
                  onClick={() => setShowRestoreModal(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
