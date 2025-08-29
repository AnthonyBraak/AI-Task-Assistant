import "./TaskList.scss";
import type { Task } from "../../types/task";
import TaskItem from "../TaskItem/TaskItem";

type TaskListProps = {
  tasks: Task[];
  filter: "all" | "completed" | "incomplete";
  sortOption: "newest" | "oldest" | "alphabetical";
  categoryFilter: string;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onToggleComplete: (id: string) => void;
};

export default function TaskList({
  tasks,
  filter,
  sortOption,
  categoryFilter,
  onDeleteTask,
  onEditTask,
  onToggleComplete,
}: TaskListProps) {
  const filteredByStatus = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const filteredTasks = categoryFilter
    ? filteredByStatus.filter((task) => task.category === categoryFilter)
    : filteredByStatus;

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

  if (sortedTasks.length === 0) {
    return <p className="no-tasks">No tasks match the selected filter.</p>;
  }

  return (
    <div className="task-list">
      {sortedTasks.map((task) => (
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
