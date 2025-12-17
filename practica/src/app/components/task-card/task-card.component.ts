import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Task } from '../../models/board.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatCardModule, MatChipsModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css'],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
}
