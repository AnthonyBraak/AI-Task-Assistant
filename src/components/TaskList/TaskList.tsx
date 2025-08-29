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
  const [sortOption, setSortOption] = useState<
    "newest" | "oldest" | "alphabetical"
  >("newest");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "incomplete") return !task.completed;
      return true;
    })
    .filter((task) => {
      return filterCategory ? task.category === filterCategory : true;
    });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOption === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks yet.</p>;
  }

  return (
    <div className="task-list">
      <div className="filter-sort-bar">
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

        <div className="category-filter">
          <label htmlFor="category-filter">Category: </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <div className="sort-dropdown">
          <label htmlFor="sort-select">Sort by: </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical (A–Z)</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <p className="no-tasks">No tasks match the selected filter.</p>
      ) : (
        sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onToggleComplete={onToggleComplete}
          />
        ))
      )}
    </div>
  );
}
