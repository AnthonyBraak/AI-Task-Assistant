import { useState } from "react";
import type { Task } from "../../types/task";
import "./TaskItem.scss";
import { rephraseTaskGroq } from "../../utils/openai";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rephrased, setRephrased] = useState<string | null>(null);
  const [rephraseMode, setRephraseMode] = useState<"title" | "full">("title");

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

  const handleRephrase = async () => {
    setLoading(true);
    setError(null);
    try {
      const textToRephrase =
        rephraseMode === "full" && task.description
          ? `${task.title}: ${task.description}`
          : task.title;

      const result = await rephraseTaskGroq(textToRephrase);
      setRephrased(result);
    } catch (error: unknown) {
      console.error("Error during rephrasing:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to rephrase task.");
      }
    } finally {
      setLoading(false);
    }
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

            <select
              value={rephraseMode}
              onChange={(e) =>
                setRephraseMode(e.target.value as "title" | "full")
              }
              disabled={loading}
            >
              <option value="title">Rephrase Title Only</option>
              <option value="full">Rephrase Title & Description</option>
            </select>

            <button onClick={handleRephrase} disabled={loading}>
              {loading ? "Rephrasing..." : "Rephrase"}
            </button>

            {rephrased && (
              <div className="rephrased-text">
                <strong>Rephrased:</strong>
                <p>{rephrased}</p>
                <div className="rephrase-actions">
                  <button
                    onClick={() => {
                      const updatedTask: Task = {
                        ...task,
                        // If rephrasing full, split back title + description
                        ...(rephraseMode === "full" && rephrased.includes(":")
                          ? {
                              title: rephrased.split(":")[0].trim(),
                              description: rephrased
                                .split(":")
                                .slice(1)
                                .join(":")
                                .trim(),
                            }
                          : { title: rephrased }),
                      };
                      onEdit(updatedTask);
                      setRephrased(null);
                    }}
                  >
                    Use Suggestion
                  </button>
                  <button onClick={() => setRephrased(null)}>Dismiss</button>
                </div>
              </div>
            )}

            {error && <p className="error-text">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
}
