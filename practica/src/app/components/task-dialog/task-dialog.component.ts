import { Component, computed, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Task, Label, CustomLabel } from '../../models/board.model';
import { BoardService } from '../../services/board';

import { LabelManagerComponent } from '../label-manager.component/label-manager.component';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
  
 
})
export class TaskDialogComponent {
  private dialog = inject(MatDialog);
  private boardService = inject(BoardService);

  title = '';
  description = '';
  selectedLabelIds: string[] = [];
  availableLabels = computed(() => this.boardService.labels());
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task; columnId: string }
  ) {
    this.isEdit = !!data.task;
    this.title = data.task?.title || '';
    this.description = data.task?.description || '';

    if (this.data.task?.labelIds) {
      const currentLabels = this.availableLabels();
      this.selectedLabelIds = this.data.task.labelIds.filter((id) =>
        currentLabels.some((label) => label.id === id)
      );
    }
    
  }

  openLabelManager() {
    const dialogRef = this.dialog.open(LabelManagerComponent, {
      width: '500px',
      data: { labels: this.availableLabels() },
    });
  }

  toggleLabel(label: CustomLabel) {
    this.selectedLabelIds = this.selectedLabelIds.includes(label.id)
      ? this.selectedLabelIds.filter((id) => id !== label.id)
      : [...this.selectedLabelIds, label.id];
  }

  save() {
    const taskData = {
      title: this.title.trim(),
      description: this.description,
      labelIds: this.selectedLabelIds,
    };

    if (this.isEdit) {
      this.boardService.updateTask(this.data.task!.id, taskData);
      this.dialogRef.close();
    } else {
      this.dialogRef.close(taskData);
    }
  }

  delete() {
    if (confirm('¿Eliminar esta tarea?')) {
      this.dialogRef.close({ delete: true });
    }
  }
}
