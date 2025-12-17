export interface Label {
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  labels: Label[];
  labelIds: string[];
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  tasks: Record<string, Task>;
}
export interface CustomLabel {
  id: string;
  name: string;
  color: string;
}
