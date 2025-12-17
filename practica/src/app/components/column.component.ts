import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CdkDropList, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Column, Task } from '../models/board.model';
import { BoardService } from '../services/board.service';
import { TaskCardComponent } from './task-card.component';
import { TaskDialogComponent } from './task-dialog.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    CdkDropList,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TaskCardComponent,
  ],
  template: `
    <div class="column bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
      <h2 class="title text-2xl font-bold text-gray-800 mb-4">{{ column.title }}</h2>
      <button mat-stroked-button class="w-full mt-4 align-center" (click)="addTask()">
        + Añadir tarea
      </button>
      <div
        cdkDropList
        [id]="column.id"
        [cdkDropListConnectedTo]="otherColumnIds()"
        (cdkDropListDropped)="onDrop($event)"
        class="drop-zone min-h-32 space-y-3"
      >
        @for (task of tasks(); track task.id) {
        <div cdkDrag [cdkDragData]="task.id" (click)="openTask(task)">
          <app-task-card [task]="task" />
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .column {
        width: 340px;
        min-width: 340px;
      }
      .drop-zone {
        padding: 8px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.03);
      }
    `,
  ],
})
export class ColumnComponent {
  @Input({ required: true }) column!: Column;
  private dialog = inject(MatDialog);
  private boardService = inject(BoardService);

  tasks = computed(() => {
    const board = this.boardService.board();
    const col = board.columns.find((c) => c.id === this.column.id);
    return (
      col?.taskIds.map((id) => board.tasks[id]).filter((t): t is Task => t !== undefined) ?? []
    );
  });

  otherColumnIds = computed(() =>
    this.boardService
      .board()
      .columns.filter((c) => c.id !== this.column.id)
      .map((c) => c.id)
  );

  addTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { columnId: this.column.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.title) {
        this.boardService.addTask(this.column.id, result);
      }
    });
  }

  openTask(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { task, columnId: this.column.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.delete) {
          this.boardService.deleteTask(task.id, this.column.id);
        } else if (result.title) {
          this.boardService.updateTask(task.id, result);
        }
      }
    });
  }

  onDrop(event: CdkDragDrop<string>) {
    const taskId = event.item.data as string;
    const fromColId = event.previousContainer.id;
    const toColId = event.container.id;

    if (fromColId !== toColId) {
      this.boardService.moveTask(taskId, fromColId, toColId, event.currentIndex);
    }
  }
}
