import { Routes } from '@angular/router';
import { KanbanComponent } from './features/kanban/kanban.component';
import { AcercaComponent } from './features/acerca/acerca.component';

export const routes: Routes = [
  { path: 'tareas', component: KanbanComponent },
  { path: 'acerca', component: AcercaComponent },
  { path: '', redirectTo: '/tareas', pathMatch: 'full' },
  { path: '**', redirectTo: '/tareas' }
];