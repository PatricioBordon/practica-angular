import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatTabsModule,
  ],
  template: `
    <mat-toolbar class="navbar-light">
      <div class="container mx-auto flex items-center justify-between px-4">
        <nav mat-tab-nav-bar [tabPanel]="tabPanel" [mat-stretch-tabs]="false">
          <a mat-tab-link
             routerLink="/tareas"
             routerLinkActive #rla1="routerLinkActive"
             [active]="rla1.isActive">
             Tareas
          </a>
          <a mat-tab-link
             routerLink="/acerca"
             routerLinkActive #rla2="routerLinkActive"
             [active]="rla2.isActive">
             Acerca de
          </a>
        </nav>
      </div>
    </mat-toolbar>
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
  `,
  styles: [`
    .navbar-light {
      background-color: white;
      color: rgba(0,0,0,0.87);
      border-bottom: 1px solid #e0e0e0;
      height: 64px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    ::ng-deep .mat-mdc-tab-nav-bar-active-indicator {
      height: 3px !important;
      border-radius: 3px 3px 0 0;
    }

    .mat-mdc-tab-link {
      height: 64px;
      font-weight: 500;
      opacity: 0.7;
    }

    .mat-mdc-tab-link.mdc-tab--active {
      opacity: 1;
      color: #3f51b5;
    }
  `]
})
export class NavbarComponent {}