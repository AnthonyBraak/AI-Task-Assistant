import "./TaskList.scss";
import type { Task } from "../../types/task";
import { useState } from "react";

type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
};

export default function TaskList({
  tasks,
  onDeleteTask,
  onEditTask,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");

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

  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks yet.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
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
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
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
