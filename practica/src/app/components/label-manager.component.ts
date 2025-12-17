import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomLabel } from '../models/board.model';
import { BoardService } from '../services/board.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-label-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-3xl font-bold text-gray-800 mb-6">Gestionar Etiquetas</h2>

    <mat-dialog-content class="max-h-96 overflow-y-auto">
      <div class="space-y-4 mb-8">
        @for (label of labels; track label.id) {
        <div
          class="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow"
        >
          <mat-form-field appearance="outline" class="flex-1 max-w-md">
            <mat-label>Nombre</mat-label>
            <input
              matInput
              [(ngModel)]="label.name"
              placeholder="Nombre de etiqueta"
              maxlength="10"
            />
          </mat-form-field>

          <input
            type="color"
            [(ngModel)]="label.color"
            class="w-14 h-14 rounded-xl cursor-pointer border-4 border-white shadow-lg hover:scale-110 transition-transform"
            title="Cambiar color"
          />

          <button
            mat-icon-button
            color="warn"
            (click)="confirmRemove(label.id, label.name)"
            class="hover:bg-red-50"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
        }

        <div
          class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-300"
        >
          <div class="flex items-center gap-4">
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Nueva etiqueta</mat-label>
              <input #newName matInput placeholder="Ej: Urgente, Backend, Diseño..." />
            </mat-form-field>

            <input
              #newColor
              type="color"
              value="#8b5cf6"
              class="w-16 h-16 rounded-2xl cursor-pointer shadow-xl hover:scale-110 transition-transform"
              title="Elegir color"
            />

            <button
              mat-raised-button
              color="primary"
              class="px-8 py-4 text-lg"
              (click)="addLabel(newName.value, newColor.value); newName.value = ''"
            >
              <mat-icon>add</mat-icon>
              Añadir
            </button>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="mt-6 gap-3">
      <button mat-button (click)="dialogRef.close()" class="text-lg">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" class="px-10 py-3 text-lg">
        Guardar Cambios
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      ::ng-deep .mat-mdc-form-field-outline {
        background-color: white;
      }
      .mat-mdc-chip {
        border-radius: 9999px !important;
      }
    `,
  ],
})
export class LabelManagerComponent {
  labels: CustomLabel[] = [];
  private dialog = inject(MatDialog);

  constructor(
    public dialogRef: MatDialogRef<LabelManagerComponent>,
    @Inject(MAT_DIALOG_DATA) data: { labels: CustomLabel[] },
    private boardService: BoardService
  ) {
    this.labels = structuredClone(data.labels || []).map((l) => ({
      ...l,
      name: l.name?.trim() || 'Etiqueta sin nombre',
      color: l.color || '#8b5cf6',
    }));
  }

  getContrastColor(hexColor: string): string {
    const cleaned = hexColor.replace('#', '');
    const r = parseInt(cleaned.substr(0, 2), 16);
    const g = parseInt(cleaned.substr(2, 2), 16);
    const b = parseInt(cleaned.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  addLabel(name: string, color: string) {
    if (name.trim()) {
      this.labels.push({
        id: Date.now().toString(),
        name: name.trim(),
        color: color || '#8b5cf6',
      });
    }
  }

  async confirmRemove(id: string, name: string) {
    const displayName = name.trim() || 'esta etiqueta';

    const confirmRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { labelName: displayName },
    });

    const result = await confirmRef.afterClosed().toPromise();

    if (result === true) {
      this.removeLabel(id);
    }
  }

  private removeLabel(id: string) {
    this.labels = this.labels.filter((l) => l.id !== id);
  }

  save() {
    const cleanedLabels = this.labels
      .filter((l) => l.name.trim() !== '')
      .map((l) => ({ ...l, name: l.name.trim() }));

    this.boardService.saveLabels(cleanedLabels);
    this.dialogRef.close(cleanedLabels);
  }
}
