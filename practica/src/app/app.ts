import { Component } from '@angular/core';
import { KanbanComponent } from './features/kanban/kanban.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KanbanComponent],
  template: '<app-kanban />'
})
export class App {}