import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
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
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TaskCardComponent,
  ],
  template: `
    <div class="column bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col">
      <div class="mb-4">
        @if (isEditingTitle) {
        <mat-form-field appearance="outline" class="w-full">
          <input
            matInput
            [(ngModel)]="editedTitle"
            (blur)="saveTitle()"
            (keyup.enter)="saveTitle()"
            (keyup.escape)="cancelEdit()"
            autofocus
            maxlength="30"
            class="text-2xl font-bold"
          />
        </mat-form-field>
        } @else {
        <h2
          class="title text-2xl font-bold text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 -mx-3 -my-2 transition"
          (click)="startEdit()"
        >
          {{ column.title }}
        </h2>
        }
      </div>

      <button mat-stroked-button class="w-full mb-4" (click)="addTask()">+ Añadir tarea</button>

      <div
        cdkDropList
        [id]="column.id"
        [cdkDropListConnectedTo]="otherColumnIds()"
        (cdkDropListDropped)="onDrop($event)"
        class="drop-zone flex-1 min-h-32 space-y-3 overflow-y-auto"
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
        height: fit-content;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
      }
      .drop-zone {
        padding: 8px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.03);
      }
      ::ng-deep .mat-mdc-form-field .mat-mdc-input-element {
        font-size: 1.5rem !important;
        font-weight: bold !important;
      }
    `,
  ],
})
export class ColumnComponent {
  @Input({ required: true }) column!: Column;

  private dialog = inject(MatDialog);
  private boardService = inject(BoardService);

  isEditingTitle = false;
  editedTitle = '';

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

  startEdit() {
    this.editedTitle = this.column.title;
    this.isEditingTitle = true;
  }

  saveTitle() {
    const newTitle = this.editedTitle.trim();
    if (newTitle && newTitle !== this.column.title) {
      this.boardService.updateColumnTitle(this.column.id, newTitle);
    }
    this.isEditingTitle = false;
  }

  cancelEdit() {
    this.isEditingTitle = false;
    this.editedTitle = '';
  }

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
