import React, { useState } from "react";
import "./TaskForm.scss";
import type { Task } from "../../types/task";
import { v4 as uuidv4 } from "uuid";
import { categorizeTaskGroq } from "../../utils/categorize";

type TaskFormProps = {
  onAddTask: (task: Task) => void;
};

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    let finalCategory = category;

    if (!finalCategory) {
      setLoadingAI(true);
      try {
        finalCategory = await categorizeTaskGroq(
          `${title} ${description}`.trim()
        );
      } catch (err) {
        console.error("AI category failed", err);
        finalCategory = "Other";
      }
      setLoadingAI(false);
    }

    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim() || "",
      category: finalCategory,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setTitle("");
    setDescription("");
    setCategory("");
    setError("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="task-title">Title</label>
      <input
        type="text"
        id="task-title"
        name="title"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="task-desc">Description</label>
      <textarea
        id="task-desc"
        name="description"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="task-category">Category</label>
      <select
        id="task-category"
        className="select-dropdown"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Auto (AI)</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Home">Home</option>
        <option value="Health">Health</option>
        <option value="Errands">Errands</option>
        <option value="Study">Study</option>
      </select>
      {error && <p className="error">{error}</p>}
      <button type="submit">
        {loadingAI ? "Categorizing..." : "Add Task"}
      </button>
    </form>
  );
}
