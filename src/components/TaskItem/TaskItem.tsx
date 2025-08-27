import { useState } from "react";
import type { Task } from "../../types/task";
import "./TaskItem.scss";

type TaskItemProps = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleComplete: (id: string) => void;
};

export default function TaskItem({
  task,
  onDelete,
  onEdit,
  onToggleComplete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description || "");

  const handleSave = () => {
    const updatedTask: Task = {
      ...task,
      title: editedTitle.trim(),
      description: editedDesc.trim(),
    };
    onEdit(updatedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDesc(task.description || "");
  };

  return (
    <div className="task-card">
      {isEditing ? (
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
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
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

          <small>Created at: {new Date(task.createdAt).toLocaleString()}</small>

          <div className="actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
