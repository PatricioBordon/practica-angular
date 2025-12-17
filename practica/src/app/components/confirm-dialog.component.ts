import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent, MatDialogActions],
  template: `
    <h2 mat-dialog-title class="text-xl font-bold text-center">Confirmar eliminación</h2>

    <mat-dialog-content class="py-4">
      <p class="text-gray-700">
        ¿Estás seguro de que quieres eliminar la etiqueta
        <strong>"{{ data.labelName }}"</strong>?
      </p>
      <p class="text-sm text-gray-500 mt-3">
        Esta acción eliminará la etiqueta de todas las tareas donde esté aplicada.
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="gap-3">
      <button mat-button (click)="onCancel()" class="text-lg">Cancelar</button>
      <button mat-raised-button color="warn" (click)="onConfirm()" class="px-6">Eliminar</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { labelName: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
