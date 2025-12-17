import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board';
import { ColumnComponent } from '../../components/column/column.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatButtonModule, ColumnComponent],
  template: `
    <div class="container">
      <h1>Práctica - Angular 21</h1>

      <div class="board">
        @for (column of columns(); track column.id) {
        <app-column [column]="column" />
        }

        <div class="new-column">
          <input
            #input
            placeholder="Nueva lista..."
            (keyup.enter)="addColumn(input.value); input.value = ''"
            class="input"
          />
          <button
            mat-raised-button
            color="primary"
            (click)="addColumn(input.value); input.value = ''"
          >
            + Añadir lista
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 40px;
        background: #f4f5f7;
        min-height: 100vh;
      }
      h1 {
        text-align: center;
        color: #172b4d;
        margin-bottom: 40px;
        font-size: 2.5rem;
      }
      .board {
        display: flex;
        gap: 24px;
        overflow-x: auto;
        padding-bottom: 20px;
      }
      .new-column {
        background: #091e4214;
        border-radius: 12px;
        padding: 16px;
        width: 320px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .input {
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
      }
    `,
  ],
})
export class KanbanComponent {
  columns = computed(() => this.service.board().columns);
  constructor(private service: BoardService) {}

  addColumn(title: string) {
    if (title.trim()) this.service.addColumn(title.trim());
  }
}
