import { supabase } from "@/lib/supabase";

export default function TaskInput({
  tasks,
  setTasks,
  user,
  input,
  setInput,
  description,
  setDescription,
}) {
  const addTask = async () => {
    if (!user || input.trim() === "") return;
    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          text: input,
          description: description,
          completed: false,
          user_id: user.id,
        },
      ])
      .select();

    if (!error) {
      setTasks([data[0], ...tasks]);
      setInput("");
      setDescription("");
    }
  };

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
