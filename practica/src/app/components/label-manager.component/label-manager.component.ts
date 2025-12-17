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
import { CustomLabel } from '../../models/board.model';
import { BoardService } from '../../services/board';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
  templateUrl: './label-manager.component.html',
  styleUrls: ['./label-manager.component.css'],
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
