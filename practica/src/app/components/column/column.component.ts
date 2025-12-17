import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CdkDropList, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Column, Task } from '../../models/board.model';
import { BoardService } from '../../services/board';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

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
  templateUrl: './column.component.html',
  styleUrl: './column.component.css',
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
