import "./TaskList.scss";
import type { Task } from "../../types/task";
import { useState } from "react";

type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onToggleComplete: (id: string) => void;
};

export default function TaskList({
  tasks,
  onDeleteTask,
  onEditTask,
  onToggleComplete,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditedTitle(task.title);
    setEditedDesc(task.description || "");
  };

  const handleSave = (original: Task) => {
    const updated: Task = {
      ...original,
      title: editedTitle.trim(),
      description: editedDesc.trim(),
    };
    onEditTask(updated);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks yet.</p>;
  }

  return (
    <div className="task-list">
      <div className="filter-buttons">
        {["all", "completed", "incomplete"].map((type) => (
          <button
            key={type}
            onClick={() =>
              setFilter(type as "all" | "completed" | "incomplete")
            }
            className={filter === type ? "active" : ""}
          >
            {type[0].toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {filteredTasks.map((task) => (
        <div key={task.id} className="task-card">
          {editingId === task.id ? (
            <>
              <div className="card-input">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <textarea
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                />
                <button onClick={() => handleSave(task)}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <label className="task-complete">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                />
                <span className="checkmark" />
                <span className={task.completed ? "completed" : ""}>
                  {task.title}
                </span>
              </label>

              {task.description && (
                <p className={task.completed ? "completed" : ""}>
                  {task.description}
                </p>
              )}
              <small>
                Created at: {new Date(task.createdAt).toLocaleString()}
              </small>
              <div className="actions">
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => onDeleteTask(task.id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
