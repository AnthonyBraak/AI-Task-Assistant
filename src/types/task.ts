export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category?: string;
  priority?: "low" | "medium" | "high";
  createdAt: string;
};
