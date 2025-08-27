import "./TaskList.scss";
import type { Task } from "../../types/task";
import { useState } from "react";
import TaskItem from "../TaskItem/TaskItem";

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
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );

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
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
