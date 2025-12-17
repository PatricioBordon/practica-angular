import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Task } from '../models/board.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatCardModule, MatChipsModule],
  template: `
    <mat-card class="task-card">
      <mat-card-content>
        <h3>{{ task.title }}</h3>
        <p class="desc">{{ task.description }}</p>
        <div class="labels">
          @for (label of task.labels; track label.name) {
          <mat-chip [style.background-color]="label.color">
            {{ label.name }}
          </mat-chip>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
        margin: 8px 0;
      }
      .task-card {
        cursor: move;
        user-select: none;
      }
      h3 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        font-weight: 600;
      }
      .desc {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
      .labels {
        margin-top: 12px;
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      mat-chip {
        color: white;
        font-weight: 500;
      }
    `,
  ],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
}
