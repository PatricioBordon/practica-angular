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
import { Task, Label, CustomLabel } from '../models/board.model';
import { BoardService } from '../services/board.service';
import { LabelManagerComponent } from './label-manager.component';

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
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>

    <mat-dialog-content class="mt-4">
      <div class="flex flex-col gap-4">
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Título</mat-label>
          <input matInput [(ngModel)]="title" required />
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Descripción</mat-label>
          <textarea matInput [(ngModel)]="description" rows="4"></textarea>
        </mat-form-field>

        <div class="my-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-bold uppercase tracking-widest text-gray-400">Etiquetas</span>
            <button mat-button color="primary" class="!text-xs" (click)="openLabelManager()">
              Configurar
            </button>
          </div>

          <div class="label-grid custom-scroll">
            @for (label of availableLabels(); track label.id) {
            <div
              (click)="toggleLabel(label)"
              [class.selected]="selectedLabelIds.includes(label.id)"
              class="label-item bg-gray-50 hover:bg-gray-100"
            >
              <div class="color-dot" [style.background-color]="label.color"></div>
              <span class="text-sm font-medium text-gray-700 truncate">{{ label.name }}</span>
            </div>
            }
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      @if (isEdit) {
      <button mat-button color="warn" (click)="delete()">Eliminar</button>
      }
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .w-full {
        width: 100%;
        display: block;
        margin-bottom: 20px;
      }
      .selected {
        transform: scale(0.9);
      }

      .label-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 8px;
        max-height: 200px;
        overflow-y: auto;
        padding: 4px;
      }
      .label-item {
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 2px solid transparent;
        transition: all 0.2s;
      }
      .label-item.selected {
        border-color: #3b82f6;
        background: #eff6ff;
      }
      .color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
    `,
  ],
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
