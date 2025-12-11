import { useState } from "react";
import type { Task } from "../../types/task";
import "./TaskItem.scss";
import { rephraseTaskGroq } from "../../utils/openai";
import { categorizeTaskGroq } from "../../utils/categorize";

type TaskItemProps = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleComplete: (id: string) => void;
};

const CATEGORIES = [
  "Work",
  "Personal",
  "Home",
  "Health",
  "Errands",
  "Study",
  "Other",
];

export default function TaskItem({
  task,
  onDelete,
  onEdit,
  onToggleComplete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description || "");
  const [editedCategory, setEditedCategory] = useState(task.category || "");
  const [loading, setLoading] = useState(false);
  const [categorizeLoading, setCategorizeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rephrased, setRephrased] = useState<string | null>(null);
  const [rephraseMode, setRephraseMode] = useState<"title" | "full">("title");

  const categoryClass = (cat: string) => cat.toLowerCase().replace(/\s+/g, "-");

  const handleSave = () => {
    const updatedTask: Task = {
      ...task,
      title: editedTitle.trim(),
      description: editedDesc.trim(),
      category: editedCategory || undefined,
    };
    onEdit(updatedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDesc(task.description || "");
    setEditedCategory(task.category || "");
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
    } catch (err: unknown) {
      console.error("Error during rephrasing:", err);
      if (err instanceof Error) setError(err.message);
      else setError("Failed to rephrase task.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorize = async () => {
    if (!task.title && !task.description) return;

    setCategorizeLoading(true);
    setError(null);

    try {
      const category = await categorizeTaskGroq(
        `${task.title}${task.description ? `: ${task.description}` : ""}`
      );

      const updatedTask: Task = {
        ...task,
        category,
      };
      onEdit(updatedTask);
      setEditedCategory(category);
    } catch (err: unknown) {
      console.error("Error during categorization:", err);
      if (err instanceof Error) setError(err.message);
      else setError("Failed to categorize task.");
    } finally {
      setCategorizeLoading(false);
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
          <select
            className="select-dropdown"
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <>
          {task.category && (
            <div
              className={`task-category-badge ${categoryClass(task.category)}`}
            >
              {task.category}
            </div>
          )}

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

            <div className="rephrase-section">
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
            </div>

            <button
              onClick={handleCategorize}
              disabled={categorizeLoading}
              className="categorize-button"
            >
              {categorizeLoading ? "Categorizing..." : "Categorize"}
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
