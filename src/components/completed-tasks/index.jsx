import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ExpandIcon from "../../../public/assets/svgs/expand.svg";

export default function CompletedTasks({
  tasks,
  setTasks,
  user,
  expandedTaskId,
  handleToggleExpand,
}) {
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
  };
  return (
    <>
      <h2 className="completed-tasks-header">Completed:</h2>
      <ul className="completed-tasks-list">
        {tasks.filter((task) => task.completed).length === 0 ? (
          <p className="no-tasks">No completed tasks yet!</p>
        ) : (
          tasks
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
                    onClick={(e) => {
                      e.stopPropagation();
                      restoreTask(task.id);
                    }}
                  >
                    🔄 Add Back
                  </button>

                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTask(task.id);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* Expanded Task Details */}
                {expandedTaskId === task.id && (
                  <div className="completed-task-details">
                    <div>
                      <h4>Title</h4>
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
            ))
        )}
      </ul>
    </>
  );
}
