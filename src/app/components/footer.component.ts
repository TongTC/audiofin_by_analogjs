import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="content">
        <a routerLink="/" class="brand">ElectronShop</a>
        <p class="tagline">Build faster with quality electronics components.</p>
        <p class="meta">&copy; {{ currentYear }} ElectronShop. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: `
    .site-footer {
      width: 100%;
      margin-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f8fafc;
    }

    .content {
      width: min(100%, 1280px);
      margin: 0 auto;
      padding: 1rem 1rem 1.25rem;
      text-align: center;
      color: #334155;
    }

    .brand {
      color: #1d4ed8;
      font-weight: 700;
      text-decoration: none;
      font-size: 1.1rem;
    }

    .tagline,
    .meta {
      margin: 0.5rem 0 0;
      font-size: 0.925rem;
    }

    .meta {
      color: #64748b;
    }

    @media (min-width: 768px) {
      .content {
        padding: 1.25rem 2rem;
      }
    }
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
