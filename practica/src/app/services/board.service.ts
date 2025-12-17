import { Injectable, signal } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Board, Column, Task, CustomLabel, Label } from '../models/board.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly BOARD_KEY = 'kanban-board-v2';
  private readonly LABELS_KEY = 'kanban-labels';
  board = signal<Board>(this.getDefaultBoard());
  private _labels = signal<CustomLabel[]>(this.getDefaultLabels());
  readonly labels = this._labels.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.board.set(this.loadBoard());
      this._labels.set(this.loadLabels());
    }
  }

  getLabels(): CustomLabel[] {
    return this._labels();
  }

  saveLabels(labels: CustomLabel[]) {
    this._labels.set(labels);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.LABELS_KEY, JSON.stringify(labels));
    }

    this.board.update((board) => {
      const validLabelIds = new Set(labels.map((l) => l.id));
      const newTasks = { ...board.tasks };

      Object.keys(newTasks).forEach((taskId) => {
        const task = newTasks[taskId];
        const validIds = task.labelIds?.filter((id) => validLabelIds.has(id)) || [];

        const newLabels = validIds
          .map((id) => {
            const label = labels.find((l) => l.id === id);
            return label ? { name: label.name, color: label.color } : null;
          })
          .filter(Boolean) as Label[];

        newTasks[taskId] = {
          ...task,
          labelIds: validIds,
          labels: newLabels,
        };
      });

      return { ...board, tasks: newTasks };
    });
  }

  addColumn(title: string) {
    const col: Column = { id: Date.now().toString(), title, taskIds: [] };
    this.board.update((b) => ({ ...b, columns: [...b.columns, col] }));
    this.saveBoard(this.board());
  }

  addTask(columnId: string, taskData: { title: string; description: string; labelIds: string[] }) {
    const task: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      labelIds: taskData.labelIds,
      labels: taskData.labelIds.map((id) => {
        const l = this.labels().find((l) => l.id === id);
        return l ? { name: l.name, color: l.color } : { name: 'Sin etiqueta', color: '#666' };
      }),
    };

    this.board.update((b) => ({
      ...b,
      tasks: { ...b.tasks, [task.id]: task },
      columns: b.columns.map((c) =>
        c.id === columnId ? { ...c, taskIds: [...c.taskIds, task.id] } : c
      ),
    }));
    this.saveBoard(this.board());
  }

  updateTask(
    taskId: string,
    updates: { title?: string; description?: string; labelIds?: string[] }
  ) {
    this.board.update((b) => {
      const task = b.tasks[taskId];
      if (!task) return b;

      const newLabelIds = updates.labelIds ?? task.labelIds ?? [];
      const newLabels = newLabelIds.map((id) => {
        const l = this.labels().find((l) => l.id === id);
        return l ? { name: l.name, color: l.color } : { name: 'Sin etiqueta', color: '#666' };
      });

      return {
        ...b,
        tasks: {
          ...b.tasks,
          [taskId]: {
            ...task,
            title: updates.title ?? task.title,
            description: updates.description ?? task.description,
            labelIds: newLabelIds,
            labels: newLabels,
          },
        },
      };
    });
    this.saveBoard(this.board());
  }

  deleteTask(taskId: string, columnId: string) {
    this.board.update((b) => ({
      ...b,
      tasks: Object.fromEntries(Object.entries(b.tasks).filter(([id]) => id !== taskId)),
      columns: b.columns.map((c) =>
        c.id === columnId ? { ...c, taskIds: c.taskIds.filter((id) => id !== taskId) } : c
      ),
    }));
    this.saveBoard(this.board());
  }

  moveTask(taskId: string, fromColId: string, toColId: string, toIndex: number) {
    this.board.update((board) => {
      const columns = board.columns.map((col) => ({ ...col, taskIds: [...col.taskIds] }));
      const fromCol = columns.find((c) => c.id === fromColId);
      const toCol = columns.find((c) => c.id === toColId);
      if (!fromCol || !toCol) return board;

      const taskIndex = fromCol.taskIds.indexOf(taskId);
      if (taskIndex === -1) return board;

      fromCol.taskIds.splice(taskIndex, 1);
      toCol.taskIds.splice(toIndex, 0, taskId);

      return { ...board, columns };
    });
    this.saveBoard(this.board());
  }

  private loadBoard(): Board {
    if (!isPlatformBrowser(this.platformId)) return this.getDefaultBoard();
    const saved = localStorage.getItem(this.BOARD_KEY);
    return saved ? JSON.parse(saved) : this.getDefaultBoard();
  }

  private saveBoard(board: Board) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.BOARD_KEY, JSON.stringify(board));
    }
  }

  private loadLabels(): CustomLabel[] {
    if (!isPlatformBrowser(this.platformId)) return this.getDefaultLabels();
    const saved = localStorage.getItem(this.LABELS_KEY);
    return saved ? JSON.parse(saved) : this.getDefaultLabels();
  }

  private getDefaultBoard(): Board {
    return {
      id: '1',
      name: 'Mi Proyecto',
      columns: [
        { id: '1', title: 'Pendiente', taskIds: ['t1', 't2'] },
        { id: '2', title: 'En proceso', taskIds: ['t3'] },
        { id: '3', title: 'Terminado', taskIds: [] },
      ],
      tasks: {
        t1: {
          id: 't1',
          title: 'Practicando',
          description: 'Crear un tablero de tareas',
          labelIds: ['1'],
          labels: [{ name: 'Angular', color: '#3b82f6' }],
        },
        t2: {
          id: 't2',
          title: 'Segunda tarjeta',
          description: 'Probando etiquetas',
          labelIds: ['2'],
          labels: [{ name: 'Importante', color: '#ef4444' }],
        },
        t3: {
          id: 't3',
          title: 'Terminar Kanban',
          description: 'probando 123',
          labelIds: [],
          labels: [],
        },
      },
    };
  }

  private getDefaultLabels(): CustomLabel[] {
    return [
      { id: '1', name: 'Angular', color: '#3b82f6' },
      { id: '2', name: 'Importante', color: '#ef4444' },
      { id: '3', name: 'Bug', color: '#f59e0b' },
      { id: '4', name: 'Feature', color: '#10b981' },
    ];
  }

  updateColumnTitle(columnId: string, newTitle: string) {
    this.board.update((b) => ({
      ...b,
      columns: b.columns.map((c) => (c.id === columnId ? { ...c, title: newTitle } : c)),
    }));
    this.saveBoard(this.board());
  }
}
