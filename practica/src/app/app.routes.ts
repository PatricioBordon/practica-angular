import { Routes } from '@angular/router';
import { KanbanComponent } from './features/kanban/kanban.component';

export const routes: Routes = [
  { path: '', component: KanbanComponent },
  { path: '**', redirectTo: '' }
];