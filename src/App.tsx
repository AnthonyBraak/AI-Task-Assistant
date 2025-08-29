import "./styles/main.scss";
import Sidebar from "./components/Sidebar/Sidebar";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";
import type { Task } from "./types/task";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "ai-task-assistant.tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const [sortOption, setSortOption] = useState<
    "newest" | "oldest" | "alphabetical"
  >("newest");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const toggleCompleteTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="app">
      <Sidebar
        filter={filter}
        setFilter={setFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <main className="main-content">
        <TaskForm onAddTask={addTask} />
        <TaskList
          tasks={tasks}
          filter={filter}
          sortOption={sortOption}
          categoryFilter={categoryFilter}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
          onToggleComplete={toggleCompleteTask}
        />
      </main>
    </div>
  );
}

export default App;
