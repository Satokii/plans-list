import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ExpandIcon from "../../../public/assets/svgs/expand.svg";

export default function ActiveTasks({
  tasks,
  setTasks,
  user,
  setShowConfetti,
  setFadeOut,
  expandedTaskId,
  handleToggleExpand,
  removeTask,
}) {
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

  return (
    <>
      <h2 className="tasks-header">To Do:</h2>
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
                <Image
                  className="expand-task-icon"
                  src={ExpandIcon}
                  alt="expand-icon"
                />
                <span className="task-text">{task.text}</span>

                <button
                  className="complete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    markTaskAsComplete(task.id);
                  }}
                >
                  ✔ Complete
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
    </>
  );
}
