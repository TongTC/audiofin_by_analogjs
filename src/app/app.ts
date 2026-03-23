import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
  <app-nav/>
  <main class="app-content">
    <router-outlet />
  </main>
  <app-footer />`,
  styles: `
    :host {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-content {
      flex: 1;
    }
  `,
})
export class App {}
