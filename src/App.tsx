import "./styles/main.scss";
import Sidebar from "./components/Sidebar/Sidebar";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";
import type { Task } from "./types/task";
import { useEffect, useState } from "react";
import Modal from "./components/Modular/Modal";

const LOCAL_STORAGE_KEY = "ai-task-assistant.tasks";

function App() {
  const [isOpen, setIsOpen] = useState(false);
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
      <div>
        <button className="info-button" onClick={() => setIsOpen(true)}>
          Info
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2>Info</h2>
          <p>
            For security Reasons, the AI Key has not been included in this demo.
          </p>
          <p>
            If you would like to view the full, working version, feel free to
            add your own key or get in touch with me.
          </p>
        </Modal>
      </div>
    </div>
  );
}

export default App;
