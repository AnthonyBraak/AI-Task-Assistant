import { useState } from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Sidebar.scss";

type SidebarProps = {
  filter: "all" | "completed" | "incomplete";
  setFilter: (filter: "all" | "completed" | "incomplete") => void;
  sortOption: "newest" | "oldest" | "alphabetical";
  setSortOption: (option: "newest" | "oldest" | "alphabetical") => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
};

export default function Sidebar({
  filter,
  setFilter,
  sortOption,
  setSortOption,
  categoryFilter,
  setCategoryFilter,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const categories = [
    "Work",
    "Personal",
    "Study",
    "Home",
    "Health",
    "Errands",
    "Other",
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? "←" : "→"}
      </button>

      {isOpen && (
        <div className="sidebar-content">
          <ThemeToggle />

          <div className="filter-section">
            <h4>Status</h4>
            {["all", "completed", "incomplete"].map((type) => (
              <button
                key={type}
                className={filter === type ? "active" : ""}
                onClick={() => setFilter(type as typeof filter)}
              >
                {type[0].toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="sort-section">
            <h4>Sort</h4>
            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as typeof sortOption)
              }
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <div className="category-section">
            <h4>Category</h4>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </aside>
  );
}
