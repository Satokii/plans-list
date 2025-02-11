export default function ActiveTasks({
  tasks,
  expandedTaskId,
  handleToggleExpand,
  markTaskAsComplete,
  removeTask,
}) {
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
    </>
  );
}
