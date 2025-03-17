import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ExpandIcon from "../../../public/assets/svgs/expand.svg";
import { format } from "date-fns";

export default function ActiveTasks({
  tasks,
  setTasks,
  user,
  setShowConfetti,
  setFadeOut,
  expandedTaskId,
  handleToggleExpand,
  handleDeleteClick,
  confirmDelete,
  showConfirmModal,
  setShowConfirmModal,
  isDeleteLoading,
}) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const markTaskAsComplete = async (taskId) => {
    if (!user || !user.id) {
      console.error("User is not logged in or user ID is missing.");
      return;
    }

    const completedAt = new Date().toISOString();

    const { error } = await supabase
      .from("todos")
      .update({ completed: true, completed_at: completedAt })
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
        task.id === taskId
          ? { ...task, completed: true, completed_at: completedAt }
          : task
      )
    );
    console.log(tasks);
  };

  const updateTask = async (taskId) => {
    if (!user || !user.id) {
      console.error("User is not logged in.");
      return;
    }

    const { error } = await supabase
      .from("todos")
      .update({
        text: editTitle,
        description: editDescription,
      })
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error("Error updating task:", error);
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, text: editTitle, description: editDescription }
          : task
      )
    );

    setEditingTaskId(null);
    setIsEditing(false);
  };

  return (
    <>
      {tasks.some((task) => !task.completed) ? (
        <>
          <h2 className="tasks-header">Activities:</h2>
          <ul className="list">
            {tasks
              .filter((task) => !task.completed)
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((task) => (
                <li
                  key={task.id}
                  className={`task ${
                    expandedTaskId === task.id ? "expanded" : ""
                  }`}
                >
                  <div
                    className="task-preview"
                    onClick={() => handleToggleExpand(task.id)}
                  >
                    <Image
                      className="expand-task-icon"
                      src={ExpandIcon}
                      alt="expand-icon"
                    />
                    <span className="task-text">{task.text}</span>

                    {/* <button
                      className="complete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        markTaskAsComplete(task.id);
                      }}
                    >
                      ✔ Complete
                    </button>

                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTaskId(task.id);
                        setEditTitle(task.text);
                        setEditDescription(task.description || "");
                        setIsEditing(true);
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="remove-btn"
                      onClick={(e) => handleDeleteClick(e, task.id)}
                    >
                      🗑️ Delete
                    </button> */}
                  </div>

                  {expandedTaskId === task.id && (
                    <div className="task-details">
                      {editingTaskId === task.id && isEditing ? (
                        <>
                          <label htmlFor="title">Title:</label>
                          <input
                            type="text"
                            className="edit-input"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <label htmlFor="Description">Description:</label>
                          <textarea
                            className="edit-textarea"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                          <button
                            className="save-btn"
                            onClick={() => updateTask(task.id)}
                          >
                            💾 Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setEditingTaskId(null)}
                          >
                            ❌ Cancel
                          </button>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}

                      <div>
                        <h4>Created:</h4>
                        <p className="task-add-date">
                          {format(
                            new Date(task.created_at),
                            "dd MMM yyyy HH:mm"
                          )}
                        </p>
                      </div>

                      <div className="task-actions">
                        <button
                          className="complete-btn"
                          onClick={() => markTaskAsComplete(task.id)}
                        >
                          ✔ Complete
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setEditTitle(task.text);
                            setEditDescription(task.description || "");
                            setIsEditing(true);
                          }}
                        >
                          ✏ Edit
                        </button>
                        <button
                          className="remove-btn"
                          onClick={(e) => handleDeleteClick(e, task.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </>
      ) : (
        tasks.some((task) => task.completed) && (
          <p className="no-active-tasks-message">No current activities!</p>
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
    </>
  );
}
