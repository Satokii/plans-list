export default function CompletedTasks({
  tasks,
  expandedTaskId,
  handleToggleExpand,
  restoreTask,
  
}) {
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
                  <span className="completed-task-text">{task.text}</span>
                  <button
                    className="restore-btn"
                    onClick={() => restoreTask(task.id)}
                  >
                    Add Back To List
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
