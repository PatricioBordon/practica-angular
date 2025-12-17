import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="container mx-auto mt-12 px-4">
      <mat-card class="max-w-2xl mx-auto p-8 shadow-2xl">
        <mat-card-header>
          <mat-card-title class="text-4xl font-bold text-center">
            Práctica Angular 21
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="mt-8 text-lg space-y-6 text-gray-700">
          <p class="text-center">
            Una aplicación de tablero tipo Kanban en <strong>Angular 21</strong>
          </p>
          <ul class="list-disc list-inside space-y-3 mx-auto max-w-lg">
            <li>Standalone components y Signals para los labels, (si le cambio color o nombre de label, cambian los labels con el mismo id en todas las tareas)</li>
            <li>Drag & Drop con CDK</li>
            <li>Etiquetas personalizadas con colores</li>
            <li>Edición inline de columnas</li>
            <li>Persistencia con LocalStorage (un json para tareas, y otro para labels)</li>
            <li>
              Diseño responsive y moderno con Material (pude haber usado Bootstrap como en el video
              de
              <a
                href="https://www.youtube.com/watch?v=soInCF7nbDw"
                target="_blank"
                class="text-blue-600 hover:text-blue-800 underline font-semibold"
                >Sergie Code
              </a>
              pero opté por Material)
            </li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      a {
        transition: color 0.3s;
      }
      a:hover {
        text-decoration: underline !important;
      }
    `,
  ],
})
export class AcercaComponent {}
