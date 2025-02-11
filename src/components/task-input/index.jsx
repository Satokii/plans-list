export default function TaskInput({
  input,
  setInput,
  description,
  setDescription,
  addTask,
}) {
  return (
    <div className="input-container">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new activity..."
        className="input"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)..."
        className="description-input"
      />
      <button onClick={addTask} className="add-button">
        Add
      </button>
    </div>
  );
}
