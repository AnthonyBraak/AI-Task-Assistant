import React, { useState } from "react";
import "./TaskForm.scss";
import type { Task } from "../../types/task";
import { v4 as uuidv4 } from "uuid";

type TaskFormProps = {
  onAddTask: (task: Task) => void;
};

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim() || "",
      category: category || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setTitle("");
    setDescription("");
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
        <option value="">Select a category</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Urgent">Urgent</option>
      </select>
      {error && <p className="error">{error}</p>}
      <button type="submit">Add Task</button>
    </form>
  );
}
